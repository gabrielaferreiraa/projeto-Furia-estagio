const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware para arquivos estáticos
app.use(express.static('public'));

// Tratamento de erros do servidor
server.on('error', (error) => {
    console.error('Erro no servidor:', error);
});

// Lógica de conexão Socket.io
io.on('connection', (socket) => {
    const clientIp = socket.handshake.address;
    console.log(`Novo usuário conectado - IP: ${clientIp}, ID: ${socket.id}`);
    
    // Handler para mensagens de chat
    socket.on('chat message', (msg) => {
        if (typeof msg === 'string' && msg.trim().length > 0) {
            io.emit('chat message', msg.trim());
        } else {
            console.log('Mensagem inválida recebida');
        }
    });
    
    // Handler para desconexão
    socket.on('disconnect', (reason) => {
        console.log(`Usuário desconectado - ID: ${socket.id}, Razão: ${reason}`);
    });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});