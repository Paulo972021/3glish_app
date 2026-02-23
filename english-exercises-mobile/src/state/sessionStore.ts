export type QueueMode = "mixed" | "by_modality";

type SessionState = {
  current_pack_id: string | null;
  queue_mode: QueueMode;
  current_exercise_id: string | null;
  counters_global: {
    done_total: number;
    correct_total: number;
    wrong_total: number;
    done_pronunciation_total: number;
  };
};

const state: SessionState = {
  current_pack_id: null,
  queue_mode: "mixed",
  current_exercise_id: null,
  counters_global: {
    done_total: 0,
    correct_total: 0,
    wrong_total: 0,
    done_pronunciation_total: 0,
  },
};

export function getSessionState(): SessionState {
  return state;
}

export function setCurrentPack(packId: string | null): void {
  state.current_pack_id = packId;
}
