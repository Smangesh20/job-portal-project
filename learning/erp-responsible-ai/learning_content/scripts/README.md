# Editable Step Scripts (Legacy Path)

This is a legacy compatibility path.
Primary editable path is now `scripts/...`.

## Folder layout

`learning_content/scripts/<process>/<erp>/step_XX.json`

Examples:
- `learning_content/scripts/procure_to_pay/oracle_ebs_r12/step_01.json`
- `learning_content/scripts/order_to_cash/sap_s4hana/step_03.json`

## Editable fields

- `speech_text`: Main voice narration text for this step.
- `detailed_explanation`: Text shown in optional support section.
- `question`: Prompt used for optional written answer.
- `expected_keywords`: Keywords used to score optional written answer.
- `story_title`: Label shown in Story mode.

You can edit any value and rerun the app. The app will consume your changes directly.
