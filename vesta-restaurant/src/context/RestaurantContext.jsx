import { createContext, useContext, useReducer, useEffect } from 'react';
import { ref, push, update, onValue } from 'firebase/database';
import { db } from '../firebase';
import { INITIAL_MENU } from '../data/menuData';

const savedAuth = localStorage.getItem('vesta_auth') === 'true';

const initialState = {
  menu: INITIAL_MENU,
  cart: {},
  orders: [],
  activeTable: null,
  view: savedAuth ? 'admin' : 'customer',
  isAuthenticated: savedAuth,
};

function reducer(state, action) {
  switch (action.type) {

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };

    case 'SELECT_TABLE':
      return { ...state, activeTable: action.payload };

    case 'ADD_TO_CART': {
      const { tableId, item } = action.payload;
      const tableCart = state.cart[tableId] || { items: [] };
      const existing = tableCart.items.find(i => i.id === item.id);
      const updatedItems = existing
        ? tableCart.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...tableCart.items, { ...item, qty: 1 }];
      return { ...state, cart: { ...state.cart, [tableId]: { items: updatedItems } } };
    }

    case 'REMOVE_FROM_CART': {
      const { tableId, itemId } = action.payload;
      const tableCart = state.cart[tableId] || { items: [] };
      return {
        ...state,
        cart: { ...state.cart, [tableId]: { items: tableCart.items.filter(i => i.id !== itemId) } },
      };
    }

    case 'UPDATE_QTY': {
      const { tableId, itemId, delta } = action.payload;
      const tableCart = state.cart[tableId] || { items: [] };
      const updatedItems = tableCart.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart: { ...state.cart, [tableId]: { items: updatedItems } } };
    }

    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'CLEAR_TABLE_CART': {
      const { tableId } = action.payload;
      return { ...state, cart: { ...state.cart, [tableId]: { items: [] } } };
    }

    case 'ADD_MENU_ITEM': {
      const newItem = { ...action.payload, id: action.payload.id || Date.now(), price: Number(action.payload.price) };
      return { ...state, menu: [...state.menu, newItem] };
    }

    default:
      return state;
  }
}

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Listen to Firebase orders in real-time ──
  useEffect(() => {
    const ordersRef = ref(db, 'vesta/orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { dispatch({ type: 'SET_ORDERS', payload: [] }); return; }
      const orders = Object.entries(data)
        .map(([firebaseKey, order]) => ({ ...order, firebaseKey }))
        .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
      dispatch({ type: 'SET_ORDERS', payload: orders });
    });
    return () => unsubscribe();
  }, []);

  const actions = {
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),

    login: (username, password) => {
      if (username === 'vesta_rest' && password === 'vesta3223') {
        localStorage.setItem('vesta_auth', 'true');
        dispatch({ type: 'SET_AUTH', payload: true });
        dispatch({ type: 'SET_VIEW', payload: 'admin' });
        return true;
      }
      return false;
    },

    logout: () => {
      localStorage.removeItem('vesta_auth');
      dispatch({ type: 'SET_AUTH', payload: false });
      dispatch({ type: 'SET_VIEW', payload: 'customer' });
    },

    selectTable: (id) => dispatch({ type: 'SELECT_TABLE', payload: id }),
    addToCart: (tableId, item) => dispatch({ type: 'ADD_TO_CART', payload: { tableId, item } }),
    removeFromCart: (tableId, itemId) => dispatch({ type: 'REMOVE_FROM_CART', payload: { tableId, itemId } }),
    updateQty: (tableId, itemId, delta) => dispatch({ type: 'UPDATE_QTY', payload: { tableId, itemId, delta } }),

    placeOrder: (tableId) => {
      const tableCart = state.cart[tableId] || { items: [] };
      if (!tableCart.items.length) return;
      const newOrder = {
        id: `ORD-${Date.now()}`,
        tableId,
        items: tableCart.items,
        status: 'Pending',
        placedAt: new Date().toISOString(),
      };
      push(ref(db, 'vesta/orders'), newOrder);
      dispatch({ type: 'CLEAR_TABLE_CART', payload: { tableId } });
    },

    advanceOrderStatus: (orderId, firebaseKey) => {
      const statusFlow = { Pending: 'Cooking', Cooking: 'Ready', Ready: 'Served' };
      const order = state.orders.find(o => o.id === orderId);
      if (!order || !firebaseKey) return;
      const nextStatus = statusFlow[order.status];
      if (!nextStatus) return;
      update(ref(db, `vesta/orders/${firebaseKey}`), { status: nextStatus });
    },

    addMenuItem: (item) => dispatch({ type: 'ADD_MENU_ITEM', payload: item }),
  };

  const getTableCart = (tableId) => state.cart[tableId] || { items: [] };
  const getCartCount = (tableId) => getTableCart(tableId).items.reduce((s, i) => s + i.qty, 0);
  const getCartTotal = (tableId) => getTableCart(tableId).items.reduce((s, i) => s + i.price * i.qty, 0);
  const getActiveOrders = (tableId) => state.orders.filter(o => o.tableId === tableId && o.status !== 'Served');
  const getTableStatus = (tableId) => {
    const hasActive = state.orders.some(o => o.tableId === tableId && o.status !== 'Served');
    const hasCart = (state.cart[tableId]?.items?.length || 0) > 0;
    return hasActive ? 'Active Order' : hasCart ? 'Cart Open' : 'Idle';
  };

  return (
    <RestaurantContext.Provider value={{
      ...state,
      ...actions,
      getTableCart,
      getCartCount,
      getCartTotal,
      getActiveOrders,
      getTableStatus,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
};
