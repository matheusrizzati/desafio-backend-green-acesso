import { LoteService } from "../services/LoteService";
import { Lote } from "../models/Lote";

export class LoteController {
    private loteService = new LoteService()

    buscarTodos = async (req: any, res: any) => {
        try {
            const usuarios = this.loteService.buscarTodos();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }

    criar = async (req: any, res: any) => {
        try {
            const { nome, ativo } = req.body;
            const lote = await Lote.create({ nome, ativo });
            return res.status(201).json(lote);
        } catch (error) {
            console.error('Erro ao criar lote:', error); // <-- isso aqui ajuda muito!
            return res.status(500).json({ message: 'Erro ao criar lote', error });
        }
    };
}