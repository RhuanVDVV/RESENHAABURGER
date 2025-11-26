'use client'
import { useState } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { Trash2, ArrowLeft, Minus, Plus, Pencil, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductModal, { CustomizationOption } from '@/components/ProductModal';

// Precisamos do mesmo mapa aqui para passar para o Modal de Edição
// Em um app real, isso estaria em um arquivo separado 'constants.ts'
const customizationMap: Record<string, CustomizationOption[]> = {
  'Burgers': [
    { id: 'sem-cebola', label: 'Sem Cebola', price: 0 },
    { id: 'sem-picles', label: 'Sem Picles', price: 0 },
    { id: 'extra-queijo', label: 'Extra Queijo', price: 4.00 },
    { id: 'extra-bacon', label: 'Extra Bacon', price: 5.00 },
    { id: 'ponto-bem-passado', label: 'Bem Passado', price: 0 },
  ],
  'Acomp.': [
    { id: 'extra-cheddar', label: 'Adicionar Cheddar', price: 3.50 },
    { id: 'extra-bacon-bits', label: 'Bacon Bits', price: 2.00 },
    { id: 'sem-sal', label: 'Sem Sal', price: 0 },
  ],
  'Bebidas': [
    { id: 'com-gelo', label: 'Com Gelo', price: 0 },
    { id: 'com-limao', label: 'Rodela de Limão', price: 0 },
  ],
};

export default function Cart() {
  const { items, removeFromCart, updateQuantity, editCartItem, total } = useCart();
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const handleEdit = (item: CartItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (qty: number, customs: string[], newPrice: number) => {
    if (editingItem) {
      // Agora passamos o novo preço calculado
      editCartItem(editingItem.cartId, qty, customs, newPrice);
      setEditingItem(null);
    }
  };

  const getOptionsForProduct = (category: string) => {
    return customizationMap[category] || [];
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      {/* Header ... (igual) */}
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <Link href="/menu" className="p-2 hover:bg-gray-100 rounded-full text-brand-red transition">
          <ArrowLeft />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Minha Sacola</h1>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto pb-32">
        {items.length === 0 ? (
           /* ... Empty State igual ... */
           <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 animate-fade-in">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Trash2 size={48} className="text-gray-300" />
            </div>
            <p className="font-medium">Sua sacola está vazia.</p>
            <Link href="/menu" className="text-brand-red font-bold mt-4 hover:underline">
              Voltar ao cardápio
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.cartId} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-brand-red hover:bg-red-50 p-1 rounded-md transition flex items-center gap-1 text-xs font-bold"
                      aria-label="Editar item"
                    >
                      <Pencil size={12} /> Editar
                    </button>
                  </div>
                  
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.customizations.map((customId, idx) => {
                        // Encontrar o label legível para exibir
                        const opts = getOptionsForProduct(item.category);
                        const opt = opts.find(o => o.id === customId);
                        return (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium border border-gray-200">
                            {opt ? opt.label : customId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-red">
                    {/* Preço Unitário X Quantidade */}
                    R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">
                      {item.quantity}x R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <button 
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 px-2 py-1 transition-colors"
                >
                  <Trash2 size={16} /> <span className="text-xs font-medium">Remover</span>
                </button>

                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-9">
                  <button 
                    onClick={() => updateQuantity(item.cartId, -1)}
                    className="px-3 text-brand-red hover:bg-gray-100 h-full rounded-l-lg disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-gray-700">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.cartId, 1)}
                    className="px-3 text-brand-red hover:bg-gray-100 h-full rounded-r-lg"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer ... (igual) */}
      {items.length > 0 && (
        <div className="bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-3xl z-20">
          <div className="flex justify-between text-gray-500 mb-2 text-sm">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <button 
            onClick={() => router.push('/payment')}
            className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-red/30 active:scale-[0.98] transition-all hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Ir para Pagamento
          </button>
        </div>
      )}

      {/* Modal de Edição */}
      {editingItem && (
        <ProductModal
          onClose={() => setEditingItem(null)}
          product={editingItem} 
          availableOptions={getOptionsForProduct(editingItem.category)} // Passa opções corretas para edição
          initialQuantity={editingItem.quantity} 
          initialCustomizations={editingItem.customizations} 
          onConfirm={handleSaveEdit}
          confirmLabel="Salvar Alterações"
        />
      )}
    </div>
  );
}
