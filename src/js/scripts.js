const fpPromise = import("https://openfpcdn.io/fingerprintjs/v4").then(
  (FingerprintJS) => FingerprintJS.load()
);

let submitBtn;
let btnText;
let spinner;

function setButtonLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.classList.toggle("hidden", isLoading);
  spinner.classList.toggle("hidden", !isLoading);
}

document.addEventListener("DOMContentLoaded", function () {
  submitBtn = document.getElementById("submit-btn");
  btnText = submitBtn.querySelector(".btn-text");
  spinner = submitBtn.querySelector(".spinner");

  const form = document.querySelector("form");

  const commentInput = document.getElementById("comment-input");
  document.querySelectorAll('input[name="score"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (commentInput) {
        commentInput.focus();
      }
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const score = document.querySelector('input[name="score"]:checked');
    const comment = document.querySelector('input[name="comment"]').value;

    if (!score) {
      alert("Por favor, selecione uma nota.");
      return;
    }

    setButtonLoading(true);

    try {
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      const payload = {
        score: Number(score.value),
        comment: comment.trim(),
        visitorId,
      };

      const response = await fetch("http://localhost:8080/create-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao enviar feedback");

      form.reset();
      window.location = "src/html/thanks.html";
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setButtonLoading(false);
    }
  });
});
