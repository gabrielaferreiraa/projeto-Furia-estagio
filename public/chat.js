const botName = "FURIA Bot";
let gameState = "Nenhum jogo ao vivo";

// Chatbot que varia de acordo com o status do jogo
setInterval(() => {
  const statusOptions = {
    "Partida em andamento!": [
      "A partida está começando! 🔥",
      "Vamos FURIA! Mostrem seu poder! 💪",
      "Soltem seu grito de guerra, FURIOSOS! 🚀"
    ],
    "Intervalo": [
      "Hora de respirar... mas logo volta! ⏳",
      "Aguardem o segundo tempo! ⚡",
      "Preparando novas estratégias! 🧠"
    ],
    "Jogo finalizado": [
      "UAU! Que partida épica! 🏆",
      "Obrigado por acompanhar conosco! 🙌",
      "FURIA SEMPRE! 🦁"
    ]
  };

  const previousState = gameState;
  const states = Object.keys(statusOptions);
  gameState = states[Math.floor(Math.random() * states.length)];
  
  if (gameState !== previousState) {
    const botMessages = statusOptions[gameState];
    const botMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
    socket.emit('chat message', `${botName}: ${botMessage}`);
  }
  document.getElementById('game-status').innerText = gameState;
}, 5000);

// Função para o modal de cadastro
function registerFromModal() {
  const nameInput = document.getElementById('modalUserName'); // ID correto?
  const userName = nameInput.value.trim();
  
  if (userName === '') {
    alert("FURIOSO, cadastre seu nome de guerra!");
    return;
  }
  // Preenche o campo oculto e registra o nome
  document.getElementById('user_name').value = userName;
  cadastrarNome(); // Chama a função original de cadastro
}

// Inicialização do modal (adicione no final do arquivo)
document.addEventListener('DOMContentLoaded', () => {
  const nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
  nameModal.show();
});

 const messagesDiv = document.getElementById('messages');

 function sendMessage() {
 const input = document.getElementById('user-message');
   const text = input.value.trim();
   if (text !== '') {
     addMessage('Você', text);
     input.value = '';
   }
 }

 function addMessage(user, text) {
   const message = document.createElement('div');
   message.innerHTML = `<strong>${user}:</strong> ${text}`;
   messagesDiv.appendChild(message);
   messagesDiv.scrollTop = messagesDiv.scrollHeight;
 }

// Simular live status (pode depois integrar com API)
setInterval(() => {
  const status = ["Partida em andamento!", "Intervalo", "Jogo finalizado"];
  const currentStatus = status[Math.floor(Math.random() * status.length)];
  document.getElementById('game-status').innerText = currentStatus;
}, 5000);


const socket = io();
      
const form = document.getElementById('form');
const messageInput = document.getElementById('message');
const messages = document.getElementById('messages');
const btnMessage = document.getElementById('btn-message');
const userNameInput = document.getElementById('user_name');
const btnSimulateTorcida = document.getElementById('simulate-torcida');

let userName = "";

btnSimulateTorcida.disabled = true;
messageInput.disabled = true;
btnMessage.disabled = true;

messages.className = "disabled";
btnMessage.classList.add("disabled");

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (messageInput.value && userName !== '') {
      const fullMessage = `${userName}: ${messageInput.value}`;
      socket.emit('chat message', fullMessage);
      messageInput.value = '';
    }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;  
  messages.appendChild(item);

  messages.scrollTop = messages.scrollHeight;
});

function cadastrarNome() {
  const text = document.getElementById('user_name').value.trim();
  if (text !== '') {
    userName = text;
    liberarChat();
    liberarSimuladorTorcida();
    
    // Mensagem de boas-vindas do bot
    const welcomeMessage = `${botName}: Bem-vindo(a) ao chat, ${userName}! Vamos torcer juntos pela FURIA! 🦁`;
    socket.emit('chat message', welcomeMessage);
  }
};

function liberarChat() {
  messageInput.disabled = false;
  btnMessage.disabled = false;
  messages.classList.remove("disabled");
  btnMessage.classList.remove("disabled");
};

function liberarSimuladorTorcida() {
  btnSimulateTorcida.disabled = false; // Habilita o botão para simulação da torcida
};

function simulateTorcida() {
  const cheers = [
    "Vamo FURIAAAAA 🔥🔥🔥",
    "QUE ISSO FURIA!!! 🚀🚀",
    "TÁ DOMINADO! 💣",
    "É HOJE! PRA CIMA DELES! 🦁",
    "Go FURIAA!!",
    "PLANTA B! 💣",
    "No Eco eu sou Sueco.",
    "Easy Pezzy"
  ];
  const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
  
  const fullMessage = `${userName} : ${randomCheer}`; // Agora formato correto
  socket.emit('chat message', fullMessage); // Envia como se fosse usuário
};