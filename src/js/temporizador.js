const form = document.getElementById("nps-form");
const radios = document.querySelectorAll('input[name="score"]');
const commentField = document.querySelector('input[name="comment"]');

let typingTimeout = null;
let submitTimeout = null;

function startAutoSubmitCountdown() {
  submitTimeout = setTimeout(() => {
    form.submit();
  }, 5000);
}

function resetTypingTimer() {
  if (submitTimeout) clearTimeout(submitTimeout);
  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    startAutoSubmitCountdown();
  }, 2000);
}

commentField.addEventListener("input", () => {
  resetTypingTimer();
});

radios.forEach(radio => {
  radio.addEventListener("change", () => {
    commentField.focus();

    if (submitTimeout) clearTimeout(submitTimeout);
    submitTimeout = setTimeout(() => {
      form.submit();
    }, 10000);
  });
});
