import { BoletoService } from "../services/BoletoService";
import { CriarBoletoDto } from "../dtos/Boleto/CriarBoletoDto";
import { Response } from "express";
import { FiltrosBoletoDto } from "../dtos/Boleto/FiltrosBoletoDto";

export class BoletoController {
    private boletoService = new BoletoService()

    buscar = async (req: {query: FiltrosBoletoDto}, res: Response) => {
        const boletos = await this.boletoService.buscar(req.query)
        res.status(200).json(boletos)
    }

    criar = async (req: { body: CriarBoletoDto }, res: Response) => {
        const boleto = await this.boletoService.criar(req.body);
        res.status(201).json(boleto);
    };

    importarCsv = async (req: any, res: Response) => {
        const file = req.file as Express.Multer.File;
        const boletos = await this.boletoService.importarCsv(file);
        res.status(201).json(boletos);
    }

    separarPdf = async (req: any, res: Response) => {
        const file = req.file as Express.Multer.File
        await this.boletoService.separarPdf(file)
        res.status(201).json("PDF separado com suceso")
    }
}
