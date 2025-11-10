import { useState, useEffect } from 'react';
import { useListaApi } from './hooks/useListaApi';
import type { ItemForm, ListaCompra, ProdutoTabelado } from './types';
import axios from 'axios';


const App: React.FC = () => {
  const { getProdutosTabelados, criarLista, getHistoricoListas } = useListaApi();

  const [produtos, setProdutos] = useState<ProdutoTabelado[]>([]);
  const [itensForm, setItensForm] = useState<ItemForm[]>([{ produtoNome: '', quantidadeKg: 0 }]);
  const [listaFinal, setListaFinal] = useState < ListaCompra | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [historico, setHistorico] = useState<ListaCompra[]>([]);

  useEffect(() => {
    getProdutosTabelados().then(setProdutos);
    getHistoricoListas().then(setHistorico);
  }, [getHistoricoListas, getProdutosTabelados]);

  const handleAddItem = () => {
    if (itensForm.length < 5) { //Limite de 5 itens
      setItensForm([...itensForm, { produtoNome: '', quantidadeKg: 0 }]);
    }
  };

  const handleSubmit = async () => {
    setErro(null);
    setListaFinal(null);

    // Filtra itens imcopletos e com quantidade zero antes de enviar
    const itensValidos = itensForm.filter(item => item.produtoNome && item.quantidadeKg > 0);

    if (itensValidos.length === 0) {
      setErro("Adicione pelo menos um item válido.");
      return;
    }

    try {
      // Envia os dados para a API para que ela calcule e valide! 
      const novaLista = await criarLista(itensValidos);
      setListaFinal(novaLista);
      setItensForm([{ produtoNome: '', quantidadeKg: 0 }]); // Limpa o formulário
      setHistorico(prev => [novaLista, ...prev]); // Atualiza o histórico
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setErro(e.response.data.message); //Exibe erro de validação do BackEnd
      } else {
        setErro('Erro na conexão com o servidor.');
      }
    }
  };

  return (
    <div>
      <h1>Minha Lista de Compras Fill-Stack</h1>

      {/* 1. Formulário de Inserção de Itens */}
      <h2>Adicionar Itens (Máx. 5)</h2>
      {itensForm.map((item, index) => (
        // Componente de Input para cada item (Select com produtos, Input para Kg)
        // ... Lógica de Inputs (onChange, onRemove)
        <div key={index}>
          <select
            value={item.produtoNome}
            onChange={(e) => {
              const newItems = [...itensForm];
              newItems[index].produtoNome = e.target.value;
              setItensForm(newItems);
            }}
          >
            <option value="">Selecione a fruta</option>
            {produtos.map(p => <option key={p.nome} value={p.nome}>{p.nome} (R$ {p.valorPorKg}/Kg)</option>)}
          </select>
          <input
            type="number"
            min="1"
            //step="0.01"
            value={item.quantidadeKg}
            onChange={(e) => {
              const newItems = [...itensForm];
              newItems[index].quantidadeKg = parseFloat(e.target.value) || 0;
              setItensForm(newItems);
            }}
          /> Kg
        </div>
      ))}

      {itensForm.length < 5 && <button onClick={handleAddItem}>Adicionar Item</button>}
      <button onClick={handleSubmit} disabled={itensForm.length === 0}>Finalizar Compra</button>

      {erro && <p style={{ color: 'red' }}>Erro: { }erro</p>}

      <hr />

      {/* 2. Extrato da Compra Finalizada */}
      {listaFinal && (
        <>
          <h2>Extrato da Compra em {new Date(listaFinal.dataCompra).toLocaleDateString()}</h2>
          <ul>
            {listaFinal.itens.map((item, index) => (
              <li key={index}>
                **{item.produtoNome}**: {item.quantidadeKg} kg * (Valor Tabelado) = **R$ {item.valorUnitario.toFixed(2)}**
              </li>
            ))}
          </ul>
          <h3>Total da Compra: **R$ {listaFinal.valorTotal.toFixed(2)}**</h3>
        </>
      )}

      <hr />

      {/* 3. Histórico de Compras */}
      <h2>Históricode Compras</h2>
      <ul>
        {historico.map(lista => (
          <li key={lista._id}>
            Compra de **R$ {lista.valorTotal.toFixed(2)}** em {new Date(lista.dataCompra).toLocaleDateString()} - {lista.itens.length} itens.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;


















