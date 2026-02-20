/**
 * Реэкспорт единого источника кейсов (content/cases-landing/cases.json).
 * Реализация в lib/cases/getCases.ts.
 */
import {
  getAllCases,
  getCaseBySlug,
  getLandingSlugs,
  type Case,
  type CaseKpi,
  type CaseProcess,
} from "@/lib/cases/getCases";

export type CaseLandingKpi = CaseKpi;
export type CaseLandingProcess = CaseProcess;
export type CaseLandingItem = Case;

export const getCasesLanding = getAllCases;
export const getCaseBySlugLanding = getCaseBySlug;
export { getLandingSlugs };
