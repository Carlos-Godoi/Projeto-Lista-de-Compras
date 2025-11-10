import axios from 'axios';
import type { ItemForm, ProdutoTabelado, ListaCompra } from '../types';


const API_URL = 'http://localhost:3000/api';

export const useListaApi = () => {
    const getProdutosTabelados = async (): Promise<ProdutoTabelado[]> => {
        const response = await axios.get(`${API_URL}/produtos`);
        return response.data;
    };

    const criarLista = async (itens: ItemForm[]): Promise<ListaCompra> => {
        const response = await axios.post(`${API_URL}/lista`, {itens});
        return response.data;
    };

    const getHistoricoListas = async (): Promise<ListaCompra[]> => {
        const response = await axios.get(`${API_URL}/listas`);
        return response.data;
    }

    return { getProdutosTabelados, criarLista, getHistoricoListas };
};

