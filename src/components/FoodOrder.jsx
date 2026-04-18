import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../context/AppContext';

const MENU_CATEGORIES = [
  {
    id: 'snacks',
    label: 'Snacks',
    icon: '🍿',
    items: [
      { id: 'popcorn',    name: 'Stadium Popcorn',  price: 120, emoji: '🍿', time: '5 min',  desc: 'Butter & salt blend' },
      { id: 'nachos',     name: 'Loaded Nachos',    price: 180, emoji: '🧀', time: '8 min',  desc: 'With cheese dip' },
      { id: 'samosa',     name: 'Crispy Samosa',    price: 60,  emoji: '🔺', time: '4 min',  desc: '2 pcs with chutney' },
      { id: 'peanuts',    name: 'Roasted Peanuts',  price: 50,  emoji: '🥜', time: '2 min',  desc: 'Classic stadium snack' },
    ],
  },
  {
    id: 'mains',
    label: 'Mains',
    icon: '🍔',
    items: [
      { id: 'burger',     name: 'Veg Burger',       price: 180, emoji: '🍔', time: '12 min', desc: 'Crispy patty & sauce' },
      { id: 'pizza',      name: 'Mini Pizza',        price: 220, emoji: '🍕', time: '15 min', desc: 'Cheese & veggies' },
      { id: 'wrap',       name: 'Chicken Wrap',      price: 200, emoji: '🌯', time: '10 min', desc: 'Grilled with mint sauce' },
      { id: 'fries',      name: 'French Fries',      price: 100, emoji: '🍟', time: '7 min',  desc: 'Crispy & salted' },
    ],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    icon: '🥤',
    items: [
      { id: 'cola',       name: 'Cold Drink',        price: 60,  emoji: '🥤', time: '2 min',  desc: '500ml chilled' },
      { id: 'water',      name: 'Water Bottle',       price: 20,  emoji: '💧', time: '1 min',  desc: '1L sealed' },
      { id: 'lemonade',   name: 'Fresh Lemonade',     price: 80,  emoji: '🍋', time: '5 min',  desc: 'With mint' },
      { id: 'coffee',     name: 'Hot Coffee',         price: 90,  emoji: '☕', time: '6 min',  desc: 'Filter blend' },
    ],
  },
];

const STATUS_CONFIG = {
  preparing:  { label: 'Preparing',  color: '#f59e0b', icon: '⏳', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  ready:      { label: 'Ready! 🎉',  color: '#22c55e', icon: '✅', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  collected:  { label: 'Collected',  color: '#64748b', icon: '📦', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
};

function FoodItemCard({ item, qty, onAdd, onRemove }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-white/5 group transition-all"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="text-2xl flex-shrink-0">{item.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white truncate">{item.name}</div>
        <div className="text-[10px] text-slate-500">{item.desc} · {item.time}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-xs font-bold text-cyan-400">₹{item.price}</div>
        {qty === 0 ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)' }}
          >+</motion.button>
        ) : (
          <div className="flex items-center gap-1.5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onRemove}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>−</motion.button>
            <span className="text-xs font-bold text-white w-3 text-center">{qty}</span>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onAdd}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)' }}>+</motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActiveOrder({ order, onCollect }) {
  const status = STATUS_CONFIG[order.status];
  const total  = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl p-3 border"
      style={{ background: status.bg, borderColor: status.border }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{status.icon}</span>
          <span className="text-xs font-bold" style={{ color: status.color }}>{status.label}</span>
          <span className="text-[10px] text-slate-500">#{order.id}</span>
        </div>
        <span className="text-xs font-bold text-white">₹{total}</span>
      </div>

      {/* Items horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mb-2">
        {order.items.map((i) => (
          <div key={i.id} className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
            <span>{i.emoji}</span>
            <span>{i.qty}× {i.name}</span>
          </div>
        ))}
      </div>

      {order.status === 'preparing' && (
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Preparing at: <span className="text-white font-medium">{order.stall}</span></span>
            <span>~{order.eta} min</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: '5%' }}
              animate={{ width: `${order.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {order.status === 'ready' && (
        <div>
          <div className="text-[10px] text-emerald-400 mb-2 font-medium">
            🚶 Go to <strong>{order.stall}</strong> to collect your order!
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCollect(order.id)}
            className="w-full py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.4)' }}
          >
            Mark as Collected ✓
          </motion.button>
        </div>
      )}

      {order.status === 'collected' && (
        <div className="text-[10px] text-slate-500">Enjoy your food! 🎉</div>
      )}
    </motion.div>
  );
}

export default function FoodOrder() {
  const [activeCategory, setActiveCategory] = useState('snacks');
  const [cart, setCart]   = useState({});
  const [orders, setOrders] = useState([]);
  const [placing, setPlacing] = useState(false);
  const seatPreference = useAppStore((s) => s.seatPreference);
  const bookingHistory = useAppStore((s) => s.bookingHistory);
  const userSeat = bookingHistory[0]?.seat || seatPreference?.seat || '—';

  const allItems = MENU_CATEGORIES.flatMap((c) => c.items);
  const cartItems = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...allItems.find((i) => i.id === id), qty }));
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const addItem    = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  const STALLS = ['Pizza Hub Counter A', 'Snack Corner B', 'Burger Zone C', 'Drinks Bar D'];

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    const stall = STALLS[Math.floor(Math.random() * STALLS.length)];
    const eta   = Math.floor(Math.random() * 8) + 5; // 5-12 min
    const newOrder = {
      id:       Date.now().toString().slice(-5),
      items:    cartItems,
      stall,
      eta,
      progress: 10,
      status:   'preparing',
    };

    setTimeout(() => {
      setOrders((prev) => [newOrder, ...prev]);
      setCart({});
      setPlacing(false);

      // Simulate progress
      let p = 10;
      const timer = setInterval(() => {
        p += Math.floor(Math.random() * 20) + 8;
        if (p >= 100) {
          clearInterval(timer);
          setOrders((prev) =>
            prev.map((o) => o.id === newOrder.id ? { ...o, status: 'ready', progress: 100 } : o)
          );
        } else {
          setOrders((prev) =>
            prev.map((o) => o.id === newOrder.id ? { ...o, progress: p } : o)
          );
        }
      }, 2500);
    }, 800);
  };

  const collectOrder = (id) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'collected' } : o));
  };

  const activeOrders = orders.filter((o) => o.status !== 'collected');
  const pastOrders   = orders.filter((o) => o.status === 'collected');
  const category     = MENU_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🍽️</span>
        <h3 className="text-sm font-bold text-white">Order Food</h3>
        <span className="ml-auto text-[10px] text-slate-400">
          Seat <span className="text-cyan-400 font-medium">{userSeat}</span>
        </span>
      </div>

      {/* Active orders */}
      <AnimatePresence>
        {activeOrders.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active Orders</div>
            {activeOrders.map((o) => (
              <ActiveOrder key={o.id} order={o} onCollect={collectOrder} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1.5 mb-3">
        {MENU_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeCategory === c.id ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeCategory === c.id ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: activeCategory === c.id ? '#00d4ff' : '#94a3b8',
            }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="space-y-2 mb-3">
        {category?.items.map((item) => (
          <FoodItemCard
            key={item.id}
            item={item}
            qty={cart[item.id] || 0}
            onAdd={() => addItem(item.id)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {/* Cart summary */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl p-3 mb-3 border border-cyan-500/20"
            style={{ background: 'rgba(0,212,255,0.06)' }}
          >
            <div className="text-[10px] text-slate-400 mb-1.5">Your Cart ({cartCount} items)</div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 mb-2">
              {cartItems.map((i) => (
                <div key={i.id} className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  {i.emoji} {i.qty}×
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Total</span>
              <span className="font-orbitron font-bold text-sm text-cyan-400">₹{cartTotal}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: cartCount > 0 ? 1.02 : 1 }}
        whileTap={{ scale: cartCount > 0 ? 0.97 : 1 }}
        onClick={placeOrder}
        disabled={cartCount === 0 || placing}
        className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all"
        style={{
          background: cartCount > 0
            ? 'linear-gradient(135deg, #00d4ff, #8b5cf6)'
            : 'rgba(255,255,255,0.05)',
          color: cartCount > 0 ? '#fff' : '#475569',
          cursor: cartCount > 0 ? 'pointer' : 'not-allowed',
          boxShadow: cartCount > 0 ? '0 6px 20px rgba(0,212,255,0.25)' : 'none',
        }}
      >
        {placing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            Placing Order...
          </span>
        ) : cartCount > 0
          ? `🛒 Place Order · ₹${cartTotal}`
          : 'Add items to order'}
      </motion.button>

      {pastOrders.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="text-[10px] text-slate-600 mb-1">Past orders: {pastOrders.length}</div>
        </div>
      )}
    </div>
  );
}
