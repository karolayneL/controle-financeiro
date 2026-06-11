import { useState, useEffect } from 'react';
import type { Transaction, TransactionType } from './types';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('@pontoenv:transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<TransactionType>('receita');

  const [filterType, setFilterType] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('@pontoenv:transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      date,
      type
    };

    setTransactions([...transactions, newTransaction]);
    setDescription(''); setAmount(''); setCategory(''); setDate('');
  };

  const totalReceitas = transactions.filter(t => t.type === 'receita').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa').reduce((acc, curr) => acc + curr.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  const filteredTransactions = transactions.filter(t => {
    const matchType = filterType === 'todos' || t.type === filterType;
    const matchCategory = filterCategory === '' || t.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchType && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
        </header>

        {/* Resumo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 text-sm">Receitas</h2>
            <p className="text-xl font-bold text-green-600">R$ {totalReceitas.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 text-sm">Despesas</h2>
            <p className="text-xl font-bold text-red-600">R$ {totalDespesas.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
            <h2 className="text-gray-300 text-sm">Saldo Total</h2>
            <p className={`text-xl font-bold ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {saldo.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Formulário */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-700 mb-4">Nova Transação</h2>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" type="text" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
            <input className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" type="number" step="0.01" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} required />
            <input className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" type="text" placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} required />
            <input className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <select className="border p-2 rounded-lg w-full bg-white text-gray-800" value={type} onChange={e => setType(e.target.value as TransactionType)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <button className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer" type="submit">Adicionar</button>
          </form>
        </section>

        {/* Lista e Filtros */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="font-semibold text-gray-700">Transações</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <select className="border p-2 rounded-lg flex-1 bg-white text-gray-800" value={filterType} onChange={e => setFilterType(e.target.value as any)}>
                <option value="todos">Todos os Tipos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
              <input className="border p-2 rounded-lg flex-1 bg-white text-gray-800" type="text" placeholder="Filtrar categoria..." value={filterCategory} onChange={e => setFilterCategory(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 && <p className="text-gray-500 text-center py-4">Nenhuma transação encontrada.</p>}
            {filteredTransactions.map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-500">{t.category} • {t.date.split('-').reverse().join('/')}</p>
                </div>
                <p className={`font-semibold ${t.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'receita' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}