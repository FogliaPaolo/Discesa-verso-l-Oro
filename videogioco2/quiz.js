const input = document.getElementById("quiz-answer");
const button = document.getElementById("quiz-check");
const result = document.getElementById("quiz-result");

button.addEventListener("click", () => {
  const value = (input.value || "").trim().toLowerCase();

  if (!value) {
    result.innerHTML = '<span class="quiz-ko">Per favore inserisci una risposta.</span>';
    return;
  }

  if (value === "3" || value === "tre") {
    result.innerHTML =
      '<span class="quiz-ok">Risposta corretta! Hai guadagnato una vita extra!</span>';
  } else {
    result.innerHTML =
      '<span class="quiz-ko">Risposta sbagliata... ma puoi sempre riprovare la discesa!</span>';
  }
});