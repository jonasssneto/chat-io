const socket = io("http://localhost:3000/");
let nickname = "";

function joinChat() {
  nickname = document.getElementById("nickname").value;
  if (nickname.trim() === "") {
    alert("Please enter a nickname.");
    return;
  }
  document.getElementById("nicknameInput").style.display = "none";
  document.getElementById("chatContainer").style.display = "block";
  socket.emit("join", { username: nickname, room: "default" });
  socket.emit("loadPreviousMessages", "default");
}

socket.on("previousMessages", (messages) => {
  messages.forEach((message) => {
    displayMessage(message);
  });
});

socket.on("message", (message) => {
  const { user, text } = message;

  if (!text) return alert("Please enter a message.");

  const messageElement = document.createElement("div");
  messageElement.innerText = `${user}: ${text}`;
  document.getElementById("messages").appendChild(messageElement);
});

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  messageInput.value = "";
  socket.emit("sendMessage", {
    user: nickname,
    text: message,
    room: "default",
  });
}

function displayMessage(message) {
  const { user, text } = message;

  const messageElement = document.createElement("div");
  messageElement.innerText = `${user}: ${text}`;
  document.getElementById("messages").appendChild(messageElement);
}