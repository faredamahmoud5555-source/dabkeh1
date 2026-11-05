"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { menuById } from "@/data/menu";
import { roundMoney } from "@/lib/currency";
import { readJSON, removeKey, storageKey, writeJSON } from "@/lib/storage";

/**
 * Cart state
 * ---------------------------------------------------------------------------
 * - The cart only stores `{ [itemId]: quantity }`. Names and prices are always
 *   looked up from data/menu.js, so a price change never leaves stale prices in
 *   a customer's saved cart, and removed dishes disappear automatically.
 * - Two contexts: one for state (changes often) and one for actions (stable
 *   identity). Components that only need actions do not re-render on every
 *   cart change.
 * - `hydrated` is false on the server and during the first client render, so
 *   server and client HTML match. Show loading placeholders until it is true.
 */

const CART_KEY = "cart";
const PENDING_KEY = "pending-order";
const MAX_QUANTITY = 50;
const PENDING_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const initialState = {
  hydrated: false,
  items: {},
  isOpen: false,
  pendingOrder: null,
};

/* ------------------------------ Storage ---------------------------------- */

function loadItems() {
  const raw = readJSON(CART_KEY, {});
  const items = {};
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [id, quantity] of Object.entries(raw)) {
      if (menuById.has(id) && Number.isInteger(quantity) && quantity > 0) {
        items[id] = Math.min(quantity, MAX_QUANTITY);
      }
    }
  }
  return items;
}

function loadPendingOrder() {
  const order = readJSON(PENDING_KEY, null);
  const valid =
    order &&
    typeof order.reference === "string" &&
    typeof order.whatsappUrl === "string" &&
    typeof order.createdAt === "number" &&
    Date.now() - order.createdAt < PENDING_MAX_AGE_MS;
  if (!valid && order) removeKey(PENDING_KEY);
  return valid ? order : null;
}

/* ------------------------------ Reducer ---------------------------------- */

function withQuantity(items, id, quantity) {
  const next = { ...items };
  const clamped = Math.min(Math.floor(quantity), MAX_QUANTITY);
  if (clamped > 0) next[id] = clamped;
  else delete next[id];
  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        hydrated: true,
        items: action.items,
        pendingOrder: action.pendingOrder,
        // A pending order is shown by the cart (page or drawer) as a "did you send it?" step.
        isOpen: false,
      };
    case "syncItems":
      return { ...state, items: action.items };
    case "syncPending":
      return { ...state, pendingOrder: action.pendingOrder };
    case "add":
      if (!menuById.has(action.id)) return state;
      return { ...state, items: withQuantity(state.items, action.id, (state.items[action.id] ?? 0) + 1) };
    case "decrement":
      if (!state.items[action.id]) return state;
      return { ...state, items: withQuantity(state.items, action.id, state.items[action.id] - 1) };
    case "remove":
      return { ...state, items: withQuantity(state.items, action.id, 0) };
    case "clear":
      return { ...state, items: {} };
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "setPending":
      return { ...state, pendingOrder: action.order };
    case "orderConfirmed":
      return { ...state, items: {}, pendingOrder: null };
    default:
      return state;
  }
}

/* ------------------------------ Contexts --------------------------------- */

const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { hydrated, items, isOpen, pendingOrder } = state;

  // 1. Load from localStorage once, after mount (never during render).
  useEffect(() => {
    dispatch({ type: "hydrate", items: loadItems(), pendingOrder: loadPendingOrder() });
  }, []);

  // 2. Persist the cart whenever it changes (only after hydration, so the empty
  //    initial state never overwrites a saved cart).
  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(items).length === 0) removeKey(CART_KEY);
    else writeJSON(CART_KEY, items);
  }, [hydrated, items]);

  // 3. Keep several open tabs in sync.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === storageKey(CART_KEY) || event.key === null) {
        dispatch({ type: "syncItems", items: loadItems() });
      }
      if (event.key === storageKey(PENDING_KEY) || event.key === null) {
        dispatch({ type: "syncPending", pendingOrder: loadPendingOrder() });
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Derived data, recalculated only when the cart changes. */
  const derived = useMemo(() => {
    const lines = [];
    let totalItems = 0;
    let total = 0;
    for (const [id, quantity] of Object.entries(items)) {
      const item = menuById.get(id);
      if (!item) continue;
      const subtotal = roundMoney(item.price * quantity);
      lines.push({ item, quantity, subtotal });
      totalItems += quantity;
      total += subtotal;
    }
    return { lines, totalItems, total: roundMoney(total) };
  }, [items]);

  const stateValue = useMemo(
    () => ({ hydrated, isOpen, pendingOrder, quantities: items, ...derived }),
    [hydrated, isOpen, pendingOrder, items, derived],
  );

  /* Actions: dispatch is stable, so these never change identity. */
  const actions = useMemo(
    () => ({
      addItem: (id) => dispatch({ type: "add", id }),
      decrementItem: (id) => dispatch({ type: "decrement", id }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      clearCart: () => dispatch({ type: "clear" }),
      openCart: () => dispatch({ type: "open" }),
      closeCart: () => dispatch({ type: "close" }),
      /** Save the order that was just handed to WhatsApp (survives page reloads). */
      startPendingOrder: (order) => {
        writeJSON(PENDING_KEY, order); // write now: the page may be left immediately
        dispatch({ type: "setPending", order });
      },
      /** Customer wants to change something: keep the cart, drop the pending order. */
      cancelPendingOrder: () => {
        removeKey(PENDING_KEY);
        dispatch({ type: "setPending", order: null });
      },
      /** Customer confirmed they sent the message: only now is the cart cleared. */
      confirmOrderSent: () => {
        removeKey(PENDING_KEY);
        removeKey(CART_KEY);
        dispatch({ type: "orderConfirmed" });
      },
    }),
    [],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={stateValue}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartStateContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>.");
  return value;
}

export function useCartActions() {
  const value = useContext(CartActionsContext);
  if (!value) throw new Error("useCartActions must be used inside <CartProvider>.");
  return value;
}
