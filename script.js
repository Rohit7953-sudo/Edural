

// === FEEDBACK FORM HANDLER ===
const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");

document.addEventListener("DOMContentLoaded", () => {
  const storedFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];
  storedFeedback.forEach(addFeedbackToDOM);
});

feedbackForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && email && message) {
    const feedback = { name, email, message };
    addFeedbackToDOM(feedback);

    const storedFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];
    storedFeedback.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(storedFeedback));

    feedbackForm.reset();
  }
});

function addFeedbackToDOM({ name, email, message }) {
  const div = document.createElement("div");
  div.classList.add("feedback-item");
  div.innerHTML = `<strong>${name}</strong> (${email})<br/>${message}`;
  feedbackList.prepend(div);
}
