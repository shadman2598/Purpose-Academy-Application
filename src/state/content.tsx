import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MODULES } from "../content/catalog";
import type { Block, SourceRef, TrainingModule } from "../content/model";

export interface CatalogPayload {
  overrides: {
    id: string;
    title: string;
    mapLabel: string;
    description: string;
    completionXp: number;
    passingScore: number;
    published: boolean;
    jurisdictionId: string;
    warnings: string;
    createdInAdmin: boolean;
    estimatedMinutes: number;
  }[];
  blocks: Record<string, Block[]>;
  created: TrainingModule[];
  sources?: Record<string, SourceRef[]>;
}

function merge(payload: CatalogPayload | null): TrainingModule[] {
  if (!payload) return MODULES;
  const hidden = new Set(payload.overrides.filter((item) => !item.published).map((item) => item.id));
  const byId = new Map(payload.overrides.map((item) => [item.id, item]));
  const base = MODULES.filter((module) => !hidden.has(module.id)).map((module) => {
    const override = byId.get(module.id);
    const extra = payload.blocks[module.id] ?? [];
    const addedSources = payload.sources?.[module.id] ?? [];
    if (!override && extra.length === 0 && addedSources.length === 0) return module;
    return {
      ...module,
      title: override?.title ?? module.title,
      mapLabel: override?.mapLabel ?? module.mapLabel,
      description: override?.description ?? module.description,
      completionXp: override?.completionXp ?? module.completionXp,
      passingScore: override?.passingScore ?? module.passingScore ?? 70,
      estimatedMinutes: override?.estimatedMinutes ?? module.estimatedMinutes,
      blocks: [...module.blocks, ...extra],
      sources: [
        ...module.sources.map((source) => {
          const extra = addedSources.find((item) => item.url === source.url);
          return extra ? { ...source, sourceReference: extra.sourceReference } : source;
        }),
        ...addedSources.filter((source) => !module.sources.some((item) => item.url === source.url)),
      ],
    };
  });
  return [...base, ...payload.created.filter((module) => !hidden.has(module.id))];
}

const ContentContext = createContext<{ modules: TrainingModule[]; refresh: () => void }>({
  modules: MODULES,
  refresh: () => undefined,
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<CatalogPayload | null>(null);
  const refresh = () => {
    fetch("/api/catalog")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: CatalogPayload | null) => setPayload(data))
      .catch(() => setPayload(null));
  };
  useEffect(() => {
    refresh();
  }, []);
  const modules = useMemo(() => merge(payload), [payload]);
  return <ContentContext.Provider value={{ modules, refresh }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
