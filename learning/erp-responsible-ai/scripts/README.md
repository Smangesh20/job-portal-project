# Editable Step Scripts

Each step narration is loaded from:

`scripts/<process>/<erp>/step_XX.json`

Example:

`scripts/procure_to_pay/erpnext/step_01.json`

Important:
- First run: if step JSON is missing, the app creates it automatically.
- If step JSON already exists, the app reads that exact file.
- The active source file path is shown in the app as `Script source: ...`.
