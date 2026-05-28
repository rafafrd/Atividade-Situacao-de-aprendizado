/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';

// pdfkit não inclui tipos — use "npm i -D @types/pdfkit" se quiser tipagem completa
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

export interface ItemRelatorio {
    dc_produto: string;
    dc_categoria: string;
    dc_fornecedor: string;
    quantidade_atual: number;
    estoque_minimo: number;
    total_em_lotes: number;
    proximo_vencimento: string | null;
    valor_total_estoque: number;
    status_estoque: 'SEM_ESTOQUE' | 'ESTOQUE_BAIXO' | 'NORMAL';
}

// pdfkit não exporta tipos — alias para clareza
type PdfDoc = any;
type Status = ItemRelatorio['status_estoque'];

// ── Paleta ──────────────────────────────────────────────────────────────────
const CORES = {
    primario:   '#0F172A',
    accent:     '#3B82F6',
    texto:      '#1E293B',
    textoSec:   '#475569',
    textoMuted: '#94A3B8',
    bgClaro:    '#F8FAFC',
    bgAlt:      '#F1F5F9',
    borda:      '#E2E8F0',
    sucesso:    '#059669',
    sucessoBg:  '#D1FAE5',
    aviso:      '#D97706',
    avisoBg:    '#FEF3C7',
    perigo:     '#DC2626',
    perigoBg:   '#FEE2E2',
};

const STATUS_LABEL: Record<Status, string> = {
    SEM_ESTOQUE:   'SEM ESTOQUE',
    ESTOQUE_BAIXO: 'ESTOQUE BAIXO',
    NORMAL:        'NORMAL',
};
const STATUS_STYLE: Record<Status, { bg: string; fg: string }> = {
    SEM_ESTOQUE:   { bg: CORES.perigoBg,  fg: CORES.perigo },
    ESTOQUE_BAIXO: { bg: CORES.avisoBg,   fg: CORES.aviso },
    NORMAL:        { bg: CORES.sucessoBg, fg: CORES.sucesso },
};

// ── Dimensões (A4 landscape: 842 x 595 pt) ──────────────────────────────────
const PAGE_W = 842;
const PAGE_H = 595;
const MARGEM = 36;
const CONTENT_W = PAGE_W - MARGEM * 2; // 770
const ALT_HEADER_TABELA = 24;
const ALT_LINHA = 22;
const ALT_RODAPE = 36;
const Y_LIMITE = PAGE_H - MARGEM - ALT_RODAPE;

// ── Posições previsíveis para precomputar o total de páginas ───────────────
// (mantidas em sync com desenharCabecalhoDocumento / desenharCardsResumo / abrirNovaPagina)
const Y_INICIAL_PAGE1 = 192;  // após header (98) + cards (64) + gap (6) + cabeçalho tabela (24)
const Y_INICIAL_OUTRAS = 86;  // após mini-header continuação (62) + cabeçalho tabela (24)

// ── Formatadores ────────────────────────────────────────────────────────────
function formatBRL(v: unknown): string {
    return Number(v).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });
}
function formatNumero(v: unknown): string {
    return Number(v).toLocaleString('pt-BR');
}
function formatData(v: string | null): string {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('pt-BR');
}
function truncar(s: string, max: number): string {
    if (!s) return '—';
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

// ── Colunas da tabela ───────────────────────────────────────────────────────
interface Col {
    label: string;
    key: keyof ItemRelatorio;
    width: number;
    align: 'left' | 'right' | 'center';
    maxChars?: number;
    formatter?: (v: any) => string;
}
const COLUNAS: Col[] = [
    { label: 'Produto',     key: 'dc_produto',          width: 148, align: 'left',   maxChars: 30 },
    { label: 'Categoria',   key: 'dc_categoria',        width: 84,  align: 'left',   maxChars: 16 },
    { label: 'Fornecedor',  key: 'dc_fornecedor',       width: 84,  align: 'left',   maxChars: 16 },
    { label: 'Qtd. Atual',  key: 'quantidade_atual',    width: 68,  align: 'right',  formatter: formatNumero },
    { label: 'Est. Mín.',   key: 'estoque_minimo',      width: 62,  align: 'right',  formatter: formatNumero },
    { label: 'Lotes',       key: 'total_em_lotes',      width: 50,  align: 'right',  formatter: formatNumero },
    { label: 'Vencimento',  key: 'proximo_vencimento',  width: 80,  align: 'center', formatter: formatData },
    { label: 'Valor Total', key: 'valor_total_estoque', width: 92,  align: 'right',  formatter: formatBRL },
    { label: 'Status',      key: 'status_estoque',      width: 102, align: 'center' },
];
const LARGURA_TABELA = COLUNAS.reduce((acc, c) => acc + c.width, 0); // 770

// ── Entry point ─────────────────────────────────────────────────────────────
export function gerarRelatorioPDF(dados: ItemRelatorio[], caminhoArquivo: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const doc: PdfDoc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: MARGEM,
            info: {
                Title: 'Relatório de Estoque — StockPlus',
                Author: 'StockPlus API',
                Subject: 'Relatório de produtos em estoque',
                CreationDate: new Date(),
            },
        });

        const stream = fs.createWriteStream(caminhoArquivo);
        doc.pipe(stream);

        const totalPaginas = calcularTotalPaginas(dados.length);

        desenharCabecalhoDocumento(doc, dados.length);
        desenharCardsResumo(doc, dados);

        let y = doc.y + 6;
        y = desenharCabecalhoTabela(doc, y);

        if (dados.length === 0) {
            desenharEstadoVazio(doc, y);
            desenharRodape(doc, 1, 1);
        } else {
            let paginaAtual = 1;
            dados.forEach((item, idx) => {
                if (y + ALT_LINHA > Y_LIMITE) {
                    desenharRodape(doc, paginaAtual, totalPaginas);
                    doc.addPage();
                    paginaAtual++;
                    y = abrirNovaPagina(doc);
                }
                desenharLinha(doc, y, item, idx);
                y += ALT_LINHA;
            });
            desenharRodape(doc, paginaAtual, totalPaginas);
        }

        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

/**
 * Calcula quantas páginas serão necessárias antes de renderizar,
 * para que o rodapé "Página X de Y" seja preciso.
 */
function calcularTotalPaginas(totalItens: number): number {
    if (totalItens === 0) return 1;
    const linhasPage1 = Math.floor((Y_LIMITE - Y_INICIAL_PAGE1) / ALT_LINHA);
    if (totalItens <= linhasPage1) return 1;
    const linhasOutras = Math.floor((Y_LIMITE - Y_INICIAL_OUTRAS) / ALT_LINHA);
    return 1 + Math.ceil((totalItens - linhasPage1) / linhasOutras);
}

// ── Cabeçalho do documento (primeira página) ───────────────────────────────
function desenharCabecalhoDocumento(doc: PdfDoc, totalProdutos: number): void {
    // Faixa azul fina no topo
    doc.rect(0, 0, PAGE_W, 4).fill(CORES.accent);

    const y = MARGEM;

    // Lado esquerdo: título + subtítulo
    doc.fillColor(CORES.primario).font('Helvetica-Bold').fontSize(22)
        .text('StockPlus', MARGEM, y, { lineBreak: false });
    doc.fillColor(CORES.textoSec).font('Helvetica').fontSize(11)
        .text('Relatório de Produtos em Estoque', MARGEM, y + 26, { lineBreak: false });

    // Lado direito: data + contagem
    const dataHora = new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
    doc.fillColor(CORES.textoSec).font('Helvetica').fontSize(9)
        .text(`Gerado em ${dataHora}`, MARGEM, y, {
            width: CONTENT_W, align: 'right', lineBreak: false,
        });
    doc.fillColor(CORES.textoMuted).fontSize(9)
        .text(`${totalProdutos} produto(s) listado(s)`, MARGEM, y + 14, {
            width: CONTENT_W, align: 'right', lineBreak: false,
        });

    // Separador
    const ySep = y + 50;
    doc.moveTo(MARGEM, ySep).lineTo(MARGEM + CONTENT_W, ySep)
        .strokeColor(CORES.borda).lineWidth(1).stroke();

    doc.y = ySep + 12;
}

// ── Cards de resumo (KPIs) ──────────────────────────────────────────────────
function desenharCardsResumo(doc: PdfDoc, dados: ItemRelatorio[]): void {
    const valorTotal = dados.reduce((acc, i) => acc + Number(i.valor_total_estoque), 0);
    const semEstoque = dados.filter(i => i.status_estoque === 'SEM_ESTOQUE').length;
    const estoqueBaixo = dados.filter(i => i.status_estoque === 'ESTOQUE_BAIXO').length;
    const normal = dados.length - semEstoque - estoqueBaixo;

    const cards = [
        { label: 'TOTAL DE PRODUTOS',      valor: formatNumero(dados.length), fg: CORES.primario, bg: CORES.bgClaro },
        { label: 'VALOR TOTAL EM ESTOQUE', valor: formatBRL(valorTotal),      fg: CORES.primario, bg: CORES.bgClaro },
        { label: 'SEM ESTOQUE',            valor: String(semEstoque),         fg: CORES.perigo,   bg: CORES.perigoBg },
        { label: 'ESTOQUE BAIXO',          valor: String(estoqueBaixo),       fg: CORES.aviso,    bg: CORES.avisoBg },
        { label: 'ESTOQUE NORMAL',         valor: String(normal),             fg: CORES.sucesso,  bg: CORES.sucessoBg },
    ];

    const gap = 8;
    const cardW = (CONTENT_W - gap * (cards.length - 1)) / cards.length;
    const cardH = 50;
    const y = doc.y;

    cards.forEach((card, idx) => {
        const x = MARGEM + idx * (cardW + gap);

        doc.roundedRect(x, y, cardW, cardH, 4).fill(card.bg);

        doc.fillColor(CORES.textoMuted).font('Helvetica-Bold').fontSize(7)
            .text(card.label, x + 10, y + 8, {
                width: cardW - 20, align: 'left', lineBreak: false, characterSpacing: 0.5,
            });
        doc.fillColor(card.fg).font('Helvetica-Bold').fontSize(15)
            .text(card.valor, x + 10, y + 23, {
                width: cardW - 20, align: 'left', lineBreak: false,
            });
    });

    doc.y = y + cardH + 14;
}

// ── Cabeçalho da tabela ─────────────────────────────────────────────────────
function desenharCabecalhoTabela(doc: PdfDoc, y: number): number {
    doc.rect(MARGEM, y, LARGURA_TABELA, ALT_HEADER_TABELA).fill(CORES.primario);

    let cx = MARGEM;
    for (const col of COLUNAS) {
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5)
            .text(col.label.toUpperCase(), cx + 6, y + 8.5, {
                width: col.width - 12, align: col.align, lineBreak: false, characterSpacing: 0.2,
            });
        cx += col.width;
    }
    return y + ALT_HEADER_TABELA;
}

// ── Linha de dados ──────────────────────────────────────────────────────────
function desenharLinha(doc: PdfDoc, y: number, item: ItemRelatorio, idx: number): void {
    const bg = idx % 2 === 0 ? '#FFFFFF' : CORES.bgAlt;
    doc.rect(MARGEM, y, LARGURA_TABELA, ALT_LINHA).fill(bg);

    doc.moveTo(MARGEM, y + ALT_LINHA).lineTo(MARGEM + LARGURA_TABELA, y + ALT_LINHA)
        .strokeColor(CORES.borda).lineWidth(0.5).stroke();

    let cx = MARGEM;
    for (const col of COLUNAS) {
        if (col.key === 'status_estoque') {
            desenharBadgeStatus(doc, cx, y, col.width, item.status_estoque);
        } else {
            const raw = item[col.key];
            let texto: string;
            if (col.formatter) {
                texto = col.formatter(raw);
            } else if (raw === null || raw === undefined || raw === '') {
                texto = '—';
            } else {
                texto = String(raw);
            }
            if (col.maxChars) texto = truncar(texto, col.maxChars);

            const vazio = raw === null || raw === undefined || raw === '';
            doc.fillColor(vazio ? CORES.textoMuted : CORES.texto)
                .font('Helvetica').fontSize(8.5)
                .text(texto, cx + 8, y + 7, {
                    width: col.width - 16, align: col.align, lineBreak: false,
                });
        }
        cx += col.width;
    }
}

// ── Badge colorido de status ────────────────────────────────────────────────
function desenharBadgeStatus(doc: PdfDoc, cx: number, y: number, colWidth: number, status: Status): void {
    const style = STATUS_STYLE[status];
    const label = STATUS_LABEL[status];

    const badgeW = colWidth - 24;
    const badgeH = 14;
    const badgeX = cx + (colWidth - badgeW) / 2;
    const badgeY = y + (ALT_LINHA - badgeH) / 2;

    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 7).fill(style.bg);
    doc.fillColor(style.fg).font('Helvetica-Bold').fontSize(7.5)
        .text(label, badgeX, badgeY + 3.5, {
            width: badgeW, align: 'center', lineBreak: false, characterSpacing: 0.3,
        });
}

// ── Estado vazio ────────────────────────────────────────────────────────────
function desenharEstadoVazio(doc: PdfDoc, y: number): void {
    doc.fillColor(CORES.textoMuted).font('Helvetica-Oblique').fontSize(11)
        .text('Nenhum produto cadastrado.', MARGEM, y + 24, {
            width: LARGURA_TABELA, align: 'center', lineBreak: false,
        });
}

// ── Nova página (continuação) ───────────────────────────────────────────────
function abrirNovaPagina(doc: PdfDoc): number {
    doc.addPage();

    // Faixa fina no topo
    doc.rect(0, 0, PAGE_W, 4).fill(CORES.accent);

    doc.fillColor(CORES.textoSec).font('Helvetica').fontSize(9)
        .text('StockPlus — Relatório de Estoque (continuação)', MARGEM, MARGEM, {
            width: CONTENT_W, align: 'left', lineBreak: false,
        });

    const ySep = MARGEM + 16;
    doc.moveTo(MARGEM, ySep).lineTo(MARGEM + CONTENT_W, ySep)
        .strokeColor(CORES.borda).lineWidth(0.5).stroke();

    return desenharCabecalhoTabela(doc, ySep + 10);
}

// ── Rodapé com paginação ────────────────────────────────────────────────────
function desenharRodape(doc: PdfDoc, pagina: number, total: number): void {
    const y = PAGE_H - MARGEM + 4;

    doc.moveTo(MARGEM, y - 6).lineTo(MARGEM + CONTENT_W, y - 6)
        .strokeColor(CORES.borda).lineWidth(0.5).stroke();

    doc.fillColor(CORES.textoMuted).font('Helvetica').fontSize(8)
        .text('StockPlus API · Relatório de Estoque', MARGEM, y, {
            width: CONTENT_W / 2, align: 'left', lineBreak: false,
        });

    doc.fillColor(CORES.textoMuted).font('Helvetica').fontSize(8)
        .text(`Página ${pagina} de ${total}`, MARGEM + CONTENT_W / 2, y, {
            width: CONTENT_W / 2, align: 'right', lineBreak: false,
        });
}
