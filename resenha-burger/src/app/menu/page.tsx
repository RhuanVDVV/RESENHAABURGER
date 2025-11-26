'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useCart, Product } from '@/context/CartContext';
import { ChevronUp, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductModal, { CustomizationOption } from '@/components/ProductModal';

// --- LISTA DE PRODUTOS EXPANDIDA ---
const products: Product[] = [
  // BURGERS
  { id: 1, name: 'Resenha Clássico', price: 25.90, category: 'Burgers', image: '/burger1.png', description: 'Pão brioche, carne 180g, queijo prato e molho especial.' },
  { id: 2, name: 'Mega Bacon', price: 29.90, category: 'Burgers', image: '/burger2.png', description: 'Pão australiano, carne 180g, muito bacon crocante e cheddar.' },
  { id: 5, name: 'Chicken Crispy', price: 22.90, category: 'Burgers', image: '/chickencrispy.png', description: 'Filé de frango empanado, alface, tomate e maionese.' },
  { id: 6, name: 'Duplo Cheddar', price: 32.90, category: 'Burgers', image: '/doublecheddar.png', description: 'Dois hambúrgueres, dobro de cheddar e cebola caramelizada.' },
  
  // ACOMPANHAMENTOS
  { id: 3, name: 'Batata Rústica', price: 12.90, category: 'Acomp.', image: '/fries.png', description: 'Batatas cortadas à mão com alecrim e sal grosso.' },
  { id: 7, name: 'Onion Rings', price: 14.90, category: 'Acomp.', image: '/onionring.png', description: 'Anéis de cebola empanados e crocantes.' },
  { id: 8, name: 'Nuggets (6un)', price: 11.90, category: 'Acomp.', image: '/nugget.png', description: 'Crocantes por fora, macios por dentro.' },

  // BEBIDAS
  { id: 4, name: 'Coca-Cola', price: 6.90, category: 'Bebidas', image: '/coke.png', description: 'Lata 350ml gelada.' },
  { id: 9, name: 'Sprite', price: 6.90, category: 'Bebidas', image: '/sprite.png', description: 'Lata 350ml gelada.' },
  { id: 10, name: 'Suco de Laranja', price: 9.90, category: 'Bebidas', image: '/laranja.png', description: 'Natural da fruta, garrafa 300ml.' },
  { id: 11, name: 'Água Mineral', price: 4.50, category: 'Bebidas', image: '/agua.png', description: 'Garrafa 500ml sem gás.' },
];

const categories = ['Todos', 'Burgers', 'Acomp.', 'Bebidas'];

// (Mantenha o customizationMap igual ao anterior...)
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

export default function Menu() {
  const [activeCat, setActiveCat] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { items, addToCart, total } = useCart();

  const filtered = activeCat === 'Todos' ? products : products.filter(p => p.category === activeCat);

  const getOptionsForProduct = (product: Product | null) => {
    if (!product) return [];
    return customizationMap[product.category] || [];
  };

  return (
    <div className="min-h-screen bg-brand-light pb-32">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-center">
        <h1 className="text-2xl font-extrabold text-brand-red tracking-tight">Resenha Burger</h1>
      </header>

      {/* --- NAVEGAÇÃO MELHORADA (Filtros Maiores) --- */}
      {/* Aumentamos padding (py-4) e tamanho da fonte (text-base) para melhor toque */}
      <nav className="p-4 overflow-x-auto whitespace-nowrap bg-white border-b border-gray-100 scrollbar-hide">
        <div className="flex space-x-4 px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-8 py-3 rounded-full text-base font-bold transition-all shadow-sm active:scale-95 ${
                activeCat === cat 
                  ? 'bg-brand-red text-white ring-2 ring-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Grid de Produtos */}
      <section className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mt-2">
        {filtered.map(product => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)} 
            className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition border border-transparent hover:border-brand-red/20 group"
          >
            <div className="relative w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
               <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
            </div>
            
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mt-2">{product.description}</p>
              </div>
              <div className="text-brand-red font-bold mt-2 text-lg flex justify-between items-center">
                R$ {product.price.toFixed(2).replace('.', ',')}
                <div className="bg-red-50 text-brand-red p-2 rounded-lg flex">
                  <span className="text-xs font-bold">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* (Mantenha a Bottom Bar e o ProductModal iguais ao anterior...) */}
      {items.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <Link href="/cart">
            <div className="bg-brand-dark text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-brand-red/20 active:scale-[0.98] transition-transform cursor-pointer ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-brand-red w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative">
                  <ShoppingBag size={18} />
                  <span className="absolute -top-1 -right-1 bg-white text-brand-red text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-brand-red">
                    {items.length}
                  </span>
                </div>
                <span className="font-medium">Ver sacola</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-lg">
                R$ {total.toFixed(2).replace('.', ',')}
                <ChevronUp size={20} className="text-gray-400" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          availableOptions={getOptionsForProduct(selectedProduct)}
          onConfirm={(qty, customs, finalPrice) => {
            addToCart(selectedProduct, qty, customs, finalPrice);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
