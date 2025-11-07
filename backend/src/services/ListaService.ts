// src/services/ListaService.ts
import ListaCompraModel, { IListaCompraModel } from '../models/ListaCompra';
import type { ListaCompra } from '../types/ListaCompra';
import { ItemCompra } from '../types/ItemCompra';
import { PRODUTOS_TABELADOS } from '../constants/produtos';

class ListaService {
  /**
   * 1. Valida se os produtos existem na tabela.
   * 2. Calcula o valor final de cada item.
   * 3. Calcula o valor total da compra.
   * 4. Salva a lista no MongoDB.
   */
  async criarLista(itens: Omit<ItemCompra, 'valorUnitario'>[]): Promise<IListaCompraModel> {
    if (itens.length === 0 || itens.length > 5) {
      throw new Error('A lista de compras deve conter entre 1 e 5 itens.');
    }

    const itensCalculados: ItemCompra[] = [];
    let valorTotal = 0;

    for (const item of itens) {
      const produtoInfo = PRODUTOS_TABELADOS.find(p => p.nome.toLowerCase() === item.produtoNome.toLowerCase());

      if (!produtoInfo) {
        throw new Error(`Produto '${item.produtoNome}' não encontrado na tabela de preços.`);
      }

      if (item.quantidadeKg <= 0) {
          throw new Error(`Quantidade inválida para o produto '${item.produtoNome}'.`);
      }

      const valorUnitario = parseFloat((item.quantidadeKg * produtoInfo.valorPorKg).toFixed(2));
      valorTotal += valorUnitario;

      itensCalculados.push({
        produtoNome: produtoInfo.nome, // Garante o nome padronizado da tabela
        quantidadeKg: item.quantidadeKg,
        valorUnitario: valorUnitario,
      });
    }

    const novaLista: ListaCompra = {
      itens: itensCalculados,
      valorTotal: parseFloat(valorTotal.toFixed(2)),
      dataCompra: new Date(),
    };

    const listaSalva = new ListaCompraModel(novaLista);
    await listaSalva.save();

    return listaSalva;
  }

  // Adicione outros métodos (ex: buscarTodasListas, buscarListaPorId)
  async buscarTodasListas(): Promise<IListaCompraModel[]> {
    return ListaCompraModel.find().sort({ dataCompra: -1 });
  }

  async buscarListaPorId(id: string): Promise<IListaCompraModel | null> {
    return ListaCompraModel.findById(id);
  }
}

export default new ListaService();