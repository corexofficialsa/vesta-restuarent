import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES, CURRENCY, CATEGORY_META } from '../../data/menuData';

const EMPTY = { name: '', nameAr: '', category: CATEGORIES[0], price: '', description: '', descriptionAr: '', image: '' };

function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-900 text-center text-lg mb-1">Delete Item?</h3>
        <p className="text-gray-400 text-sm text-center mb-5">
          "<span className="font-medium text-gray-600">{item.name}</span>" will be removed from the menu on all devices.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors active:scale-95">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item, onDelete }) {
  const meta = CATEGORY_META[item.category] || { gradient: 'from-gray-100 to-gray-200', icon: '🍽️' };
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200">
      <div className={`relative h-32 bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
        {item.image && !imgErr ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-40">{meta.icon}</span>
          </div>
        )}
        {/* Delete button */}
        <button
          onClick={() => onDelete(item)}
          className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 active:scale-90 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-bold text-purple-700 uppercase tracking-wide">
          {item.category}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
            {item.nameAr && <p className="text-gray-400 text-xs truncate" dir="rtl">{item.nameAr}</p>}
          </div>
          <span className="text-purple-700 font-bold text-sm flex-shrink-0">{CURRENCY} {item.price}</span>
        </div>
        {item.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export default function MenuManager() {
  const { menu, addMenuItem, deleteMenuItem } = useRestaurant();
  const [tab, setTab] = useState('all');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [filterCat, setFilterCat] = useState('All');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Item name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addMenuItem(form);
    setSuccess(true);
    setForm(EMPTY);
    setTimeout(() => { setSuccess(false); setTab('all'); }, 1800);
  };

  const confirmDelete = () => {
    if (toDelete) { deleteMenuItem(toDelete.id); setToDelete(null); }
  };

  const displayedMenu = filterCat === 'All' ? menu : menu.filter(i => i.category === filterCat);

  return (
    <div>
      {toDelete && <DeleteConfirm item={toDelete} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">{menu.length} items · synced to all devices</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'all' ? 'bg-white text-purple-700 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Items ({menu.length})
          </button>
          <button
            onClick={() => setTab('add')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'add' ? 'bg-white text-purple-700 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            + Add New
          </button>
        </div>
      </div>

      {/* ALL ITEMS TAB */}
      {tab === 'all' && (
        <div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-5">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterCat === cat
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
                }`}
              >
                {cat === 'All' ? `All (${menu.length})` : `${cat} (${menu.filter(i => i.category === cat).length})`}
              </button>
            ))}
          </div>

          {displayedMenu.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center text-gray-400">
              <span className="text-5xl mb-3">🍽️</span>
              <p className="font-medium">No items yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayedMenu.map(item => (
                <MenuItemCard key={item.id} item={item} onDelete={setToDelete} />
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4 text-center">Hover over a card to reveal the delete button</p>
        </div>
      )}

      {/* ADD ITEM TAB */}
      {tab === 'add' && (
        <div className="max-w-2xl">
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl mb-5 animate-fade-in">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 text-sm font-medium">Item added and synced to all devices!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name EN */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Item Name (EN) *</label>
                <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Spanish Latte"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Name AR */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">اسم الصنف (AR)</label>
                <input type="text" value={form.nameAr} onChange={e => handleChange('nameAr', e.target.value)} placeholder="مثال: لاتيه إسباني"
                  dir="rtl"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Category *</label>
                <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Price (SR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">SR</span>
                  <input type="number" min="1" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="0"
                    className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Description EN */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Description (EN) *</label>
              <textarea rows={2} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Describe the item…"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Description AR */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">الوصف (AR)</label>
              <textarea rows={2} value={form.descriptionAr} onChange={e => handleChange('descriptionAr', e.target.value)} placeholder="اكتب وصف الصنف بالعربية…"
                dir="rtl"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Image URL</label>
              <input type="url" value={form.image} onChange={e => handleChange('image', e.target.value)} placeholder="https://…"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
              {form.image && (
                <div className="mt-2 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>

            <button type="submit"
              className="w-full py-3 rounded-xl bg-purple-700 text-white font-semibold text-sm hover:bg-purple-800 active:scale-95 transition-all duration-200 shadow-md shadow-purple-200 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add to Menu
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
