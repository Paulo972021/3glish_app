#!/usr/bin/env python3
"""Adapter de exercício bruto -> UI model render-ready."""

from __future__ import annotations

import json
import re
from typing import Any


def normalize_text(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"\s+", " ", value)
    return value


def _explanations(exercise: dict[str, Any]) -> list[str]:
    answers = exercise.get("answers") or []
    out: list[str] = []
    for answer in answers:
        exp = answer.get("explanation_pt")
        if isinstance(exp, str) and exp.strip():
            out.append(exp)
    return out


def _accepted_answers(exercise: dict[str, Any]) -> list[str]:
    answers = exercise.get("answers") or []
    return [a["text"] for a in answers if isinstance(a, dict) and isinstance(a.get("text"), str)]


def to_ui_model(exercise: dict[str, Any]) -> dict[str, Any]:
    modality = exercise.get("modality")
    explanations = _explanations(exercise)
    accepted_answers = _accepted_answers(exercise)

    if modality == "translation":
        return {
            "view_type": "free_text",
            "title": "Traduza",
            "prompt_blocks": [{"type": "text", "value": exercise.get("prompt", "")}],
            "input_spec": {
                "kind": "text",
                "placeholder": "Digite sua resposta...",
                "max_chars": 300,
            },
            "grading_spec": {
                "gradable": True,
                "kind": "match_any_answer",
                "normalization": {"trim": True, "lowercase": True, "collapse_spaces": True},
                "accepted_answers": accepted_answers,
            },
            "feedback_spec": {
                "show_after_submit": True,
                "explanations_pt": explanations,
            },
        }

    if modality == "reverse_translation":
        return {
            "view_type": "free_text",
            "title": "Traduza para PT-BR",
            "prompt_blocks": [{"type": "text", "value": exercise.get("sentence_en", "")}],
            "input_spec": {
                "kind": "text",
                "placeholder": "Tradução em português...",
                "max_chars": 300,
            },
            "grading_spec": {
                "gradable": True,
                "kind": "match_any_answer",
                "normalization": {"trim": True, "lowercase": True, "collapse_spaces": True},
                "accepted_answers": accepted_answers,
            },
            "feedback_spec": {
                "show_after_submit": True,
                "explanations_pt": explanations,
            },
        }

    if modality == "fill_blank":
        return {
            "view_type": "fill_blank_single",
            "title": "Complete a lacuna",
            "prompt_blocks": [{"type": "text", "value": exercise.get("blanked_sentence_en", "")}],
            "input_spec": {
                "kind": "text",
                "placeholder": "Digite a palavra que falta...",
                "max_chars": 40,
                "hint": exercise.get("blank_token", ""),
            },
            "grading_spec": {
                "gradable": True,
                "kind": "match_any_answer",
                "normalization": {"trim": True, "lowercase": True, "collapse_spaces": True},
                "accepted_answers": accepted_answers,
            },
            "feedback_spec": {
                "show_after_submit": True,
                "explanations_pt": explanations,
            },
        }

    if modality == "multiple_choice":
        return {
            "view_type": "multiple_choice",
            "title": "Escolha a opção correta",
            "prompt_blocks": [{"type": "text", "value": exercise.get("question", "")}],
            "input_spec": {
                "kind": "single_choice",
                "options": exercise.get("options", []),
            },
            "grading_spec": {
                "gradable": True,
                "kind": "index_equals",
                "correct_index": exercise.get("correct_index", -1),
            },
            "feedback_spec": {
                "show_after_submit": True,
                "explanations_pt": explanations,
            },
        }

    if modality == "true_false":
        return {
            "view_type": "true_false",
            "title": "Verdadeiro ou Falso",
            "prompt_blocks": [{"type": "text", "value": exercise.get("statement", "")}],
            "input_spec": {
                "kind": "boolean_choice",
                "labels": {"true": "Verdadeiro", "false": "Falso"},
            },
            "grading_spec": {
                "gradable": True,
                "kind": "boolean_equals_label",
                "label_source": exercise.get("label", ""),
                "label_mapping": {
                    "true_values": ["verdadeiro", "true", "v"],
                    "false_values": ["falso", "false", "f"],
                },
            },
            "feedback_spec": {
                "show_after_submit": True,
                "explanations_pt": explanations,
            },
        }

    if modality == "pronunciation":
        return {
            "view_type": "pronunciation_audio",
            "title": "Pronúncia",
            "prompt_blocks": [
                {"type": "text", "value": exercise.get("sentence_en", "")},
                {"type": "hint", "value": exercise.get("pronunciation_hint", "")},
                {"type": "meta", "value": f"Voz: {exercise.get('voice', '')}"},
            ],
            "input_spec": {
                "kind": "no_grade",
                "actions": ["played", "replayed", "self_rating_optional"],
            },
            "grading_spec": {
                "gradable": False,
                "result_on_complete": "done_no_grade",
            },
            "audio_spec": {
                "path": exercise.get("audio_file"),
                "controls": {
                    "show_speed": True,
                    "speed_presets": [0.75, 1.0, 1.25, 1.5],
                    "default_speed": 1.0,
                },
            },
            "feedback_spec": {
                "show_after_submit": False,
            },
        }

    raise ValueError(f"modality não suportada: {modality!r}")


def _main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Converte 1 exercício JSON em UI model")
    parser.add_argument("exercise_json", help="Arquivo JSON com exercício")
    args = parser.parse_args()

    with open(args.exercise_json, "r", encoding="utf-8") as fp:
        exercise = json.load(fp)

    ui_model = to_ui_model(exercise)
    print(json.dumps(ui_model, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main())
