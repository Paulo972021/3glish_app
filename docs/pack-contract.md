# Contrato do Pack (MVP)

## 1. Layout do arquivo `.zip`

```text
<pack-root>/
  manifest.json                  # obrigatório
  exercises.jsonl                # obrigatório
  base_sentences.jsonl           # opcional
  audio/                          # opcional
  audio/<YYYY-MM-DD>/             # opcional
  audio/<YYYY-MM-DD>/<exercise_id>.wav  # opcional
```

## 2. `manifest.json`

Campos obrigatórios mínimos:

- `schema_version` (string)
- `pack_id` (string)
- `date` (ISO date)
- `files.exercises_jsonl` (string)

Campos recomendados:

- `counts`
- `language_pair`
- `weekly_word`
- `integrity.sha256`
- `pronunciation`

### Exemplo

```json
{
  "schema_version": "1.0.0",
  "pack_id": "2026-02-22_although",
  "date": "2026-02-22",
  "run_id": "run_2026-02-22_although",
  "weekly_word": "although",
  "language_pair": "pt-BR__en-US",
  "counts": {
    "base_sentences": 1000,
    "exercises_total": 6000,
    "by_modality": {
      "translation": 1000,
      "reverse_translation": 1000,
      "fill_blank": 1000,
      "multiple_choice": 1000,
      "true_false": 1000,
      "pronunciation": 1000
    }
  },
  "files": {
    "exercises_jsonl": "exercises.jsonl",
    "base_sentences_jsonl": "base_sentences.jsonl",
    "audio_root": "audio/"
  }
}
```

## 3. `exercises.jsonl`

Cada linha deve conter 1 objeto JSON válido com:

- `exercise_id` (único no pack)
- `modality` em:
  - `translation`
  - `reverse_translation`
  - `fill_blank`
  - `multiple_choice`
  - `true_false`
  - `pronunciation`
- `answers[]` com pelo menos 1 entrada

### Regra crítica

Para `pronunciation`, quando `audio_file` existir:

- **deve ser relativo ao pack**
- não pode ser caminho absoluto (`C:\...`, `R:\...`, `/...`)

## 4. Persistência local (attempts)

Resultados permitidos:

- Modalidades avaliáveis: `correct`, `wrong`
- `pronunciation`: `done_no_grade`

Contadores globais:

- `feitos`: incrementa em toda conclusão
- `certos`: incrementa para `correct`
- `errados`: incrementa para `wrong`
- `done_no_grade` impacta apenas `feitos`

## 5. Política de importação

Erros bloqueantes (rejeita import):

- `manifest.json` ausente/inválido
- `schema_version` desconhecido
- `exercises_jsonl` ausente
- linha inválida de JSONL
- `exercise_id` duplicado

Avisos (importa com aviso):

- `pronunciation.audio_file` apontando para arquivo ausente no zip
- pack sem áudio
- inconsistências em `counts` declarados vs. contados
