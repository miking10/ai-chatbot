const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const clear = document.getElementById("clear");
const headerText = document.getElementById("headerText");
const title = document.getElementById("title");
const chatTime = document.querySelector(".chat-time");
const clearConversetion = document.getElementById("clearConversetion");
const welcamText = document.querySelector(".welcamText");
const newBtn = document.querySelector(".new-chat");
const chatItem = document.querySelector(".chat-item");

const date = new Date();

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const API_KEY = "Add your api key here please";

let conversation = [];

sendBtn.addEventListener("click", sendMessage);
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
async function sendMessage() {
  // add time
  let time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Add welcam message

  welcamText.classList.add("none");

  // Get the user's message

  const prompt = promptInput.value.trim();

  // Don't send an empty message

  if (prompt === "") {
    return;
  }

  // Show the user's message

  chat.innerHTML += `
        <div class="message user">
          <div class="bubble">
            <p>${prompt}</p>
            <span class="message-time">${time}</span>
          </div>  
        </div>
    `;

  // Add user message to conversation

  conversation.push({
    role: "user",
    content: prompt,
  });

  // TO ADD header name

  headerText.innerHTML = conversation[0]["content"];

  // ADD title name to sidebar name

  title.innerHTML = conversation[0]["content"];

  // ADD Time to the title

  chatTime.innerHTML = time;

  // Clear input

  promptInput.value = "";

  // Show loading
  chat.innerHTML += `
          <div id="loading" class="message ai">
              <div class="dots">
              Thinking
                <span></span>
                <span></span>
                <span></span>
              </div>
          </div>
      `;
  // Clear input

  promptInput.value = "";

  try {
    // Send request to AI
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({
        model: "gemini-3.7-flash",
        messages: conversation,
      }),
    });

    const data = await response.json();

    const aiMessage = data.choices[0].message.content;

    // Remove loading

    document.getElementById("loading").remove();

    // Show AI response

    const formattedMessage = marked.parse(aiMessage);

    chat.innerHTML += `
            <div class="message">
              <div class="avater">🤖</div>
              <div class="bubble">
                <p>${formattedMessage}</p>
                <span class="message-time"> 10:32 AM </span>
              </div>  
            <div class="message ai">
                ${formattedMessage}
            </div>
        `;

    // Add AI response to conversation

    conversation.push({
      role: "assistant",
      content: aiMessage,
    });
  } catch (error) {
    console.log(error);

    // Remove loading

    const loading = document.getElementById("loading");

    if (loading) {
      loading.remove();
    }

    // Show error

    chat.innerHTML += `
            <div class="message ai">
                Sorry, something went wrong.
            </div>
        `;
  }
}

// DARK MODE
const darkMode = document.getElementById("svg");
darkMode.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});

// crear the date
clear.addEventListener("click", () => {
  chat.innerHTML = "";
  headerText.innerHTML = "";
  // hero section
  welcamText.classList.remove("none");
});

clearConversetion.addEventListener("click", () => {
  title.innerHTML = "";
  chatTime.innerHTML = "";
  chat.innerHTML = "";
  headerText.innerHTML = "";
  // hero section
  welcamText.classList.remove("none");
});
