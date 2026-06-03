/**
 * Configuração base de acesso à API.
 *
 * IMPORTANTE: em celular físico ou emulador Android, "localhost" aponta para o
 * próprio aparelho — NÃO para o seu PC. Troque o IP abaixo pelo IP da sua
 * máquina na rede local (ex.: rode `ipconfig` no Windows e use o IPv4) e a
 * porta pela `SERVER_PORT` definida no .env da API (pasta `api/`).
 *
 *   Ex.: http://192.168.0.10:3000
 */
export const API_BASE_URL = 'http://192.168.0.10:3000';

/**
 * Resposta padrão da API: os endpoints retornam { mensagem, recurso }.
 */
interface ApiEnvelope<T> {
  mensagem?: string;
  recurso?: T;
}

/**
 * Faz um GET na API e devolve o conteúdo de `recurso` já desembrulhado.
 * @param path Caminho do endpoint (ex.: "/estoque/report").
 */
export async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique o IP e se o servidor está rodando.');
  }

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao buscar dados.`);
  }

  const json = (await res.json()) as ApiEnvelope<T>;
  return (json.recurso ?? ([] as unknown as T)) as T;
}
