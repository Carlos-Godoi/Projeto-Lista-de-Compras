import type { ItemCompra } from "./ItemCompra";

export interface ListaCompra {
    itens: ItemCompra[];
    valorTotal: number;
    dataCompra: Date;
}