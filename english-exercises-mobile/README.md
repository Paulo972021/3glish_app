# english-exercises-mobile

Esqueleto Expo + TypeScript do app mobile MVP para consumo de packs de exercícios.

## Inclui nesta etapa

- Importação de pack zip com `expo-document-picker` + `jszip`.
- Persistência local SQLite (`expo-sqlite`) com `payload_json` e `ui_model_json`.
- Dispatcher por `view_type` e componentes base das 6 modalidades.
- Motor de grading centralizado e normalização básica.
- Player de áudio (`expo-av`) com presets de velocidade.

## Rodar

```bash
npm install
npm run start
```
