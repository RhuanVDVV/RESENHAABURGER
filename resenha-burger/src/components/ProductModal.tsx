'use client'
import { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Check } from 'lucide-react';
import { Product } from '@/context/CartContext';

// Tipo para as opções de customização
export type CustomizationOption = {
  id: string;
  label: string;
  price: number;
};

interface ProductModalProps {
  onClose: () => void;
  product: Product;
  availableOptions: CustomizationOption[]; // Nova prop: Opções disponíveis para este produto
  initialQuantity?: number;
  initialCustomizations?: string[];
  // Callback agora retorna também o preço final calculado
  onConfirm: (quantity: number, customizations: string[], finalPrice: number) => void; 
  confirmLabel?: string;
}

export default function ProductModal({ 
  onClose, 
  product, 
  availableOptions, 
  initialQuantity = 1,
  initialCustomizations = [],
  onConfirm,
  confirmLabel = "Adicionar"
}: ProductModalProps) {
  
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>(initialCustomizations);

  const toggleCustomization = (id: string) => {
    setSelectedCustomizations(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CÁLCULO DE PREÇO CORRIGIDO
  // Preço Base + Soma dos Extras Selecionados
  const unitPriceWithExtras = product.price + selectedCustomizations.reduce((acc, id) => {
    const opt = availableOptions.find(o => o.id === id);
    return acc + (opt?.price || 0);
  }, 0);

  const totalPrice = unitPriceWithExtras * quantity;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        <div className="p-4 relative border-b border-gray-100 flex items-center justify-center">
          <button onClick={onClose} className="absolute left-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition">
            <X size={20} />
          </button>
          <h2 className="font-bold text-lg text-gray-800">Detalhes</h2>
        </div>

        <div className="overflow-y-auto p-6 grow">
          <div className="flex gap-4 mb-8">
             <div className="w-24 h-24 bg-gray-100 rounded-xl relative overflow-hidden shrink-0">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
             </div>
             <div>
               <h3 className="font-extrabold text-xl text-gray-900">{product.name}</h3>
               <p className="text-gray-500 text-sm mt-1 leading-relaxed">{product.description}</p>
               {/* Mostra o preço unitário base */}
               <p className="text-brand-red font-bold mt-2 text-lg">Base: R$ {product.price.toFixed(2).replace('.', ',')}</p>
             </div>
          </div>

          {/* Renderiza opções apenas se houver alguma disponível */}
          {availableOptions.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 border-l-4 border-brand-red pl-3">Personalize seu pedido</h4>
              <div className="grid gap-3">
                {availableOptions.map(option => (
                  <div 
                    key={option.id} 
                    onClick={() => toggleCustomization(option.id)}
                    className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCustomizations.includes(option.id) 
                        ? 'border-brand-red bg-red-50' 
                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedCustomizations.includes(option.id) 
                          ? 'bg-brand-red border-brand-red text-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedCustomizations.includes(option.id) && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="text-gray-700 font-medium">{option.label}</span>
                    </div>
                    {option.price > 0 ? (
                      <span className="text-brand-red font-bold text-sm">+ R$ {option.price.toFixed(2).replace('.', ',')}</span>
                    ) : (
                      <span className="text-green-600 text-xs font-bold uppercase tracking-wide bg-green-100 px-2 py-1 rounded">Grátis</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
              Este item não possui opções de personalização.
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl h-14 overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 h-full text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <span className="px-2 font-bold w-8 text-center text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 h-full text-brand-red hover:bg-red-50 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            <button 
              // Passamos o preço unitário calculado (com extras) de volta para o pai
              onClick={() => onConfirm(quantity, selectedCustomizations, unitPriceWithExtras)}
              className="grow bg-brand-red text-white h-14 rounded-xl font-bold shadow-lg active:scale-95 transition flex items-center justify-between px-6 hover:bg-red-700"
            >
              <span>{confirmLabel}</span>
              <span className="bg-black/20 px-2 py-1 rounded text-sm">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
