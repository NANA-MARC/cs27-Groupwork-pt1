const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const apiUrlInput = document.getElementById("apiUrl");
const sendButton = document.getElementById("sendButton");

const addMessage = (content, role) => {
  const bubble = document.createElement("div");
  bubble.className = `message message--${role}`;
  bubble.textContent = content;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
};

const setSendingState = (isSending) => {
  sendButton.disabled = isSending;
  messageInput.disabled = isSending;
  sendButton.textContent = isSending ? "En cours..." : "Envoyer";
};

addMessage(
  "Bonjour ! Décrivez votre demande ou posez votre question.",
  "bot"
);

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = messageInput.value.trim();
  if (!content) {
    return;
  }

  addMessage(content, "user");
  messageInput.value = "";

  const typingBubble = addMessage("L'assistant écrit...", "typing");
  setSendingState(true);

  const payload = {
    message: content,
  };

  try {
    const response = await fetch(apiUrlInput.value, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const reply =
      data.reply ||
      data.response ||
      data.answer ||
      data.message ||
      "Désolé, je n'ai pas reçu de réponse.";

    typingBubble.remove();
    addMessage(reply, "bot");
  } catch (error) {
    typingBubble.remove();
    addMessage(
      "Erreur de connexion. Vérifiez l'URL de votre API et réessayez.",
      "bot"
    );
  } finally {
    setSendingState(false);
    messageInput.focus();
  }
});
