import Link from 'next/link';
import { Utensils } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center text-brand-dark p-6">
      <div className="text-center space-y-8 animate-fade-in max-w-md w-full">
        
        {/* Logo Minimalista */}
        <div className="flex justify-center">
          <div className="bg-brand-red p-8 rounded-full shadow-2xl">
            <Utensils className="w-24 h-24 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-brand-red">
            Resenha Burger
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            O sabor que conecta.
          </p>
        </div>

        {/* Botão Principal - Área de toque grande (Lei de Fitts) */}
        <Link href="/menu" className="block w-full">
          <div className="bg-brand-red text-white font-bold text-2xl py-5 rounded-xl shadow-lg active:scale-95 transition-transform hover:bg-red-700 text-center">
            FAZER PEDIDO
          </div>
        </Link>
        
        <p className="text-sm text-gray-400 mt-8">Toque na tela para começar</p>
      </div>
    </main>
  );
}
