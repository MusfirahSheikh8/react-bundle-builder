import React, { createContext, useContext, useReducer } from 'react';
import data from '../data/products.json';

type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type State = {
  cart: CartItem[];
  activeStep: number;
};

type Action = 
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId?: string; delta: number } }
  | { type: 'SET_ACTIVE_STEP'; payload: number }
  | { type: 'SET_CART'; payload: CartItem[] };

const initialState: State = {
  cart: [],
  activeStep: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_ACTIVE_STEP':
      return { ...state, activeStep: action.payload };
    case 'UPDATE_QUANTITY': {
      const { productId, variantId, delta } = action.payload;
      const existingIdx = state.cart.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );
      
      let newCart = [...state.cart];
      if (existingIdx >= 0) {
        const newQty = Math.max(0, newCart[existingIdx].quantity + delta);
        if (newQty === 0) {
          newCart.splice(existingIdx, 1);
        } else {
          newCart[existingIdx] = { ...newCart[existingIdx], quantity: newQty };
        }
      } else if (delta > 0) {
        newCart.push({ productId, variantId, quantity: delta });
      }
      return { ...state, cart: newCart };
    }
    default:
      return state;
  }
}

type BuilderContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  saveForLater: () => void;
  products: typeof data.products;
  categories: typeof data.categories;
  getCartQuantity: (productId: string, variantId?: string) => number;
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('builderCart');
    return { ...init, cart: saved ? JSON.parse(saved) : data.initialState };
  });

  const getCartQuantity = (productId: string, variantId?: string) => {
    const item = state.cart.find((c: CartItem) => c.productId === productId && c.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const saveForLater = () => {
    localStorage.setItem('builderCart', JSON.stringify(state.cart));
    alert('System saved for later!');
  };

  return (
    <BuilderContext.Provider value={{
      state,
      dispatch,
      saveForLater,
      products: data.products,
      categories: data.categories,
      getCartQuantity
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
