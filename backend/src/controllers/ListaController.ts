import type { Request, Response } from 'express';
import ListaService from '../services/ListaService';

class ListaController {
    async criarLista(req: Request, res: Response): Promise<void> {
        try {
            const itens = req.body.itens; // Espera um array de { produtoNome: string, quantidade: number }

            if (!itens || !Array.isArray(itens)) {
                res.status(400).json({ message: 'O corpo da requisição deve conter um array de itens.' });
                return;
            }

            const listaSalva = await ListaService.criarLista(itens);
            res.status(201).json(listaSalva);
        } catch (error) {
            // TypeScript nos ajuda a garantir que 'error' seja tratado
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erro interno ao criar a lista de compras.' });
            }
        }
    }

    async buscarTodasListas(req: Request, res: Response): Promise<void> {
        try {
            const listas = await ListaService.buscarTodasListas();
            res.status(200).json(listas);
        } catch (error) {
            res.status(500).json({ message: 'Erro interno ao buscar as listas.' });
        }
    }

    /** 🆔 Manipula a busca de uma lista por ID. */
    async buscarListaPorId(req: Request, res: Response): Promise<void> {
        try {
            // 1. Extrai o ID do parâmetro de rota (ex: /listas/:id)
            const { id } = req.params;
            
            // 2. Chama o Service para buscar no banco
            const lista = await ListaService.buscarListaPorId(id);

            // 3. Validação básica (garantir que o ID não está vazio)
            if (!id) {
                res.status(400).json({ message: 'ID da lista é obrigatório.' });
                return;
            }

            // 4. Tratamento 404: Se o Service retornar null
            if (!lista) {
                res.status(404).json({ message: `Lista com ID ${id} não encontrada.` });
                return;
            }

            // 5. Resposta: 200 OK
            res.status(200).json(lista);
        } catch (error) {
            // O catch lida com IDs malformados (que não são ObjectID válidos) ou outros erros de DB.
            console.error('Erro ao buscar lista por ID:', error);
            res.status(500).json({ message: 'Erro interno ao buscar a lista.' });
        }
    }
}

export default new ListaController();