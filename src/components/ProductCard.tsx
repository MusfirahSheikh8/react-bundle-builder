import React, { useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { FiMinus, FiPlus } from 'react-icons/fi';


interface Variant {
  id: string;
  name: string;
  colorCode?: string;
  imageUrl?: string;
}

interface ProductData {
  id: string;
  title: string;
  description: string;
  learnMoreUrl?: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  imageUrl?: string;
  variants?: Variant[];
}

interface Props {
  product: ProductData;
}


export const ProductCard: React.FC<Props> = ({ product }) => {
  const { getCartQuantity, dispatch } = useBuilder();

  const [activeVariantId, setActiveVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );

  const activeVariant = product.variants?.find(v => v.id === activeVariantId);
  const currentQty = getCartQuantity(product.id, activeVariantId);

  const isSelected = product.variants
    ? product.variants.some(v => getCartQuantity(product.id, v.id) > 0)
    : getCartQuantity(product.id) > 0;

  const handleDecrease = () =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: product.id, variantId: activeVariantId, delta: -1 } });

  const handleIncrease = () =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: product.id, variantId: activeVariantId, delta: 1 } });

  const imgSrc = activeVariant?.imageUrl || product.imageUrl;

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border-2 bg-white p-5 transition-all duration-200',
        isSelected
          ? 'border-[#5c21ff] shadow-[0_0_0_3px_rgba(92,33,255,0.12)]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
      ].join(' ')}
    >
      {product.badge && (
        <span className="absolute top-4 left-4 bg-[#5c21ff] text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5">
          {product.badge}
        </span>
      )}

      <div className={`w-full flex justify-center items-center mb-4 ${product.badge ? 'mt-6' : ''}`}>
        <div className="w-28 h-28 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
          {imgSrc ? (
            <img src={imgSrc} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-300 text-4xl">📷</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">{product.title}</h3>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{product.description}</p>
        {product.learnMoreUrl && (
          <a
            href={product.learnMoreUrl}
            className="inline-block mt-2 text-xs font-medium text-[#5c21ff] hover:underline"
          >
            Learn More →
          </a>
        )}
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          {product.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setActiveVariantId(variant.id)}
              title={variant.name}
              className="w-5 h-5 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: variant.colorCode ?? '#ccc',
                border: `2px solid ${activeVariantId === variant.id ? '#5c21ff' : 'transparent'}`,
                outline: activeVariantId === variant.id ? '2px solid #5c21ff' : 'none',
                outlineOffset: '2px',
                boxShadow: activeVariantId === variant.id ? '0 0 0 1px white inset' : 'none',
              }}
              aria-label={`Select ${variant.name}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

        <div className="stepper">
          <button onClick={handleDecrease} disabled={currentQty === 0} aria-label="Decrease">
            <FiMinus size={14} />
          </button>
          <span className="text-sm w-6 text-center">{currentQty}</span>
          <button onClick={handleIncrease} aria-label="Increase">
            <FiPlus size={14} />
          </button>
        </div>


        <div className="text-right">
          {product.compareAtPrice && product.compareAtPrice > 0 && (
            <p className="text-xs text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</p>
          )}
          <p className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
