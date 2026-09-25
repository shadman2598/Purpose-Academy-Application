import type { SourceRef } from "./model";

const reviewed = "2026-09-24";
const version = "1.0.0";

function source(
  partial: Omit<SourceRef, "lastReviewed" | "contentVersion">,
): SourceRef {
  return { ...partial, lastReviewed: reviewed, contentVersion: version };
}

export const SOURCES = {
  albertaOhs: source({
    sourceTitle: "OHS Act, Regulation and Code",
    organization: "Government of Alberta",
    url: "https://www.alberta.ca/ohs-act-regulation-code",
    jurisdiction: "Alberta",
  }),
  albertaFall: source({
    sourceTitle: "OHS Code, Part 9, Fall Protection",
    organization: "Government of Alberta",
    url: "https://search-ohs-laws.alberta.ca/legislation/occupational-health-and-safety-code/part-9-fall-protection/",
    jurisdiction: "Alberta",
  }),
  ccohsFall: source({
    sourceTitle: "Fall Protection — Legislation",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/hsprograms/fall/fall_protection_legislation.html",
    jurisdiction: "Canada (provincial comparison, including Alberta)",
  }),
  hierarchy: source({
    sourceTitle: "Hazard and Risk — Hierarchy of Controls",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hierarchy_controls.html",
    jurisdiction: "Canada",
  }),
  hazardControl: source({
    sourceTitle: "Hazard and Risk — Hazard Control",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hazard_control.html",
    jurisdiction: "Canada",
  }),
  pictograms: source({
    sourceTitle: "WHMIS — Pictograms",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/pictograms.html",
    jurisdiction: "Canada (federal WHMIS)",
  }),
  labels: source({
    sourceTitle: "WHMIS — Labels",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/labels.html",
    jurisdiction: "Canada (federal WHMIS)",
  }),
  sds: source({
    sourceTitle: "WHMIS — Safety Data Sheet (SDS)",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/sds.html",
    jurisdiction: "Canada (federal WHMIS)",
  }),
  whmisSuppliers: source({
    sourceTitle: "WHMIS — Information for Suppliers and Importers",
    organization: "Canadian Centre for Occupational Health and Safety",
    url: "https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/information-for-suppliers-importers.html",
    jurisdiction: "Canada (federal WHMIS)",
  }),
};
