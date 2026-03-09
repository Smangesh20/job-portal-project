/**
 * Property-Based Tests for Form Error Handling
 * Property 10 (form portion): field-level errors are deterministic, scoped,
 * and preserve existing form state on failed submissions.
 */

const fc = require("fast-check");
const {
  createFieldErrorState,
  hasFieldErrors,
  mapApiFieldErrors,
  mergeFieldErrors,
} = require("./formErrorUtils");

describe("Property-Based Tests: formErrorUtils", () => {
  const allowedFields = ["name", "email", "password", "contactNumber", "general"];

  test("maps API validation errors only to allowed fields", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            field: fc.string({ minLength: 1, maxLength: 20 }),
            message: fc.string({ minLength: 1, maxLength: 80 }),
          }),
          { minLength: 0, maxLength: 30 }
        ),
        (details) => {
          const mapped = mapApiFieldErrors(details, { allowedFields });
          const keys = Object.keys(mapped);

          keys.forEach((key) => {
            expect(allowedFields.includes(key)).toBe(true);
            expect(typeof mapped[key]).toBe("string");
            expect(mapped[key].length).toBeGreaterThan(0);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("mergeFieldErrors preserves existing field keys and updates only provided keys", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 60 }),
        fc.string({ minLength: 1, maxLength: 60 }),
        (emailError, passwordError) => {
          const base = createFieldErrorState(["email", "password", "name"]);
          base.email = emailError;

          const merged = mergeFieldErrors(base, { password: passwordError });

          expect(merged.email).toBe(emailError);
          expect(merged.password).toBe(passwordError);
          expect(Object.prototype.hasOwnProperty.call(merged, "name")).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("hasFieldErrors is true iff at least one field has a non-empty message", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 20 }), {
          minLength: 1,
          maxLength: 10,
        }),
        (messages) => {
          const errors = messages.reduce((acc, message, index) => {
            acc[`field${index}`] = message;
            return acc;
          }, {});

          const expected = messages.some((message) => Boolean(message));
          expect(hasFieldErrors(errors)).toBe(expected);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
