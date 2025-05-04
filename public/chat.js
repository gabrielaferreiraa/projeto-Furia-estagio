// Constantes e configurações
const CONFIG = {
  botName: "FURIA",
  initialGameState: "Nenhum jogo ao vivo",
  statusUpdateInterval: 5000,
  messageTypes: {
    BOT: 'bot',
    USER: 'user',
    SYSTEM: 'system'
  }
};

// Estados do jogo com mensagens mais variadas
const GAME_STATUS_MESSAGES = {
  "Partida em andamento!": [
    "A partida está começando! 🔥",
    "Vamos FURIA! Mostrem seu poder! 💪",
    "Soltem seu grito de guerra, FURIOSOS! 🚀",
    "Que jogada incrível! 👏",
    "O time está aquecido! ⚡"
  ],
  "Intervalo": [
    "Hora de respirar... mas logo volta! ⏳",
    "Aguardem o segundo tempo! ⚡",
    "Preparando novas estratégias! 🧠",
    "Analisando os melhores lances... 📊",
    "Pausa tática em andamento! ⏱️"
  ],
  "Jogo finalizado": [
    "UAU! Que partida épica! 🏆",
    "Obrigado por acompanhar conosco! 🙌",
    "FURIA SEMPRE! 🦁",
    "Que vitória incrível! 🎉",
    "Até a próxima, FURIOSOS! 👋"
  ]
};

// Gritos da torcida mais organizados
const CHEERS = [
  "Vamo FURIAAAAA 🔥🔥🔥",
  "QUE ISSO FURIA!!! 🚀🚀",
  "TÁ DOMINADO! 💣",
  "É HOJE! PRA CIMA DELES! 🦁",
  "Go FURIAA!!",
  "PLANTA B! 💣",
  "Easy Pezzy",
  "FURIA ACIMA DE TUDO! 🚩",
  "ISSO É SER FURIOSO! ⚡"
];

// Gerenciamento de estado do chat
class ChatState {
  constructor() {
    this.userName = '';
    this.gameState = CONFIG.initialGameState;
    this.isChatEnabled = false;
    this.socket = null;
  }

  setUserName(name) {
    this.userName = name.trim();
    if (this.userName) {
      this.isChatEnabled = true;
      return true;
    }
    return false;
  }

  updateGameState(newState) {
    if (newState !== this.gameState) {
      this.gameState = newState;
      return true;
    }
    return false;
  }
}

const chatState = new ChatState();
let nameModal;

// Histórico de mensagens
const messageHistory = {
  messages: [],
  
  add(message, type) {
    this.messages.push({ text: message, type, timestamp: new Date() });
    if (this.messages.length > 100) {
      this.messages.shift();
    }
  },
  
  getRecent() {
    return this.messages.slice(-20);
  }
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initializeModal();
  setupSocketConnection();
  setupEventListeners();
  startGameStatusUpdates();
});

function initializeModal() {
  nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
  nameModal.show();
}

function setupSocketConnection() {
  chatState.socket = io({
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000
  });

  chatState.socket.on('connect', () => {
    showNotification('Conectado ao chat!', 'success');
  });

  chatState.socket.on('disconnect', () => {
    showNotification('Desconectado do chat. Tentando reconectar...', 'error');
  });

  chatState.socket.on('chat message', (msg) => {
    const isBotMessage = msg.startsWith(`${CONFIG.botName}:`);
    addMessage(msg, isBotMessage ? CONFIG.messageTypes.BOT : CONFIG.messageTypes.USER);
    messageHistory.add(msg, isBotMessage ? 'bot' : 'user');
  });
}

function setupEventListeners() {
  const form = document.getElementById('form');
  const messageInput = document.getElementById('message');
  const btnSimulateTorcida = document.getElementById('simulate-torcida');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleMessageSend(messageInput.value);
    messageInput.value = '';
  });
}

function startGameStatusUpdates() {
  setInterval(() => {
    const states = Object.keys(GAME_STATUS_MESSAGES);
    const newState = states[Math.floor(Math.random() * states.length)];
    
    if (chatState.updateGameState(newState)) {
      const botMessages = GAME_STATUS_MESSAGES[newState];
      const botMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
      chatState.socket.emit('chat message', `${CONFIG.botName}: ${botMessage}`);
    }
    
    document.getElementById('game-status').innerText = newState;
  }, CONFIG.statusUpdateInterval);
}

// Funções principais do chat
function registerFromModal() {
  const nameInput = document.getElementById('modalUserName');
  const userName = nameInput.value.trim();
  
  if (!userName) {
    showNotification("FURIOSO, você precisa cadastrar um nome para entrar no chat!", 'error');
    return;
  }
  
  if (chatState.setUserName(userName)) {
    enableChat();
    showNotification(`Bem-vindo(a), ${userName}!`, 'success');
    
    const welcomeMessage = `${CONFIG.botName}: Bem-vindo(a) ao chat, ${userName}! Vamos torcer juntos pela FURIA! 🦁`;
    chatState.socket.emit('chat message', welcomeMessage);
  }
}

function enableChat() {
  nameModal.hide();
  
  const messageInput = document.getElementById('message');
  const btnMessage = document.getElementById('btn-message');
  const messages = document.getElementById('messages');
  const btnSimulateTorcida = document.getElementById('simulate-torcida');
  
  messageInput.disabled = false;
  btnMessage.disabled = false;
  btnSimulateTorcida.disabled = false;
  messages.classList.remove("disabled");
  btnMessage.classList.remove("disabled");
}

function handleMessageSend(message) {
  if (!chatState.isChatEnabled || !chatState.userName) {
    showNotification("Você precisa se identificar antes de enviar mensagens", 'error');
    return;
  }

  const validation = validateMessage(message);
  if (!validation.valid) {
    showNotification(validation.error, 'error');
    return;
  }

  const fullMessage = `${chatState.userName}: ${message}`;
  chatState.socket.emit('chat message', fullMessage);
}

function addMessage(message, type = CONFIG.messageTypes.USER) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('li');
  
  messageElement.classList.add('message', `message-${type}`);
  
  switch(type) {
    case CONFIG.messageTypes.BOT:
      messageElement.innerHTML = `<span class="bot-name">${CONFIG.botName}:</span> ${message.replace(`${CONFIG.botName}:`, '')}`;
      break;
    case CONFIG.messageTypes.SYSTEM:
      messageElement.innerHTML = `<span class="system-message">⚡ ${message}</span>`;
      break;
    default:
      messageElement.innerHTML = `<span class="user-name">${message.split(':')[0]}:</span> ${message.split(':').slice(1).join(':')}`;
  }
  
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function simulateTorcida() {
  if (!chatState.isChatEnabled) {
    showNotification("Você precisa se identificar antes de simular a torcida", 'error');
    return;
  }

  const randomCheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];
  console.log(randomCheer)
  const fullMessage = `${chatState.userName}: ${randomCheer}`;
  chatState.socket.emit('chat message', fullMessage);
}

// Funções auxiliares
function validateMessage(message) {
  if (!message || message.trim() === '') {
    return { valid: false, error: "A mensagem não pode estar vazia!" };
  }
  
  if (message.length > 200) {
    return { valid: false, error: "A mensagem é muito longa (máx. 200 caracteres)" };
  }
  
  const blockedWords = ['palavra1', 'palavra2']; // Adicione palavras inapropriadas aqui
  const containsBlockedWord = blockedWords.some(word => 
    message.toLowerCase().includes(word.toLowerCase())
  );
  
  if (containsBlockedWord) {
    return { valid: false, error: "Sua mensagem contém palavras inapropriadas" };
  }
  
  return { valid: true };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}