import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { ListaCompra } from '../types/ListaCompra'; 
import { ItemCompra } from '../types/ItemCompra';


export interface IItemCompraModel extends ItemCompra, Document {}
export interface IListaCompraModel extends ListaCompra, Document {}

const ItemCompraSchema: Schema = new Schema({
  produtoNome: { type: String, required: true },
  quantidadeKg: { type: Number, required: true, min: 0.01 },
  valorUnitario: { type: Number, required: true, min: 0 },
});

const ListaCompraSchema: Schema = new Schema({
  itens: { type: [ItemCompraSchema], required: true, validate: [arrayLimit, '{PATH} excede o limite de 5 itens.'] },
  valorTotal: { type: Number, required: true, min: 0 },
  dataCompra: { type: Date, default: Date.now },
});

// Função de validação para o limite de 5 itens
function arrayLimit(val: Array<any>) {
  return val.length <= 5;
}

export default mongoose.model<IListaCompraModel>('ListaCompra', ListaCompraSchema);