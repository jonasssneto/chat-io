const socket = io("http://localhost:3000/");
let nickname = "";
let room = "";

function joinChat() {
  nickname = document.getElementById("nickname").value.trim();
  room = document.getElementById("room").value;

  if (nickname === "") {
    alert("Please enter a nickname.");
    return;
  }
  document.getElementById("nicknameInput").style.display = "none";
  document.getElementById("chatContainer").style.display = "block";
  socket.emit("join", { username: nickname, room: room });
  socket.emit("loadPreviousMessages", room);
}

socket.on("previousMessages", (messages) => {
  messages.forEach((message) => {
    displayMessage(message);
  });
});

socket.on("message", (message) => {
  const { user, text } = message;

  if (!text) return console.error("Received message with no text.");

  displayMessage(message);
});

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  if (message === "") {
    alert("Please enter a message.");
    return;
  }
  messageInput.value = "";
  socket.emit("sendMessage", {
    user: nickname,
    text: message,
    room,
  });
}

function displayMessage(message) {
  const { user, text } = message;

  const messageElement = document.createElement("div");
  messageElement.innerText = `${user}: ${text}`;
  document.getElementById("messages").appendChild(messageElement);
}
