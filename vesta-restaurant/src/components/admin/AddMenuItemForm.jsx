import { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CATEGORIES } from '../../data/menuData';

const EMPTY = { name: '', category: CATEGORIES[0], price: '', description: '', image: '' };

export default function AddMenuItemForm() {
  const { addMenuItem, menu } = useRestaurant();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [imgPreview, setImgPreview] = useState('');

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
    if (field === 'image') setImgPreview(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addMenuItem(form);
    setSuccess(true);
    setForm(EMPTY);
    setImgPreview('');
    setTimeout(() => setSuccess(false), 2500);
  };

  const newItems = menu.filter(i => i.id > 10);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Add Menu Item</h2>
        <p className="text-gray-400 text-sm mt-0.5">New items appear on the customer menu instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 text-sm font-medium">Item added to menu successfully!</p>
            </div>
          )}

          {/* Name + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Item Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Chole Bhature"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all
                  ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Price (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                placeholder="0"
                className={`w-full pl-7 pr-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all
                  ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Description *
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe the dish — ingredients, flavour profile…"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all
                ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={e => handleChange('image', e.target.value)}
              placeholder="https://…"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-700 text-white font-semibold text-sm
              hover:bg-purple-800 active:scale-95 transition-all duration-200 shadow-md shadow-purple-200
              flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add to Menu
          </button>
        </form>

        {/* Preview + recently added */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview</p>
            </div>
            <div className="h-36 bg-gradient-to-br from-purple-50 to-gray-100 mx-4 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
              {imgPreview ? (
                <img src={imgPreview} alt="preview" className="w-full h-full object-cover" onError={() => setImgPreview('')} />
              ) : (
                <span className="text-gray-300 text-3xl">🖼️</span>
              )}
            </div>
            {form.name && (
              <div className="px-4 pb-4">
                <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                {form.price && <p className="text-purple-700 font-bold text-sm">₹{form.price}</p>}
                {form.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{form.description}</p>}
              </div>
            )}
          </div>

          {/* Recently added items */}
          {newItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recently Added</p>
              <div className="space-y-2">
                {newItems.slice(-5).reverse().map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-purple-50 rounded-xl animate-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <span className="text-sm">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-purple-600">₹{item.price}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-md border border-gray-100">
                      {item.category.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu count */}
          <div className="bg-purple-700 rounded-2xl p-4 text-center text-white">
            <div className="text-3xl font-bold">{menu.length}</div>
            <div className="text-purple-200 text-sm">items on menu</div>
          </div>
        </div>
      </div>
    </div>
  );
}
