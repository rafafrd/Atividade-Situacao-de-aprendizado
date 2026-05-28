import fs from 'node:fs';

// pdfkit não inclui tipos — use "npm i -D @types/pdfkit" se quiser tipagem completa
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

interface ItemRelatorio {
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

const STATUS_COR: Record<string, string> = {
    SEM_ESTOQUE:  '#CC0000',
    ESTOQUE_BAIXO:'#CC6600',
    NORMAL:       '#006600',
};

const COLUNAS: { label: string; key: keyof ItemRelatorio; width: number; align: 'left' | 'right' | 'center' }[] = [
    { label: 'Produto',        key: 'dc_produto',          width: 155, align: 'left'   },
    { label: 'Categoria',      key: 'dc_categoria',        width: 88,  align: 'left'   },
    { label: 'Fornecedor',     key: 'dc_fornecedor',       width: 88,  align: 'left'   },
    { label: 'Qtd Atual',      key: 'quantidade_atual',    width: 62,  align: 'right'  },
    { label: 'Est. Mín.',      key: 'estoque_minimo',      width: 60,  align: 'right'  },
    { label: 'Lotes',          key: 'total_em_lotes',      width: 55,  align: 'right'  },
    { label: 'Próx. Vencto',   key: 'proximo_vencimento',  width: 82,  align: 'center' },
    { label: 'Valor Total',    key: 'valor_total_estoque', width: 78,  align: 'right'  },
    { label: 'Status',         key: 'status_estoque',      width: 94,  align: 'center' },
];

const LARGURA_TOTAL = COLUNAS.reduce((acc, c) => acc + c.width, 0); // 762
const MARGEM = 40;
const ALTURA_HEADER_TABELA = 22;
const ALTURA_LINHA = 18;

function formatarValor(item: ItemRelatorio, key: keyof ItemRelatorio): string {
    const val = item[key];
    if (key === 'valor_total_estoque') {
        return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
    }
    if (key === 'proximo_vencimento') {
        if (!val) return '—';
        return new Date(val as string).toLocaleDateString('pt-BR');
    }
    return val !== null && val !== undefined ? String(val) : '—';
}

export function gerarRelatorioPDF(dados: ItemRelatorio[], caminhoArquivo: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: MARGEM });
        const stream = fs.createWriteStream(caminhoArquivo);
        doc.pipe(stream);

        const dataHora = new Date().toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

        // ── Cabeçalho do documento ──────────────────────────────────────────
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#1a1a2e')
            .text('StockPlus', MARGEM, MARGEM, { continued: true })
            .font('Helvetica').fillColor('#555555')
            .text('  |  Relatório de Estoque');

        doc.fontSize(9).font('Helvetica').fillColor('#777777')
            .text(`Gerado em: ${dataHora}  —  ${dados.length} produto(s)`, { align: 'left' });

        // linha separadora
        doc.moveDown(0.4);
        doc.moveTo(MARGEM, doc.y)
            .lineTo(MARGEM + LARGURA_TOTAL, doc.y)
            .strokeColor('#1a1a2e').lineWidth(1.5).stroke();
        doc.moveDown(0.6);

        // ── Cabeçalho da tabela ─────────────────────────────────────────────
        let y = doc.y;

        doc.rect(MARGEM, y, LARGURA_TOTAL, ALTURA_HEADER_TABELA).fill('#1a1a2e');

        doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff');
        let x = MARGEM;
        for (const col of COLUNAS) {
            doc.text(col.label, x + 4, y + 6, { width: col.width - 8, align: col.align, lineBreak: false });
            x += col.width;
        }
        y += ALTURA_HEADER_TABELA;

        // ── Linhas de dados ─────────────────────────────────────────────────
        dados.forEach((item, idx) => {
            if (y + ALTURA_LINHA > doc.page.height - MARGEM - 30) {
                doc.addPage();
                y = MARGEM;
            }

            const bgCor = idx % 2 === 0 ? '#f7f7f7' : '#ffffff';
            doc.rect(MARGEM, y, LARGURA_TOTAL, ALTURA_LINHA).fill(bgCor);

            doc.font('Helvetica').fontSize(8);
            x = MARGEM;
            for (const col of COLUNAS) {
                const texto = formatarValor(item, col.key);
                const cor = col.key === 'status_estoque' ? (STATUS_COR[item.status_estoque] ?? '#000000') : '#1a1a1a';
                const negrito = col.key === 'status_estoque';

                doc.font(negrito ? 'Helvetica-Bold' : 'Helvetica')
                    .fillColor(cor)
                    .text(texto, x + 4, y + 4, { width: col.width - 8, align: col.align, lineBreak: false });
                x += col.width;
            }

            doc.moveTo(MARGEM, y + ALTURA_LINHA)
                .lineTo(MARGEM + LARGURA_TOTAL, y + ALTURA_LINHA)
                .strokeColor('#dddddd').lineWidth(0.4).stroke();

            y += ALTURA_LINHA;
        });

        // ── Rodapé de totais ────────────────────────────────────────────────
        const valorTotal = dados.reduce((acc, i) => acc + Number(i.valor_total_estoque), 0);
        const semEstoque = dados.filter(i => i.status_estoque === 'SEM_ESTOQUE').length;
        const estoqueBaixo = dados.filter(i => i.status_estoque === 'ESTOQUE_BAIXO').length;

        doc.moveDown(0.8);
        doc.moveTo(MARGEM, doc.y)
            .lineTo(MARGEM + LARGURA_TOTAL, doc.y)
            .strokeColor('#1a1a2e').lineWidth(1).stroke();
        doc.moveDown(0.4);

        doc.font('Helvetica-Bold').fontSize(9).fillColor('#1a1a2e')
            .text(
                `Valor total em estoque: R$ ${valorTotal.toFixed(2).replace('.', ',')}` +
                `   |   Sem estoque: ${semEstoque}` +
                `   |   Estoque baixo: ${estoqueBaixo}` +
                `   |   Normal: ${dados.length - semEstoque - estoqueBaixo}`,
                MARGEM, doc.y, { align: 'left' },
            );

        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}
