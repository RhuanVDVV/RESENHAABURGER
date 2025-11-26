'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChefHat, Clock } from 'lucide-react';

export default function Success() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderNumber(Math.floor(Math.random() * 999) + 1);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/');
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, router]);

  const formattedOrderNumber = orderNumber 
    ? String(orderNumber).padStart(3, '0') 
    : '...';

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center text-brand-dark p-6 text-center relative">
      
      <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
        <CheckCircle size={80} strokeWidth={3} className="text-green-600" />
      </div>
      
      <h1 className="text-3xl font-extrabold mb-2 text-gray-800">Pedido Confirmado!</h1>
      
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 mb-8 w-full max-w-sm shadow-sm">
        <p className="text-lg text-gray-500 font-medium uppercase tracking-widest">Sua senha</p>
        
        {/* Exibição da Senha */}
        <span className="font-black text-brand-red text-7xl block mt-2 tracking-tighter">
          #{formattedOrderNumber}
        </span>
      </div>
      
      <div className="w-full max-w-sm mb-12">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
          <div className="h-px bg-gray-200 flex-grow"></div>
          <span className="text-xs font-bold uppercase">Acompanhe</span>
          <div className="h-px bg-gray-200 flex-grow"></div>
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center gap-4 border border-blue-100">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <ChefHat size={24} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">Em preparação</p>
            <p className="text-sm text-blue-600/80">Aguarde o chamado no painel</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full max-w-xs">
        <Link 
          href="/" 
          className="block w-full bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg active:scale-95"
        >
          Fazer novo pedido
        </Link>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Clock size={16} />
          <p>
            Reiniciando em <span className="font-bold text-brand-red text-lg w-6 inline-block text-center">{timeLeft}</span> s
          </p>
        </div>
      </div>
    </main>
  );
}
