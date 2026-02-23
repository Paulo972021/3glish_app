import { UiModel } from "../contracts/types";

const SUPPORTED_VIEW_TYPES = [
  "free_text",
  "fill_blank_single",
  "multiple_choice",
  "true_false",
  "pronunciation_audio",
] as const;

export function assertSupportedViewType(ui: UiModel) {
  if (!SUPPORTED_VIEW_TYPES.includes(ui.view_type as (typeof SUPPORTED_VIEW_TYPES)[number])) {
    throw new Error(`view_type não suportado: ${ui.view_type}`);
  }
}
