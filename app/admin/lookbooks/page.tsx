'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit3, CheckCircle2, Upload, ImageIcon, Sparkles, PackageCheck, Search, Filter, Check, X } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminMixMatchPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);

  // Product Picker Modal State (Popup search & filter to pick products)
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    image: '',
    items: [] as any[]
  });

  const [toastMsg, setToastMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchApi('/mix-match'),
      fetchApi('/products'),
      fetchApi('/categories')
    ])
      .then(([comboRes, prodRes, catRes]) => {
        setCombos(comboRes.combos || []);
        setAvailableProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingCombo(null);
    setFormData({
      title: '',
      code: `COMBO-MM${combos.length + 1}`,
      image: availableProducts[0]?.colors?.[0]?.mainImage || '/products/korean_voile_top.jpg',
      items: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (combo: any) => {
    setEditingCombo(combo);
    setFormData({
      title: combo.title || '',
      code: combo.code || '',
      image: combo.image || '',
      items: combo.items || []
    });
    setIsModalOpen(true);
  };

  // Add selected product from Picker Modal into Mix & Match set
  const handleAttachProductToCombo = (product: any) => {
    // Check if already added
    const alreadyAdded = formData.items.some((it) => it.productId === product._id);
    if (alreadyAdded) {
      alert(`Sản phẩm "${product.name}" đã có trong bộ Mix & Match!`);
      return;
    }

    const newItem = {
      productId: product._id,
      name: product.name,
      code: product.code,
      price: product.salePrice || product.price,
      image: product.colors?.[0]?.mainImage || product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
      sizes: product.sizes || ['S', 'M', 'L'],
      colors: (product.colors || []).map((c: any) => ({ name: c.colorName, hex: c.hex }))
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    showToast(`Đã đính kèm: ${product.name}`);
  };

  // Image Upload File Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const res = await fetchApi('/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image, fileName: file.name })
        });
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, image: res.url }));
          showToast('Tải ảnh bìa thành công!');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Lỗi tải ảnh: ' + err.message);
      setUploading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert('Vui lòng nhập tên bộ Mix & Match và chọn ảnh bìa!');
      return;
    }

    if (formData.items.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm cho bộ Mix & Match!');
      return;
    }

    try {
      if (editingCombo) {
        await fetchApi(`/mix-match/${editingCombo._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast('Đã cập nhật bộ Mix & Match!');
      } else {
        await fetchApi('/mix-match', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast('Đã thêm bộ Mix & Match mới!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert('Lỗi lưu Mix & Match: ' + err.message);
    }
  };

  const handleDeleteCombo = async (comboId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ Mix & Match này?')) return;
    try {
      await fetchApi(`/mix-match/${comboId}`, {
        method: 'DELETE'
      });
      showToast('Đã xóa thành công!');
      loadData();
    } catch (err: any) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  // Filter products for the picker modal
  const filteredPickerProducts = availableProducts.filter((p) => {
    const matchCat = pickerCategory ? p.category === pickerCategory : true;
    const matchSearch = pickerSearch
      ? p.name.toLowerCase().includes(pickerSearch.toLowerCase()) || (p.code && p.code.toLowerCase().includes(pickerSearch.toLowerCase()))
      : true;
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#C21A27] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-black animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#EDE8E2] pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Quản Lý Bộ Phối Đồ (Mix & Match)</h1>
          <p className="text-xs text-black/60 font-semibold mt-1">
            Tìm kiếm & chọn các sản phẩm có sẵn trong kho để tạo set trang phục phối sẵn
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 glow-red w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Thêm Bộ Mix & Match Mới
        </button>
      </div>

      {/* Combos Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-[#EDE8E2]/60 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : combos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {combos.map((c) => {
            const totalPrice = c.items ? c.items.reduce((s: number, it: any) => s + (it.price || 0), 0) : 0;

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl border-2 border-[#EDE8E2] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo Preview */}
                <div className="relative aspect-[3/4] w-full bg-[#EDE8E2] overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-black/80 text-white text-[10px] font-black rounded-full shadow">
                    {c.items ? `${c.items.length} Sản phẩm` : 'Combo Set'}
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-black line-clamp-1">{c.title}</h3>
                    <p className="text-xs font-black text-[#C21A27] mt-1">
                      Tổng set: {totalPrice.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EDE8E2] flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="px-3 py-1.5 bg-[#EDE8E2] hover:bg-black hover:text-white text-black text-xs font-black rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa
                    </button>

                    <button
                      onClick={() => handleDeleteCombo(c._id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-[#C21A27] hover:text-white text-[#C21A27] text-xs font-black rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#EDE8E2] space-y-4">
          <Layers className="w-12 h-12 text-black/30 mx-auto" />
          <h3 className="text-base font-black text-black">Chưa có bộ Mix & Match nào</h3>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow"
          >
            + Tạo Bộ Mix & Match Mới
          </button>
        </div>
      )}

      {/* CREATE / EDIT MIX MATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#C21A27] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wider">
                  {editingCombo ? 'Chỉnh Sửa Bộ Mix & Match' : 'Tạo Bộ Mix & Match Mới'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white font-black text-lg p-1">
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-black text-black mb-1">Tên Bộ Mix & Match *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Combo Mix & Match Streetwear 01..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#C21A27]"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-black">Ảnh Trình Diễn Bộ Phối Trang Phục *</label>
                
                <div className="border-2 border-dashed border-[#C21A27] rounded-2xl p-4 text-center bg-[#EDE8E2]/30 hover:bg-[#EDE8E2]/60 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 text-[#C21A27] mx-auto animate-bounce" />
                    <p className="text-xs font-black text-black">
                      {uploading ? 'Đang tải ảnh lên...' : 'Bấm vào đây để chọn ảnh chụp bộ phối từ thiết bị'}
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Hoặc dán URL hình ảnh..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#EDE8E2] text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#C21A27]"
                />

                {formData.image && (
                  <div className="h-32 w-full rounded-2xl overflow-hidden border-2 border-[#EDE8E2] mt-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* ATTACHED PRODUCTS IN THIS SET WITH OPEN PICKER BUTTON */}
              <div className="pt-2 border-t border-[#EDE8E2] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#C21A27]" /> Sản Phẩm Đã Chọn ({formData.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsProductPickerOpen(true)}
                    className="px-3 py-1.5 bg-[#C21A27] text-white rounded-xl text-xs font-black shadow hover:bg-[#a5131f] transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Chọn Từ Kho Hàng
                  </button>
                </div>

                {formData.items.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {formData.items.map((it, iIdx) => (
                      <div key={iIdx} className="p-3 bg-[#EDE8E2]/40 rounded-2xl border-2 border-[#EDE8E2] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={it.image} alt={it.name} className="w-12 h-14 object-cover rounded-xl border border-[#EDE8E2] shrink-0" />
                          <div className="overflow-hidden text-xs">
                            <p className="font-black text-black truncate">{it.name}</p>
                            <p className="font-black text-[#C21A27] mt-0.5">{it.price ? `${it.price.toLocaleString('vi-VN')}đ` : '0đ'}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            items: formData.items.filter((_, idx) => idx !== iIdx)
                          })}
                          className="px-2.5 py-1 bg-rose-50 text-[#C21A27] text-xs font-black rounded-lg hover:bg-[#C21A27] hover:text-white transition-colors shrink-0"
                        >
                          Gỡ bỏ
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-[#EDE8E2] rounded-2xl space-y-2 bg-[#EDE8E2]/20">
                    <p className="text-xs text-black/60 font-bold">Chưa chọn sản phẩm nào cho bộ Mix & Match này</p>
                    <button
                      type="button"
                      onClick={() => setIsProductPickerOpen(true)}
                      className="px-4 py-2 bg-[#C21A27] text-white text-xs font-black rounded-xl shadow"
                    >
                      + Bấm Vào Đây Để Chọn Sản Phẩm
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#EDE8E2] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#EDE8E2] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#a5131f] transition-all glow-red"
                >
                  {editingCombo ? 'Lưu Cập Nhật' : 'Tạo Bộ Mix & Match'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* POPUP PRODUCT PICKER MODAL (WITH SEARCH & CATEGORY FILTER) */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95 max-h-[85vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#C21A27]" />
                <h3 className="text-base font-black uppercase tracking-wider">
                  Chọn Sản Phẩm Đính Kèm Vô Set Combo
                </h3>
              </div>
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="text-white/80 hover:text-white font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="p-4 bg-[#EDE8E2]/50 border-b border-[#EDE8E2] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm tên sản phẩm hoặc mã SKU..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border-2 border-[#EDE8E2] text-black font-medium focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-black/40 absolute left-3 top-2.5" />
                </div>

                {/* Category Dropdown Filter */}
                <div className="relative">
                  <select
                    value={pickerCategory}
                    onChange={(e) => setPickerCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-black text-black rounded-xl border-2 border-[#EDE8E2] bg-white focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                  >
                    <option value="">Tất cả danh mục sản phẩm</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* PRODUCT CATALOG GRID LIST */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[50vh]">
              {filteredPickerProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredPickerProducts.map((prod) => {
                    const isAdded = formData.items.some((it) => it.productId === prod._id);

                    return (
                      <div
                        key={prod._id}
                        className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                          isAdded ? 'border-emerald-600 bg-emerald-50/50' : 'border-[#EDE8E2] bg-white hover:border-[#C21A27]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={prod.colors?.[0]?.mainImage || prod.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            className="w-14 h-16 object-cover rounded-xl border border-[#EDE8E2] shrink-0"
                          />
                          <div className="overflow-hidden text-xs">
                            <span className="text-[10px] text-black/50 font-extrabold uppercase">SKU: {prod.code}</span>
                            <h4 className="font-black text-black truncate leading-snug">{prod.name}</h4>
                            <p className="font-black text-[#C21A27] mt-0.5">
                              {(prod.salePrice || prod.price).toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAttachProductToCombo(prod)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-black text-white hover:bg-[#C21A27]'
                          }`}
                        >
                          {isAdded ? <><Check className="w-3.5 h-3.5 stroke-[3px]" /> Đã chọn</> : <><Plus className="w-3.5 h-3.5 stroke-[3px]" /> Chọn</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-black/60 font-bold space-y-2">
                  <Filter className="w-8 h-8 text-black/30 mx-auto" />
                  <p>Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#EDE8E2]/50 border-t border-[#EDE8E2] flex items-center justify-between">
              <span className="text-xs font-bold text-black/70">
                Đã đính kèm: <span className="text-[#C21A27] font-black">{formData.items.length} sản phẩm</span>
              </span>

              <button
                type="button"
                onClick={() => setIsProductPickerOpen(false)}
                className="px-6 py-2.5 bg-[#C21A27] text-white text-xs font-black rounded-xl shadow"
              >
                Xong (Đóng bảng chọn)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
