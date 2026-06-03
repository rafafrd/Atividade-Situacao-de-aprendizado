/**
 * Imprime os endereços da API para consumir no Insomnia (PC) e no app mobile
 * (celular/emulador). A porta é lida de api/.env (SERVER_PORT) e o IP da rede
 * local é detectado automaticamente — assim os links ficam sempre corretos.
 */
const os = require('os');
const fs = require('fs');
const path = require('path');

function getPort() {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', 'api', '.env'), 'utf8');
    const match = env.match(/^\s*SERVER_PORT\s*=\s*(\d+)/m);
    if (match) return match[1];
  } catch {
    /* sem .env — usa o padrão abaixo */
  }
  return '8000';
}

function getLanIp() {
  const interfaces = os.networkInterfaces();
  const candidatos = [];
  for (const nome of Object.keys(interfaces)) {
    for (const net of interfaces[nome] || []) {
      const ipv4 = net.family === 'IPv4' || net.family === 4;
      if (ipv4 && !net.internal) candidatos.push(net.address);
    }
  }
  // Prioriza faixas privadas comuns de Wi-Fi/Ethernet.
  return (
    candidatos.find((ip) => ip.startsWith('192.168.')) ||
    candidatos.find((ip) => ip.startsWith('10.')) ||
    candidatos[0] ||
    'SEU_IP_LOCAL'
  );
}

const porta = getPort();
const ip = getLanIp();

console.log(`
==================================================================
  StockPlus — endereços da API
==================================================================
  Insomnia / navegador (no PC):   http://localhost:${porta}
  App mobile (celular/emulador):  http://${ip}:${porta}

  -> Configure em mobile/src/services/api.ts:
       export const API_BASE_URL = 'http://${ip}:${porta}';

  Lembrete: no celular, "localhost" é o proprio aparelho — use o IP
  da rede acima. O Expo abrira um QR Code logo abaixo (app Expo Go).
==================================================================
`);
