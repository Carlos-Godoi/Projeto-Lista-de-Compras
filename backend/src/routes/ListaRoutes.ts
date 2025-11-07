import { Router } from 'express';
import ListaController from '../controllers/ListaController';
import { PRODUTOS_TABELADOS } from '../constants/produtos';

const router = Router();

// Rota para criar uma lista de compras
router.post('/listas', ListaController.criarLista);

// Rota para buscar todas as listas
router.get('/listas', ListaController.buscarTodasListas);

// Rota para retornar os produtos tabelados (útil para o Front)
router.get('/produtos', (req, res) => {
    res.status(200).json(PRODUTOS_TABELADOS);
});

export default router;