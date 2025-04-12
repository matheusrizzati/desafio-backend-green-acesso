import { HttpError } from "../erros/HttpError";
import { CriarBoletoDto } from "../dtos/Boleto/CriarBoletoDto"
import { Boleto } from "../models/Boleto";
import { Lote } from "../models/Lote";
import { Readable } from 'stream';
import { Op } from "sequelize";
import { FiltrosBoletoDto } from "../dtos/Boleto/FiltrosBoletoDto";
import { PDFDocument, rgb } from "pdf-lib";
import csv from "csv-parser"
import fs from 'fs'

export class BoletoService {

    buscar = async (filtros: FiltrosBoletoDto): Promise<Boleto[] | string> => {
        try {
            const whereFiltrado: any = {};

            if (filtros.nome) {
                whereFiltrado.nome_sacado = { [Op.iLike]: `%${filtros.nome}%` };
            }

            if (filtros.valor_inicial !== undefined || filtros.valor_final !== undefined) {
                whereFiltrado.valor = {};

                if (filtros.valor_inicial !== undefined) { whereFiltrado.valor[Op.gte] = filtros.valor_inicial }

                if (filtros.valor_final !== undefined) { whereFiltrado.valor[Op.lte] = filtros.valor_final }
            }

            if (filtros.id_lote !== undefined) { whereFiltrado.id_lote = filtros.id_lote }

            const boletos = await Boleto.findAll({
                where: whereFiltrado,
                order: [['id', 'ASC']]
            });

            if (filtros.relatorio !== undefined) {
                return this.gerarRelatorioBoletos(boletos)
            }

            return boletos;
        } catch (error) {
            throw new HttpError(`Erro ao buscar boletos`);
        }
    }

    gerarRelatorioBoletos = async (boletos: Boleto[]) => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const marginX = 50;
        const marginY = height - 100;
        const lineHeight = 20;
        const colWidths = [50, 150, 50, 80, 150]; // Largura das colunas
        const headers = ['id', 'nome_sacado', 'id_lote', 'valor', 'linhar_digitavel'];

        function drawText(text: string, x: number, y: number, fontSize = 12, color = rgb(0, 0, 0)) {
            page.drawText(text, {
                x,
                y,
                size: fontSize,
                color,
            });
        }

        let currentX = marginX;
        let currentY = marginY;

        headers.forEach((header, index) => {
            drawText(header, currentX, currentY, 14, rgb(0, 0, 0));
            currentX += colWidths[index];
        });

        currentY -= lineHeight;
        boletos.forEach((boleto: Boleto) => {
            currentX = marginX;
            const rowData = [
                boleto.id.toString(),
                boleto.nome_sacado,
                boleto.id_lote.toString(),
                `R$ ${boleto.valor}`,
                boleto.linha_digitavel,
            ];

            rowData.forEach((cell, index) => {
                drawText(cell, currentX, currentY);
                currentX += colWidths[index];
            });

            currentY -= lineHeight;
        });

        const pdfBytes = await pdfDoc.saveAsBase64();
        return pdfBytes;
    }

    criar = async (boleto: CriarBoletoDto): Promise<Boleto> => {
        const loteExists = await Lote.findByPk(boleto.id_lote);
        if (!loteExists) {
            throw new HttpError(`O lote com ID ${boleto.id_lote} não existe`);
        }
        return await Boleto.create(boleto);
    }

    criarBulk = async (boletos: CriarBoletoDto[]): Promise<Boleto[]> => {
        const lotesIds = boletos.map(boleto => boleto.id_lote);
        const lotesExists = await Lote.findAll({ where: { id: lotesIds } });
        if (lotesExists.length !== lotesIds.length) {
            const lotesIdsExists = lotesExists.map(lote => lote.id);
            const lotesIdsNotExists = lotesIds.filter(id => !lotesIdsExists.includes(id));
            throw new HttpError(`Os lotes com IDs ${lotesIdsNotExists.join(", ")} não existem`);
        }
        return await Boleto.bulkCreate(boletos);
    }

    importarCsv = async (file: Express.Multer.File): Promise<Boleto[]> => {
        if (!file) {
            throw new HttpError("Arquivo não encontrado")
        }

        const boletosCsv = await this.bufferToArray(file.buffer)
        const boletosTransformados = await this.transformarParaCriarBoletoDto(boletosCsv)
        return await this.criarBulk(boletosTransformados)
    }

    bufferToArray = (buffer: Buffer): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const acc: any[] = [];

            let text = buffer.toString('utf-8');

            Readable.from(text)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => acc.push(data))
                .on('end', () => resolve(acc))
                .on('error', (err) => {
                    reject(err);
                });
        });
    };

    transformarParaCriarBoletoDto = async (boletosCsv: any[]): Promise<CriarBoletoDto[]> => {
        const boletosTransformados: CriarBoletoDto[] = [];

        for (const boleto of boletosCsv) {
            try {
                const loteExiste = await Lote.findOne({
                    where: {
                        nome: {
                            [Op.like]: `%${boleto.unidade}`,
                        },
                    },
                });

                if (!loteExiste) {
                    throw new HttpError(`Lote ${boleto.unidade} não existe`)
                }

                const boletoTransformado: CriarBoletoDto = {
                    nome_sacado: boleto.nome,
                    id_lote: loteExiste.id,
                    valor: Number(boleto.valor),
                    linha_digitavel: boleto.linha_digitavel,
                };

                boletosTransformados.push(boletoTransformado);
            } catch (error) {
                throw new Error(`Erro ao processar boleto: ${boleto.nome}`);
            }
        }

        return boletosTransformados
    }

    separarPdf = async (file: Express.Multer.File) => {
        try {
            const ORDEM_FIXA_PDF = [
                'MARCIA CARVALHO', // Página 1
                'JOSE DA SILVA',   // Página 2
                'MARCOS ROBERTO'   // Página 3
            ];

            const basePdf = await PDFDocument.load(file.buffer);
            const paginas = basePdf.getPages();

            for (let i in paginas) {
                const novoPdf = await PDFDocument.create();
                const [paginaCopiada] = await novoPdf.copyPages(basePdf, [Number(i)]);
                novoPdf.addPage(paginaCopiada);

                const pdfByte = await novoPdf.save();
                const boleto = await Boleto.findOne({
                    where: { nome_sacado: ORDEM_FIXA_PDF[i] }
                });
                
                if (!boleto) {
                    throw new HttpError(`Não existe nenhum boleto para o nome ${ORDEM_FIXA_PDF[i]} no banco de dados`);
                }
                
                fs.writeFileSync(`./boletosPdfs/${boleto?.id}.pdf`, pdfByte);
            }
            return true
        } catch {
            throw new HttpError(`Erro ao separar PDF`);
        }
    }
}