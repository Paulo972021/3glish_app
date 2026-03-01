export type Modality =
  | "translation"
  | "reverse_translation"
  | "fill_blank"
  | "multiple_choice"
  | "true_false"
  | "pronunciation";

export type ViewType =
  | "free_text"
  | "fill_blank_single"
  | "multiple_choice"
  | "true_false"
  | "pronunciation_audio";

export type PromptBlock =
  | { type: "text"; value: string }
  | { type: "hint"; value: string }
  | { type: "meta"; value: string };

export type UiModel = {
  schema_version?: "1.0.0";
  exercise_id: string;
  pack_id: string;
  modality: Modality;
  view_type: ViewType;
  title: string;
  prompt_blocks: PromptBlock[];
  input_spec: any;
  grading_spec: any;
  audio_spec: null | {
    path: string | null;
    controls?: {
      show_speed?: boolean;
      speed_presets?: number[];
      default_speed?: number;
    };
  };
  feedback_spec: any;
};

export type AttemptResult = "correct" | "wrong" | "done_no_grade";

export type Attempt = {
  attempt_id: string;
  pack_id: string;
  exercise_id: string;
  modality: Modality;
  ts: string;
  result: AttemptResult;
  user_answer?: string | null;
  pronunciation_metrics?: {
    played_count: number;
    speed: number;
    self_rating?: "ok" | "hard" | null;
  } | null;
};
