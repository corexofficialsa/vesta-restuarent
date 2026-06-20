import { createContext, useContext, useReducer, useEffect } from 'react';
import { ref, push, update, onValue, set, remove, get } from 'firebase/database';
import { db } from '../firebase';
import { INITIAL_MENU } from '../data/menuData';

// Read URL table param synchronously — prevents the one-frame flash of login page
function getInitialTable() {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('table');
  if (t) {
    const id = parseInt(t, 10);
    if ([1, 2, 3, 4].includes(id)) return id;
  }
  return null;
}

const savedAuth = localStorage.getItem('vesta_auth') === 'true';

const initialState = {
  menu: INITIAL_MENU,
  cart: {},
  orders: [],
  activeTable: getInitialTable(),
  view: savedAuth ? 'admin' : 'customer',
  isAuthenticated: savedAuth,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':      return { ...state, view: action.payload };
    case 'SET_AUTH':      return { ...state, isAuthenticated: action.payload };
    case 'SELECT_TABLE':  return { ...state, activeTable: action.payload };
    case 'SET_MENU':      return { ...state, menu: action.payload };
    case 'SET_ORDERS':    return { ...state, orders: action.payload };

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
      return { ...state, cart: { ...state.cart, [tableId]: { items: tableCart.items.filter(i => i.id !== itemId) } } };
    }

    case 'UPDATE_QTY': {
      const { tableId, itemId, delta } = action.payload;
      const tableCart = state.cart[tableId] || { items: [] };
      const updatedItems = tableCart.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart: { ...state.cart, [tableId]: { items: updatedItems } } };
    }

    case 'CLEAR_TABLE_CART': {
      const { tableId } = action.payload;
      return { ...state, cart: { ...state.cart, [tableId]: { items: [] } } };
    }

    default:
      return state;
  }
}

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Sync menu from Firebase (shared across all devices) ──
  useEffect(() => {
    const menuRef = ref(db, 'vesta/menu');

    // Seed menu if Firebase is empty
    get(menuRef).then(snapshot => {
      if (!snapshot.exists()) {
        const seed = {};
        INITIAL_MENU.forEach(item => { seed[item.id] = item; });
        set(menuRef, seed);
      }
    });

    const unsubMenu = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const menu = Object.values(data).sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        dispatch({ type: 'SET_MENU', payload: menu });
      }
    });

    return () => unsubMenu();
  }, []);

  // ── Sync orders from Firebase in real-time ──
  useEffect(() => {
    const ordersRef = ref(db, 'vesta/orders');
    const unsubOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { dispatch({ type: 'SET_ORDERS', payload: [] }); return; }
      const orders = Object.entries(data)
        .map(([firebaseKey, order]) => ({ ...order, firebaseKey }))
        .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
      dispatch({ type: 'SET_ORDERS', payload: orders });
    });
    return () => unsubOrders();
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

    // Writes to Firebase — all devices see the new item instantly
    addMenuItem: (item) => {
      const id = Date.now();
      const newItem = { ...item, id, price: Number(item.price) };
      set(ref(db, `vesta/menu/${id}`), newItem);
    },

    // Removes from Firebase — disappears from all devices instantly
    deleteMenuItem: (itemId) => {
      remove(ref(db, `vesta/menu/${itemId}`));
    },
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
