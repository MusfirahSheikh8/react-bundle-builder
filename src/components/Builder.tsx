import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { ProductCard } from './ProductCard';
import {
  FiChevronDown, FiChevronUp,
  FiVideo, FiShield, FiActivity, FiLock,
} from 'react-icons/fi';


const ICON_MAP: Record<string, React.ReactNode> = {
  Video: <FiVideo size={20} />,
  Shield: <FiShield size={20} />,
  Activity: <FiActivity size={20} />,
  Lock: <FiLock size={20} />,
};

export const Builder: React.FC = () => {
  const {
    categories,
    products,
    state: { activeStep, cart },
    dispatch,
  } = useBuilder();

  return (
    <div className="flex flex-col gap-3">
      {categories.map(category => {
        const isOpen = activeStep === category.step;

        const categoryProducts = products.filter(p => p.categoryId === category.id);

        const selectedCount = cart
          .filter(item => {
            const p = products.find(p => p.id === item.productId);
            return p?.categoryId === category.id;
          })
          .reduce((acc, item) => acc + item.quantity, 0);

        const nextCategory = categories.find(c => c.step === category.step + 1);

        return (
          <div
            key={category.id}
            className={[
              'rounded-2xl border overflow-hidden transition-all duration-200',
              isOpen
                ? 'bg-[#eef1fb] border-[#5c21ff] shadow-[0_0_0_3px_rgba(92,33,255,0.08)]'
                : 'bg-white border-gray-200 hover:border-gray-300',
            ].join(' ')}
          >
            <button
              onClick={() => dispatch({ type: 'SET_ACTIVE_STEP', payload: isOpen ? 0 : category.step })}
              className={[
                'w-full flex items-center justify-between px-6 py-5 text-left border-none cursor-pointer transition-colors duration-200',
                isOpen ? 'bg-[#eef1fb]' : 'bg-white hover:bg-gray-50',
              ].join(' ')}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4">
                <div className={`transition-colors ${isOpen ? 'text-[#5c21ff]' : 'text-gray-400'}`}>
                  {ICON_MAP[category.icon]}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Step {category.step} of {categories.length}
                  </p>
                  <h2 className={`text-lg font-semibold leading-tight transition-colors ${isOpen ? 'text-[#5c21ff]' : 'text-gray-800'}`}>
                    {category.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {selectedCount > 0 && (
                  <span className="bg-[#5c21ff] text-white text-xs font-semibold rounded-full px-2.5 py-0.5">
                    {selectedCount} selected
                  </span>
                )}
                {isOpen
                  ? <FiChevronUp size={20} className="text-[#5c21ff]" />
                  : <FiChevronDown size={20} className="text-gray-400" />
                }
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 bg-[#eef1fb]">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    className="inline-flex items-center gap-2 bg-[#5c21ff] hover:bg-[#4810de] active:scale-[0.98] text-white font-semibold rounded-full px-8 py-3 text-sm transition-all duration-150 shadow shadow-[#5c21ff44]"
                    onClick={() => dispatch({ type: 'SET_ACTIVE_STEP', payload: category.step + 1 })}
                  >
                    {nextCategory ? `Next: ${nextCategory.title}` : 'Review Your System →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
