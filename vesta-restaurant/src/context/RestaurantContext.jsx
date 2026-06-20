import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { INITIAL_MENU } from '../data/menuData';

const initialState = {
  menu: INITIAL_MENU,
  cart: {},
  orders: [],
  activeTable: null,
  view: 'customer',
  isAuthenticated: false,
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

    case 'PLACE_ORDER': {
      const { tableId, order } = action.payload;
      // If the order object is pre-built (coming from another tab), use it directly
      if (order) {
        return {
          ...state,
          orders: [order, ...state.orders],
          cart: { ...state.cart, [tableId]: { items: [] } },
        };
      }
      const tableCart = state.cart[tableId] || { items: [] };
      if (!tableCart.items.length) return state;
      const newOrder = {
        id: `ORD-${Date.now()}`,
        tableId,
        items: tableCart.items,
        status: 'Pending',
        placedAt: new Date().toISOString(),
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: { ...state.cart, [tableId]: { items: [] } },
        _lastOrder: newOrder,
      };
    }

    case 'ADVANCE_ORDER_STATUS': {
      const { orderId } = action.payload;
      const statusFlow = { Pending: 'Cooking', Cooking: 'Ready', Ready: 'Served' };
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === orderId ? { ...o, status: statusFlow[o.status] || o.status } : o
        ),
      };
    }

    case 'ADD_MENU_ITEM': {
      const newItem = { ...action.payload, id: action.payload.id || Date.now(), price: Number(action.payload.price) };
      return { ...state, menu: [...state.menu, newItem] };
    }

    case 'SYNC_ORDERS': {
      // Merge incoming orders from another tab — avoid duplicates by id
      const existingIds = new Set(state.orders.map(o => o.id));
      const newOrders = action.payload.filter(o => !existingIds.has(o.id));
      return { ...state, orders: [...newOrders, ...state.orders] };
    }

    default:
      return state;
  }
}

const RestaurantContext = createContext(null);
const CHANNEL_NAME = 'vesta_kitchen_sync';

export function RestaurantProvider({ children }) {
  const [state, rawDispatch] = useReducer(reducer, initialState);
  const channelRef = useRef(null);
  const fromChannelRef = useRef(false);

  // Wrapped dispatch — broadcasts cross-tab actions automatically
  const dispatch = useCallback((action) => {
    rawDispatch(action);
    if (!fromChannelRef.current && channelRef.current) {
      const syncTypes = ['PLACE_ORDER', 'ADVANCE_ORDER_STATUS', 'ADD_MENU_ITEM'];
      if (syncTypes.includes(action.type)) {
        channelRef.current.postMessage(action);
      }
    }
  }, []);

  // Setup BroadcastChannel for real cross-tab sync
  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current.onmessage = (e) => {
      fromChannelRef.current = true;
      rawDispatch(e.data);
      fromChannelRef.current = false;
    };
    return () => channelRef.current?.close();
  }, []);

  const actions = {
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    login: (username, password) => {
      if (username === 'vesta_rest' && password === 'vesta3223') {
        dispatch({ type: 'SET_AUTH', payload: true });
        dispatch({ type: 'SET_VIEW', payload: 'admin' });
        return true;
      }
      return false;
    },
    logout: () => {
      dispatch({ type: 'SET_AUTH', payload: false });
      dispatch({ type: 'SET_VIEW', payload: 'customer' });
    },
    selectTable: (id) => dispatch({ type: 'SELECT_TABLE', payload: id }),
    addToCart: (tableId, item) => dispatch({ type: 'ADD_TO_CART', payload: { tableId, item } }),
    removeFromCart: (tableId, itemId) => dispatch({ type: 'REMOVE_FROM_CART', payload: { tableId, itemId } }),
    updateQty: (tableId, itemId, delta) => dispatch({ type: 'UPDATE_QTY', payload: { tableId, itemId, delta } }),
    placeOrder: (tableId) => dispatch({ type: 'PLACE_ORDER', payload: { tableId } }),
    advanceOrderStatus: (orderId) => dispatch({ type: 'ADVANCE_ORDER_STATUS', payload: { orderId } }),
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
