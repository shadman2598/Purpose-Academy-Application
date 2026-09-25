import type { TrainingModule } from "./model";
import { conduct } from "./modules/conduct";
import { emergency } from "./modules/emergency";
import { falls } from "./modules/falls";
import { hazardsModule } from "./modules/hazards";
import { orientation } from "./modules/orientation";
import { ppe } from "./modules/ppe";
import { report } from "./modules/report";
import { shift } from "./modules/shift";
import { tools } from "./modules/tools";
import { whmis } from "./modules/whmis";

export const MODULES: TrainingModule[] = [
  orientation,
  ppe,
  hazardsModule,
  tools,
  falls,
  whmis,
  conduct,
  report,
  emergency,
  shift,
];

export function getModule(id: string | undefined): TrainingModule | undefined {
  return MODULES.find((module) => module.id === id);
}
