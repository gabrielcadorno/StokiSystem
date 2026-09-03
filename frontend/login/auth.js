const authForm = document.querySelector("[data-auth-form]");
const passwordToggles = document.querySelectorAll("[data-password-toggle]");

function getErrorElement(input) {
  return document.getElementById(input.getAttribute("aria-describedby"));
}

function setFieldState(input, isValid, message) {
  const error = getErrorElement(input);

  input.classList.toggle("invalid", !isValid);
  input.setAttribute("aria-invalid", String(!isValid));

  if (error) {
    if (message) error.textContent = message;
    error.classList.toggle("visible", !isValid);
  }
}

function validateField(input) {
  let isValid = input.validity.valid;
  let message = input.dataset.error || "Verifique este campo.";
  const matchingFieldId = input.dataset.match;

  if (matchingFieldId && input.value !== document.getElementById(matchingFieldId).value) {
    isValid = false;
    message = input.dataset.matchError || "Os valores informados não coincidem.";
  }

  setFieldState(input, isValid, message);
  return isValid;
}

passwordToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const passwordInput = document.getElementById(toggle.dataset.passwordToggle);
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    toggle.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Exibir senha");
    toggle.setAttribute("aria-pressed", String(isPassword));
  });
});

if (authForm) {
  const fields = [...authForm.querySelectorAll("input[required]")];

  fields.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(input);

      const dependentField = authForm.querySelector(`[data-match="${input.id}"]`);
      if (dependentField?.classList.contains("invalid")) validateField(dependentField);
    });
  });

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fieldsAreValid = fields.map(validateField).every(Boolean);
    const firstInvalidField = fields.find((input) => input.getAttribute("aria-invalid") === "true");

    if (!fieldsAreValid) {
      firstInvalidField?.focus();
      return;
    }

    const feedback = document.querySelector("[data-form-feedback]");
    if (feedback) feedback.classList.add("visible");

    // Conecte aqui a autenticação do sistema.
    console.log(`${authForm.dataset.authForm}: formulário validado.`);
  });
}
