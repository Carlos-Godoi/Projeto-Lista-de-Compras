export interface ProdutoTabelado {
    nome: string;
    valorPorKg: number;
}

export interface ItemForm {
    produtoNome: string;
    quantidadeKg: number;
}

export interface ItemCompra extends ItemForm {
    valorUnitario: number; // Valor final (Calculado)
}

export interface ListaCompra {
    _id: string; // Adiciona o ID do MongoDB
    itens: ItemCompra[];
    valorTotal: number;
    dataCompra: string;
}