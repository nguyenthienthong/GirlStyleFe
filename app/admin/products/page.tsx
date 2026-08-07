'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Layers, Sparkles, Upload, CheckCircle2, Search, Filter, X, Eye, Palette, Check, PackageCheck } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import Link from 'next/link';

// Quick Preset Color Swatches for 1-click selection
const PRESET_COLORS = [
  { hex: '#C21A27', name: 'Đỏ Đô Brand' },
  { hex: '#000000', name: 'Đen Huyền' },
  { hex: '#FFFFFF', name: 'Trắng Kem' },
  { hex: '#EDE8E2', name: 'Beige Sữa' },
  { hex: '#F48FB1', name: 'Hồng Pastel' },
  { hex: '#1C2841', name: 'Xanh Navy' },
  { hex: '#2E7D32', name: 'Xanh Lục' },
  { hex: '#D4AF37', name: 'Vàng Hoàng Gia' }
];

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Váy / Đầm',
    price: 490000,
    salePrice: 390000,
    occasion: 'Đi tiệc',
    material: 'Lụa tơ tằm cao cấp',
    description: '',
    isAiGenerated: false,
    colors: [
      {
        hex: '#C21A27',
        colorName: 'Đỏ Đô Brand',
        sizes: ['S', 'M', 'L', 'XL'],
        sizeStocks: { 'S': 15, 'M': 20, 'L': 2, 'XL': 10 },
        mainImage: '/products/silk_cocktail_dress.jpg',
        images: ['/products/silk_cocktail_dress.jpg']
      }
    ]
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchApi('/products'),
      fetchApi('/categories')
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.products || []);
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
    setEditingProduct(null);
    setForm({
      name: '',
      code: `GS-P${products.length + 1}`,
      category: categories[0]?.name || 'Váy / Đầm',
      price: 550000,
      salePrice: 450000,
      occasion: 'Đi tiệc',
      material: 'Lụa tơ tằm cao cấp, mềm mịn không nhăn',
      description: 'Thiết kế thời trang tôn dáng trẻ trung sang trọng.',
      isAiGenerated: false,
      colors: [
        {
          hex: '#C21A27',
          colorName: 'Đỏ Đô Brand',
          sizes: ['S', 'M', 'L', 'XL'],
          sizeStocks: { 'S': 15, 'M': 20, 'L': 2, 'XL': 10 },
          mainImage: '/products/silk_cocktail_dress.jpg',
          images: ['/products/silk_cocktail_dress.jpg']
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);

    const colorsList = (prod.colors && prod.colors.length > 0) ? prod.colors : [
      {
        hex: '#C21A27',
        colorName: 'Đỏ Đô Brand',
        sizes: prod.sizes || ['S', 'M', 'L', 'XL'],
        sizeStocks: { 'S': 15, 'M': 20, 'L': 2, 'XL': 10 },
        mainImage: prod.image || '/products/silk_cocktail_dress.jpg',
        images: [prod.image || '/products/silk_cocktail_dress.jpg']
      }
    ];

    setForm({
      name: prod.name || '',
      code: prod.code || '',
      category: prod.category || 'Váy / Đầm',
      price: prod.price || 0,
      salePrice: prod.salePrice || 0,
      occasion: prod.occasion || 'Đi tiệc',
      material: prod.material || '',
      description: prod.description || '',
      isAiGenerated: prod.isAiGenerated || false,
      colors: colorsList.map((c: any) => {
        // Convert inventory or sizeStocks to dictionary object
        const stocksMap: Record<string, number> = {};
        if (c.sizeStocks && Array.isArray(c.sizeStocks)) {
          c.sizeStocks.forEach((st: any) => {
            stocksMap[st.size] = st.stock;
          });
        } else if (c.sizeStocks && typeof c.sizeStocks === 'object') {
          Object.assign(stocksMap, c.sizeStocks);
        } else if (prod.inventory && Array.isArray(prod.inventory)) {
          prod.inventory.filter((inv: any) => inv.colorName === c.colorName || inv.hex === c.hex).forEach((inv: any) => {
            stocksMap[inv.size] = inv.stock;
          });
        }

        const sizeArray = (c.sizes && c.sizes.length > 0) ? c.sizes : (prod.sizes || ['S', 'M', 'L', 'XL']);
        sizeArray.forEach((s: string) => {
          if (stocksMap[s] === undefined) stocksMap[s] = 10;
        });

        return {
          hex: c.hex || '#C21A27',
          colorName: c.colorName || PRESET_COLORS.find(p => p.hex.toLowerCase() === (c.hex || '').toLowerCase())?.name || 'Màu sắc',
          sizes: sizeArray,
          sizeStocks: stocksMap,
          mainImage: c.mainImage || c.images?.[0] || '/products/silk_cocktail_dress.jpg',
          images: (c.images && c.images.length > 0) ? c.images : [c.mainImage || '/products/silk_cocktail_dress.jpg']
        };
      })
    });
    setIsModalOpen(true);
  };

  // Add new color swatch variant
  const handleAddColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          hex: '#000000',
          colorName: 'Đen Huyền',
          sizes: ['S', 'M', 'L', 'XL'],
          sizeStocks: { 'S': 10, 'M': 15, 'L': 5, 'XL': 10 },
          mainImage: '/products/silk_cocktail_dress.jpg',
          images: ['/products/silk_cocktail_dress.jpg']
        }
      ]
    }));
  };

  const handleRemoveColor = (index: number) => {
    if (form.colors.length <= 1) {
      alert('Sản phẩm cần tối thiểu 1 ô màu sắc!');
      return;
    }
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleColorHexChange = (index: number, newHex: string) => {
    const matchedPreset = PRESET_COLORS.find(p => p.hex.toLowerCase() === newHex.toLowerCase());
    const derivedName = matchedPreset ? matchedPreset.name : `Màu ${newHex.toUpperCase()}`;

    setForm((prev) => {
      const updated = [...prev.colors];
      updated[index] = {
        ...updated[index],
        hex: newHex,
        colorName: derivedName
      };
      return { ...prev, colors: updated };
    });
  };

  const handleToggleColorSize = (colorIndex: number, size: string) => {
    setForm((prev) => {
      const updated = [...prev.colors];
      const currentSizes = updated[colorIndex].sizes || [];
      const currentStocks = { ...(updated[colorIndex].sizeStocks || {}) };

      if (currentSizes.includes(size)) {
        updated[colorIndex].sizes = currentSizes.filter((s) => s !== size);
      } else {
        updated[colorIndex].sizes = [...currentSizes, size];
        if (currentStocks[size] === undefined) currentStocks[size] = 10;
      }
      updated[colorIndex].sizeStocks = currentStocks;
      return { ...prev, colors: updated };
    });
  };

  const handleStockQuantityChange = (colorIndex: number, size: string, quantity: number) => {
    setForm((prev) => {
      const updated = [...prev.colors];
      const currentStocks = { ...(updated[colorIndex].sizeStocks || {}) };
      currentStocks[size] = Math.max(0, quantity);
      updated[colorIndex].sizeStocks = currentStocks;
      return { ...prev, colors: updated };
    });
  };

  // Image Upload Handler for specific color variant
  const handleColorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const res = await fetchApi('/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image, fileName: file.name })
        });
        if (res.success && res.url) {
          setForm((prev) => {
            const updated = [...prev.colors];
            const currentImgs = updated[index].images || [];
            updated[index].mainImage = res.url;
            updated[index].images = [res.url, ...currentImgs.filter((x: string) => x !== res.url)];
            return { ...prev, colors: updated };
          });
          showToast(`Đã tải ảnh thành công cho ô màu này!`);
        }
        setUploadingIndex(null);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Lỗi tải ảnh: ' + err.message);
      setUploadingIndex(null);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      alert('Vui lòng nhập tên sản phẩm và mã SKU!');
      return;
    }

    const allSizesSet = new Set<string>();
    form.colors.forEach(c => {
      (c.sizes || []).forEach(s => allSizesSet.add(s));
    });
    const combinedSizes = Array.from(allSizesSet);

    const payload = {
      name: form.name,
      code: form.code,
      category: form.category,
      price: Number(form.price),
      salePrice: Number(form.salePrice),
      occasion: form.occasion,
      material: form.material,
      description: form.description,
      isAiGenerated: form.isAiGenerated,
      colors: form.colors.map((c) => ({
        hex: c.hex,
        colorName: c.colorName || 'Màu sắc',
        sizes: (c.sizes && c.sizes.length > 0) ? c.sizes : ['S', 'M', 'L', 'XL'],
        sizeStocks: (c.sizes || []).map((sz: string) => ({
          size: sz,
          stock: c.sizeStocks?.[sz] !== undefined ? c.sizeStocks[sz] : 10
        })),
        mainImage: c.mainImage || c.images[0],
        images: c.images?.length > 0 ? c.images : [c.mainImage]
      })),
      sizes: combinedSizes.length > 0 ? combinedSizes : ['S', 'M', 'L', 'XL'],
      inventory: form.colors.flatMap((c) =>
        (c.sizes || ['S', 'M', 'L', 'XL']).map((sz) => ({
          colorName: c.colorName || 'Màu sắc',
          hex: c.hex,
          size: sz,
          stock: c.sizeStocks?.[sz] !== undefined ? c.sizeStocks[sz] : 10
        }))
      )
    };

    try {
      if (editingProduct) {
        await fetchApi(`/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Đã cập nhật sản phẩm thành công!');
      } else {
        await fetchApi('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Đã đăng sản phẩm mới!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert('Lỗi lưu sản phẩm: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      showToast('Đã xóa sản phẩm!');
      loadData();
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản Lý Sản Phẩm & Tồn Kho Chi Tiết</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Đăng sản phẩm, chọn ô màu sắc & nhập số lượng tồn kho chính xác cho từng Size (VD: Màu Đỏ Size L còn 2 món)
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Đăng Sản Phẩm Mới
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc mã SKU (VD: GS-D01...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-xs font-bold text-slate-900 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Tất cả danh mục sản phẩm</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCT LIST TABLE */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-500">
          Đang tải danh sách sản phẩm...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-900 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Mã SKU</th>
                  <th className="p-4">Danh Mục</th>
                  <th className="p-4">Giá Bán</th>
                  <th className="p-4">Chi Tiết Tồn Kho (Màu & Size)</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => {
                  const mainImg = p.colors?.[0]?.mainImage || p.image || '/products/silk_cocktail_dress.jpg';
                  const displayPrice = p.salePrice || p.price;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      
                      <td className="p-4 flex items-center gap-3">
                        <img src={mainImg} className="w-12 h-14 object-cover rounded-xl border border-slate-200 shrink-0" alt="" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          {p.isAiGenerated && (
                            <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                              <Sparkles className="w-3 h-3 text-purple-600" /> AI Try-on
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-800">{p.code}</td>
                      <td className="p-4 font-bold text-slate-600">{p.category}</td>

                      <td className="p-4 font-bold text-slate-900">
                        {displayPrice ? `${displayPrice.toLocaleString('vi-VN')}đ` : '0đ'}
                        {p.salePrice && p.price > p.salePrice && (
                          <span className="block text-[10px] text-slate-400 line-through font-bold">
                            {p.price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {p.colors?.map((c: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm shrink-0"
                                style={{ backgroundColor: c.hex || '#000000' }}
                              />
                              <div className="text-[10px] font-bold text-slate-700 space-x-1">
                                {(c.sizeStocks && Array.isArray(c.sizeStocks) ? c.sizeStocks : (c.sizes || []).map((s: string) => ({ size: s, stock: 10 }))).map((st: any, idx: number) => (
                                  <span key={idx} className={st.stock <= 2 ? 'text-rose-600 font-extrabold' : ''}>
                                    {st.size}: <strong>{st.stock}</strong>{idx < (c.sizeStocks?.length || c.sizes?.length) - 1 ? ',' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* EDIT & DELETE ACTION BUTTONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p._id}`}
                            target="_blank"
                            className="p-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl transition-colors"
                            title="Xem trang sản phẩm"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                            title="Sửa màu sắc & Số lượng tồn theo Size"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Sửa Tồn Kho
                          </button>

                          <button
                            onClick={() => handleDelete(p._id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 animate-in zoom-in-95 max-h-[92vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-300" />
                <h3 className="text-base font-bold uppercase tracking-wider">
                  {editingProduct ? 'Chỉnh Sửa Sản Phẩm & Số Lượng Tồn Kho Theo Màu/Size' : 'Đăng Sản Phẩm Mới & Thiết Lập Tồn Kho Theo Màu/Size'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg p-1">
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đầm Lụa Tơ Tằm Cổ V..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã SKU Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="GS-D01"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Danh Mục Sản Phẩm</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giá Gốc Niêm Yết (đ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giá Khuyến Mãi (đ)</label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* DYNAMIC PER-COLOR SWATCH & PER-SIZE STOCK QUANTITY SECTION */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-slate-700" /> Ô Chọn Màu Sắc & Số Lượng Tồn Kho Cho Từng Size *
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Nhập chính xác số lượng tồn cho từng Size của ô màu đó (VD: Màu Đỏ Size L còn 2 món)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3px]" /> Thêm Ô Màu Mới
                  </button>
                </div>

                {/* Color Cards List */}
                <div className="space-y-4">
                  {form.colors.map((c, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-sm shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Ô Màu #{index + 1}
                          </span>
                        </div>

                        {form.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa ô màu này
                          </button>
                        )}
                      </div>

                      {/* 1. COLOR SWATCH PICKER BOX & PRESETS */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          1. Bấm Chọn Màu Trong Bảng (Color Swatch Picker) *
                        </label>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <input
                              type="color"
                              value={c.hex}
                              onChange={(e) => handleColorHexChange(index, e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                              title="Bấm vào để mở bảng màu tùy chỉnh"
                            />
                            <span className="text-xs font-mono font-bold text-slate-900 uppercase pr-2">
                              {c.hex}
                            </span>
                          </div>

                          <div className="text-[11px] font-medium text-slate-400">Hoặc chọn nhanh:</div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {PRESET_COLORS.map((preset) => {
                              const isSelected = c.hex.toLowerCase() === preset.hex.toLowerCase();

                              return (
                                <button
                                  key={preset.hex}
                                  type="button"
                                  onClick={() => handleColorHexChange(index, preset.hex)}
                                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'ring-2 ring-slate-900 scale-110 shadow'
                                      : 'hover:scale-105 border-slate-300 opacity-90'
                                  }`}
                                  style={{ backgroundColor: preset.hex }}
                                  title={preset.name}
                                >
                                  {isSelected && (
                                    <Check className={`w-3.5 h-3.5 stroke-[3px] ${preset.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 2. SIZES & STOCK QUANTITY INPUT FOR THIS COLOR VARIANT */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="block text-xs font-bold text-slate-700">
                          2. Chọn Size & Nhập Số Lượng Tồn Kho Cho Từng Size *
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {AVAILABLE_SIZES.map((sz) => {
                            const isChecked = (c.sizes || []).includes(sz);
                            const stockVal = c.sizeStocks?.[sz] !== undefined ? c.sizeStocks[sz] : 10;

                            return (
                              <div
                                key={sz}
                                className={`p-2.5 rounded-xl border transition-all space-y-1.5 ${
                                  isChecked
                                    ? 'bg-white border-slate-900 shadow-sm ring-1 ring-slate-900/10'
                                    : 'bg-slate-100/60 border-slate-200 opacity-60'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleToggleColorSize(index, sz)}
                                  className="w-full flex items-center justify-between text-xs font-bold text-slate-900"
                                >
                                  <span className="flex items-center gap-1">
                                    {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />}
                                    <span>Size {sz}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {isChecked ? 'Đang bán' : 'Ẩn'}
                                  </span>
                                </button>

                                {isChecked && (
                                  <div className="pt-1">
                                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Tồn kho (món):</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={stockVal}
                                      onChange={(e) => handleStockQuantityChange(index, sz, Number(e.target.value))}
                                      className="w-full px-2.5 py-1 text-xs font-mono font-bold text-slate-900 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. PHOTO UPLOAD FOR THIS COLOR VARIANT */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="block text-xs font-bold text-slate-700">
                          3. Ảnh Chụp Mẫu Cho Ô Màu Này *
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-white hover:bg-slate-100 transition-colors relative cursor-pointer flex-1 w-full">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(index, e)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="flex items-center justify-center gap-2 pointer-events-none">
                              <Upload className="w-4 h-4 text-slate-600" />
                              <span className="text-xs font-bold text-slate-700">
                                {uploadingIndex === index ? 'Đang tải ảnh...' : 'Bấm vào đây để chọn ảnh từ thiết bị'}
                              </span>
                            </div>
                          </div>

                          <input
                            type="text"
                            placeholder="Hoặc dán URL ảnh ô màu này..."
                            value={c.mainImage}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm((prev) => {
                                const updated = [...prev.colors];
                                updated[index].mainImage = val;
                                updated[index].images = [val, ...(updated[index].images || []).filter(x => x !== val)];
                                return { ...prev, colors: updated };
                              });
                            }}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full"
                          />
                        </div>

                        {/* Image Preview Thumbnail */}
                        {c.mainImage && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] font-bold text-slate-600">Xem trước ảnh ô màu này:</span>
                            <div className="w-12 h-14 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                              <img src={c.mainImage} alt="Color preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Sản Phẩm & Chất Liệu Vải</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập mô tả phom dáng, chất liệu vải..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* AI Try-on label check */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAiGenerated}
                    onChange={(e) => setForm({ ...form, isAiGenerated: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Đính nhãn "Người mẫu do AI tạo" (AI Try-on Model)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  {editingProduct ? 'Lưu Cập Nhật' : 'Đăng Sản Phẩm'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
