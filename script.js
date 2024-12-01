import {net} from 'net'

// Configurações do firewall
const ipsBloqueados = ['192.168.0.100', '10.0.0.1'];
const portasBloqueadas = [80, 443, 25];
const hostAtivo = '0.0.0.0'; 
const portaAtiva = 8080; 

// Função para verificar se o IP ou porta está bloqueado
function isIpBloqueado(ip) {
    return ipsBloqueados.includes(ip);
}

function isPortaBloqueada(porta) {
    return portasBloqueadas.includes(porta);
}

// Criando o servidor
const server = net.createServer((socket) => {
    const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;

    console.log(`Conexão recebida de ${clientAddr}`);

    // Bloqueia a conexão se o IP ou a porta estiver na lista
    if (isIpBloqueado(socket.remoteAddress) || isPortaBloqueada(socket.remotePort)) {
        console.log(`Conexão bloqueada: ${clientAddr}`);
        socket.write('Conexão interrompida pelo firewall.\n');
        socket.destroy();
        return;
    }

    // Conexão permitida
    console.log(`Conexão autorizada de ${socket.remoteAddress}:${socket.remotePort}`);
    socket.write('Conexão permitida pelo firewall.\n');
    socket.end();
});

// Inicia o servidor
server.listen(portaAtiva, hostAtivo, () => {
    console.log(`Firewall ativo em ${hostAtivo}:${portaAtiva}`);
});

// Tratamento de erros no servidor
server.on('error', (err) => {
    console.error(`Erro no servidor: ${err.message}`);
});
