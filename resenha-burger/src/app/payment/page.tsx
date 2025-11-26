'use client'
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CreditCard, Banknote, QrCode, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Payment() {
  const { total, clearCart } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinish = () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simula processamento
    setTimeout(() => {
      clearCart(); // Limpa o carrinho apenas após o sucesso
      router.push('/success');
    }, 2000);
  };

  const methods = [
    { id: 'credit', label: 'Crédito', icon: CreditCard },
    { id: 'debit', label: 'Débito', icon: CreditCard },
    { id: 'pix', label: 'Pix', icon: QrCode },
    { id: 'cash', label: 'Dinheiro', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full text-brand-red">
          <ArrowLeft />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Pagamento</h1>
      </header>

      <div className="flex-grow p-6 max-w-lg mx-auto w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Como você quer pagar?</h2>
        
        <div className="space-y-3">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                selectedMethod === method.id 
                  ? 'border-brand-red bg-white shadow-md' 
                  : 'border-transparent bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-red-50 text-brand-red' : 'bg-gray-100 text-gray-500'}`}>
                  <method.icon size={24} />
                </div>
                <span className="font-semibold text-gray-700 text-lg">{method.label}</span>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id ? 'border-brand-red bg-brand-red text-white' : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && <Check size={14} strokeWidth={4} />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between text-lg font-medium text-gray-600">
            <span>Total a pagar</span>
            <span className="font-bold text-brand-dark">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleFinish}
          disabled={!selectedMethod || isProcessing}
          className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
        </button>
      </div>
    </div>
  );
}
