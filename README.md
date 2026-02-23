# 3glish App — Mobile MVP (Offline)

Este repositório define a base técnica do MVP mobile para consumo de exercícios de inglês em 6 modalidades com importação de pack `.zip`, progresso local e áudio com controle de velocidade.

## Entregáveis desta fase

- Contrato de pack/documentação funcional e técnica.
- JSON Schemas para `manifest`, `exercise`, `attempt` e `ui_adapter`.
- Schema SQL local para persistência offline (SQLite).
- Validador de pack em streaming (`tools/validate_pack.py`).
- Adapter de exercício bruto para UI model (`tools/ui_adapter.py`).

## Fluxo de alto nível

1. Usuário importa um arquivo `.zip` no app.
2. App valida `manifest.json` e `exercises.jsonl` em streaming.
3. App indexa exercícios por `exercise_id` no banco local.
4. Sessão de resolução grava `attempts` e atualiza métricas globais.
5. Pronúncia permite play/pause/replay e velocidade (0.75x a 1.50x).

## Estrutura

- `docs/pack-contract.md`: contrato e regras de validação do pack.
- `schemas/*.schema.json`: contratos formais para validação.
- `sql/schema.sql`: estrutura de armazenamento local.
- `tools/validate_pack.py`: validação mínima de importação.
- `tools/ui_adapter.py`: derivação de UI model por modalidade.

## Uso rápido do validador

```bash
python3 tools/validate_pack.py /caminho/pack.zip
```

Saída:
- código `0`: pack válido (com ou sem avisos)
- código `1`: pack inválido

> Observação: avisos (por exemplo, `audio_file` faltando) não bloqueiam importação.
