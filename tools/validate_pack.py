#!/usr/bin/env python3
"""Validador mínimo para pack zip do 3glish app.

Regras:
- valida manifest básico e schema_version
- valida existência de exercises.jsonl
- processa JSONL em streaming (linha a linha)
- confere exercise_id único
- confere modalidade válida
- confere answers[] mínimo
- para pronunciation com audio_file, garante path relativo e avisa se arquivo não existir
- para multiple_choice, valida correct_index < len(options)
- para true_false, valida label dentro do mapeamento esperado
"""

from __future__ import annotations

import json
import re
import sys
import zipfile
from dataclasses import dataclass, field
from pathlib import PurePosixPath
from typing import Dict, List

VALID_MODALITIES = {
    "translation",
    "reverse_translation",
    "fill_blank",
    "multiple_choice",
    "true_false",
    "pronunciation",
}
SUPPORTED_SCHEMA_VERSIONS = {"1.0.0"}
ABS_PATH_RE = re.compile(r"^(?:[A-Za-z]:\\|/)")
TRUE_VALUES = {"verdadeiro", "true", "v"}
FALSE_VALUES = {"falso", "false", "f"}


@dataclass
class ValidationState:
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    total_exercises: int = 0
    by_modality: Dict[str, int] = field(default_factory=dict)

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)


def _read_manifest(zf: zipfile.ZipFile, state: ValidationState) -> dict | None:
    try:
        with zf.open("manifest.json") as fp:
            data = json.load(fp)
    except KeyError:
        state.error("manifest.json ausente")
        return None
    except json.JSONDecodeError as exc:
        state.error(f"manifest.json inválido: {exc}")
        return None

    version = data.get("schema_version")
    if version not in SUPPORTED_SCHEMA_VERSIONS:
        state.error(f"schema_version não suportado: {version!r}")

    files = data.get("files") or {}
    if not isinstance(files, dict) or not files.get("exercises_jsonl"):
        state.error("manifest.files.exercises_jsonl ausente")

    return data


def _is_relative_pack_path(path: str) -> bool:
    if ABS_PATH_RE.match(path):
        return False
    posix = PurePosixPath(path)
    if posix.is_absolute():
        return False
    return ".." not in posix.parts


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


def _validate_true_false(ex: dict, line_no: int, state: ValidationState) -> None:
    label = ex.get("label")
    if not isinstance(label, str) or not label.strip():
        state.error(f"linha {line_no}: true_false.label ausente/inválido")
        return

    normalized = _normalize_text(label)
    if normalized not in TRUE_VALUES and normalized not in FALSE_VALUES:
        state.error(
            f"linha {line_no}: true_false.label fora do mapeamento esperado: {label!r}"
        )


def _validate_multiple_choice(ex: dict, line_no: int, state: ValidationState) -> None:
    options = ex.get("options")
    correct_index = ex.get("correct_index")

    if not isinstance(options, list) or len(options) < 2:
        state.error(f"linha {line_no}: multiple_choice.options inválido (mínimo 2)")
        return

    if not isinstance(correct_index, int):
        state.error(f"linha {line_no}: multiple_choice.correct_index ausente/inválido")
        return

    if correct_index < 0 or correct_index >= len(options):
        state.error(
            f"linha {line_no}: multiple_choice.correct_index fora do range ({correct_index} >= {len(options)})"
        )


def _validate_exercise(ex: dict, line_no: int, names: set[str], state: ValidationState) -> None:
    ex_id = ex.get("exercise_id")
    modality = ex.get("modality")
    answers = ex.get("answers")

    if not ex_id or not isinstance(ex_id, str):
        state.error(f"linha {line_no}: exercise_id ausente/inválido")
        return

    if ex_id in names:
        state.error(f"linha {line_no}: exercise_id duplicado: {ex_id}")
    else:
        names.add(ex_id)

    if modality not in VALID_MODALITIES:
        state.error(f"linha {line_no}: modality inválida: {modality!r}")
        return

    if not isinstance(answers, list) or len(answers) == 0:
        state.error(f"linha {line_no}: answers[] ausente ou vazio")

    if modality == "multiple_choice":
        _validate_multiple_choice(ex, line_no, state)
    elif modality == "true_false":
        _validate_true_false(ex, line_no, state)

    state.total_exercises += 1
    state.by_modality[modality] = state.by_modality.get(modality, 0) + 1


def validate_pack(zip_path: str) -> ValidationState:
    state = ValidationState()

    try:
        zf = zipfile.ZipFile(zip_path)
    except FileNotFoundError:
        state.error(f"arquivo não encontrado: {zip_path}")
        return state
    except zipfile.BadZipFile:
        state.error(f"zip inválido: {zip_path}")
        return state

    with zf:
        manifest = _read_manifest(zf, state)
        if manifest is None:
            return state

        exercises_name = manifest.get("files", {}).get("exercises_jsonl")
        zip_names = set(zf.namelist())
        try:
            with zf.open(exercises_name) as fp:
                seen_ids: set[str] = set()
                for line_no, raw_line in enumerate(fp, start=1):
                    line = raw_line.decode("utf-8").strip()
                    if not line:
                        continue
                    try:
                        ex = json.loads(line)
                    except json.JSONDecodeError as exc:
                        state.error(f"linha {line_no}: json inválido ({exc})")
                        continue

                    _validate_exercise(ex, line_no, seen_ids, state)

                    if ex.get("modality") == "pronunciation" and ex.get("audio_file"):
                        audio_file = ex["audio_file"]
                        if not isinstance(audio_file, str) or not _is_relative_pack_path(audio_file):
                            state.error(
                                f"linha {line_no}: audio_file deve ser path relativo ao pack: {audio_file!r}"
                            )
                        elif audio_file not in zip_names:
                            state.warn(
                                f"linha {line_no}: audio_file não encontrado no zip: {audio_file}"
                            )
        except KeyError:
            state.error(f"arquivo de exercícios não encontrado no zip: {exercises_name!r}")

        declared_total = (manifest.get("counts") or {}).get("exercises_total")
        if isinstance(declared_total, int) and declared_total != state.total_exercises:
            state.warn(
                "counts.exercises_total divergente: "
                f"manifest={declared_total}, lido={state.total_exercises}"
            )

    return state


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Uso: python3 tools/validate_pack.py <pack.zip>")
        return 1

    state = validate_pack(argv[1])

    if state.errors:
        print("❌ Pack inválido")
        for err in state.errors:
            print(f"  - {err}")
    else:
        print("✅ Pack válido")

    if state.warnings:
        print("⚠️ Avisos")
        for warn in state.warnings:
            print(f"  - {warn}")

    print("Resumo:")
    print(f"  exercícios: {state.total_exercises}")
    for modality in sorted(state.by_modality):
        print(f"  - {modality}: {state.by_modality[modality]}")

    return 1 if state.errors else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
