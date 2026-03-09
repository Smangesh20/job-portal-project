# Editable Step Questions (Legacy Path)

This is a legacy compatibility path.
Primary editable path is now `Question/...`.

## Folder layout

`learning_content/Question/<process>/<erp>/step_XX.json`

Examples:
- `learning_content/Question/procure_to_pay/oracle_ebs_r12/step_01.json`
- `learning_content/Question/order_to_cash/sap_s4hana/step_03.json`

## Editable fields

- `question`: The MCQ prompt shown in the app.
- `options`: Option list shown in radio buttons.
- `correct_option_index`: Preferred way to define the correct answer (`0`-based index).
- `correct_option`: Optional direct text match for the correct answer.
- `spoken_prompt`: Voice narration of question/options.
- `explain_correct`: Feedback when user selects the correct answer.

Recommendation:
- Keep `correct_option_index` aligned with your `options` list after editing.
