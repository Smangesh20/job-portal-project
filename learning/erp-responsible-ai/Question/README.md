# Editable Step Questions

Each step MCQ is loaded from:

`Question/<process>/<erp>/step_XX.json`

Example:

`Question/procure_to_pay/erpnext/step_01.json`

Important:
- First run: if step JSON is missing, the app creates it automatically.
- If step JSON already exists, the app reads that exact file.
- The active source file path is shown in the app as `Question source: ...`.
