import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { FiMinus, FiPlus, FiTruck } from 'react-icons/fi';
import { BiShield } from 'react-icons/bi';


function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}


export const ReviewPanel: React.FC = () => {
  const {
    state: { cart },
    dispatch,
    products,
    categories,
    saveForLater,
  } = useBuilder();

  const groupedCart: Record<string, typeof cart> = {};
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.productId);
    if (!p) return;
    groupedCart[p.categoryId] = groupedCart[p.categoryId] ?? [];
    groupedCart[p.categoryId].push(item);
  });

  let total = 0;
  let compareAtTotal = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.productId);
    if (!p) return;
    total += p.price * item.quantity;
    compareAtTotal += ((p as any).compareAtPrice || p.price) * item.quantity;
  });
  const savings = compareAtTotal > total ? compareAtTotal - total : 0;
  const monthly = (total / 12).toFixed(2);

  const handleQty = (productId: string, variantId: string | undefined, delta: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, delta } });

  return (
    <div className="bg-[#eef1fb] rounded-2xl overflow-hidden border border-[#dde2f5]">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] divide-y md:divide-y-0 md:divide-x divide-[#d5daf0]">

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">Your security system</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Review your personalized protection system designed to keep what matters most safe.
          </p>

          <hr className="border-[#d5daf0] my-4" />

          {cart.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">
              No items yet — start building your system above!
            </p>
          )}

          <div className="flex flex-col gap-5">
            {categories.map(category => {
              const items = groupedCart[category.id];
              if (!items || items.length === 0) return null;

              const label = category.title
                .replace('Choose your ', '')
                .replace('Add extra ', '')
                .toUpperCase();

              const isPlan = category.id === 'plan';

              return (
                <div key={category.id}>

                  <p className="text-[10px] font-semibold tracking-[0.12em] text-gray-400 uppercase mb-2">
                    {label}
                  </p>

                  <div className="flex flex-col gap-3">
                    {items.map(item => {
                      const p = products.find(pr => pr.id === item.productId)!;
                      if (!p) return null;
                      const variant = (p as any).variants?.find((v: any) => v.id === item.variantId);
                      const imgSrc = variant?.imageUrl ?? (p as any).imageUrl;
                      const linePrice = p.price * item.quantity;
                      const lineCompare = ((p as any).compareAtPrice || p.price) * item.quantity;
                      const hasDiscount = lineCompare > linePrice;

                      if (isPlan) {
                        return (
                          <div
                            key={`${item.productId}-${item.variantId ?? 'base'}`}
                            className="flex items-center gap-3 pb-3 border-b border-[#d5daf0] last:border-0"
                          >
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#5c21ff]/10 flex items-center justify-center">
                              <BiShield size={16} className="text-[#5c21ff]" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold">
                                <span className="text-gray-900">Cam </span>
                                <span className="text-[#5c21ff]">Unlimited</span>
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              {hasDiscount && (
                                <p className="text-xs text-gray-400 line-through">${((p as any).compareAtPrice / 12).toFixed(2)}/mo</p>
                              )}
                              <p className="text-sm font-bold text-[#5c21ff]">${(p.price / 12).toFixed(2)}/mo</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${item.productId}-${item.variantId ?? 'base'}`}
                          className="flex items-center gap-3 pb-3 border-b border-[#d5daf0] last:border-0"
                        >
                          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white border border-gray-200 overflow-hidden">
                            {imgSrc
                              ? <img src={imgSrc} alt={p.title} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-gray-100" />
                            }
                          </div>

                          <p className="flex-1 min-w-0 text-sm font-medium text-gray-800 truncate">
                            {p.title}{variant ? ` (${variant.name})` : ''}
                          </p>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleQty(item.productId, item.variantId, -1)}
                              disabled={item.quantity === 0}
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-[#5c21ff] hover:text-[#5c21ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease"
                            >
                              <FiMinus size={11} />
                            </button>
                            <span className="w-5 text-center text-sm font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQty(item.productId, item.variantId, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-[#5c21ff] hover:text-[#5c21ff] transition-colors"
                              aria-label="Increase"
                            >
                              <FiPlus size={11} />
                            </button>
                          </div>

                          <div className="text-right flex-shrink-0 min-w-[72px]">
                            {hasDiscount && (
                              <p className="text-xs text-gray-400 line-through">{fmt(lineCompare)}</p>
                            )}
                            <p className={`text-sm font-bold ${hasDiscount ? 'text-[#5c21ff]' : 'text-gray-900'}`}>
                              {fmt(linePrice)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3 pb-1">
              <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <FiTruck size={18} className="text-[#5c21ff]" />
              </div>
              <p className="flex-1 text-sm font-medium text-gray-800">Fast Shipping</p>
              <div className="text-right">
                <p className="text-xs text-gray-400 line-through">$5.99</p>
                <p className="text-sm font-bold text-green-600">FREE</p>
              </div>
            </div>
          </div>
        </div>


        <div className="p-6 flex flex-col gap-5">


          <div className="flex items-start gap-4">

            <div className="flex-shrink-0 relative w-[88px] h-[88px]">

              <div
                className="w-full h-full rounded-full bg-[#3d1bc7] flex flex-col items-center justify-center text-center select-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #5c21ff 60%, #3d1bc7 100%)',
                  boxShadow: '0 0 0 4px #eef1fb, 0 0 0 6px #3d1bc7',
                }}
              >
                <span className="text-[7px] font-semibold text-purple-200 tracking-widest uppercase block mt-1">Try worry-free</span>
                <span className="text-2xl font-extrabold text-white leading-none">100%</span>
                <span className="text-[7px] font-bold text-white tracking-wide uppercase leading-tight">Wyze</span>
                <span className="text-[6px] font-semibold text-purple-200 tracking-widest uppercase">satisfaction</span>
                <span className="text-[6px] font-semibold text-purple-200 tracking-widest uppercase">guarantee</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base leading-tight">30-day hassle-free returns</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                If you're not totally in love with the product, we will refund you 100%.
              </p>
            </div>
          </div>

          <hr className="border-[#d5daf0]" />

          <div className="flex items-end justify-between gap-4">

            <div>
              <span className="inline-block bg-[#5c21ff] text-white text-xs font-semibold rounded-full px-3 py-1.5">
                as low as ${monthly}/mo
              </span>
            </div>

            <div className="text-right">
              {savings > 0 && (
                <p className="text-sm text-gray-400 line-through">{fmt(compareAtTotal)}</p>
              )}
              <p className="text-3xl font-extrabold text-gray-900">{fmt(total)}</p>
            </div>
          </div>

          {savings > 0 && (
            <p className="text-sm font-semibold text-green-600 text-center -mt-1">
              Congrats! You're saving {fmt(savings)} on your security bundle!
            </p>
          )}

          <button
            className="w-full bg-[#5c21ff] hover:bg-[#4810de] active:scale-[0.98] transition-all duration-150 text-white font-bold rounded-xl py-4 text-base shadow-lg shadow-[#5c21ff33]"
            onClick={() => alert('Proceeding to checkout…')}
          >
            Checkout
          </button>

          <div className="text-center -mt-1">
            <button
              onClick={saveForLater}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-[#5c21ff] transition-colors"
            >
              Save my system for later
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
