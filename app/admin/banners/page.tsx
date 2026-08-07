'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Plus, Trash2, Edit3, Eye, EyeOff, CheckCircle2, Link as LinkIcon, Sparkles, Layers } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero_slide' | 'sub_banner'>('hero_slide');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '/products',
    order: 1,
    type: 'hero_slide',
    active: true
  });

  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadBanners = () => {
    setLoading(true);
    fetchApi('/banners')
      .then((data) => setBanners(data.banners || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreateModal = (type: 'hero_slide' | 'sub_banner' = activeTab) => {
    setEditingBanner(null);
    setFormData({
      title: type === 'sub_banner' ? 'BIG SALE UP TO 50%' : '',
      subtitle: type === 'sub_banner' ? 'ONLY STORE & ONLINE' : '',
      imageUrl: '',
      linkUrl: type === 'sub_banner' ? '/products?isHot=true' : '/products',
      order: banners.filter(b => (b.type || 'hero_slide') === type).length + 1,
      type: type,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '/products',
      order: banner.order || 1,
      type: banner.type || 'hero_slide',
      active: banner.active !== undefined ? banner.active : true
    });
    setIsModalOpen(true);
  };

  // Image File Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh!');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const res = await fetchApi('/upload', {
          method: 'POST',
          body: JSON.stringify({
            image: base64Image,
            fileName: file.name
          })
        });

        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, imageUrl: res.url }));
          showToast('Đã tải ảnh lên máy chủ thành công!');
        } else {
          alert('Tải ảnh thất bại: ' + (res.message || 'Lỗi không xác định'));
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Lỗi tải ảnh lên: ' + err.message);
      setUploading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        await fetchApi(`/banners/${editingBanner._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast('Đã cập nhật banner thành công!');
      } else {
        await fetchApi('/banners', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast('Đã thêm banner mới thành công!');
      }

      setIsModalOpen(false);
      loadBanners();
    } catch (err: any) {
      alert('Lỗi lưu banner: ' + err.message);
    }
  };

  const handleToggleActive = async (banner: any) => {
    try {
      await fetchApi(`/banners/${banner._id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !banner.active })
      });
      showToast(`Đã ${!banner.active ? 'bật' : 'tắt'} hiển thị banner!`);
      loadBanners();
    } catch (err: any) {
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await fetchApi(`/banners/${bannerId}`, {
        method: 'DELETE'
      });
      showToast('Đã xóa banner thành công!');
      loadBanners();
    } catch (err: any) {
      alert('Lỗi xóa banner: ' + err.message);
    }
  };

  // Strictly filter by type
  const heroBanners = banners.filter((b) => (b.type || 'hero_slide') === 'hero_slide');
  const subBannersList = banners.filter((b) => b.type === 'sub_banner');

  const filteredBanners = activeTab === 'hero_slide' ? heroBanners : subBannersList;

  return (
    <div className="space-y-8">
      
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản Lý Slide Banners & Banner Phụ</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Quản lý riêng biệt Banner trượt lớn và 2 Banner nhỏ phụ (Big Sale / Freeship)
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal(activeTab)}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Thêm {activeTab === 'hero_slide' ? 'Slide Banner Lớn' : 'Banner Phụ Nhỏ'}
        </button>
      </div>

      {/* TABS NAVIGATION - STRICTLY SEPARATED */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('hero_slide')}
          className={`px-5 py-3 rounded-t-2xl font-bold text-xs transition-all flex items-center gap-2 border-b-4 ${
            activeTab === 'hero_slide'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> 1. Slide Banner Lớn (Hero Slider) ({heroBanners.length})
        </button>

        <button
          onClick={() => setActiveTab('sub_banner')}
          className={`px-5 py-3 rounded-t-2xl font-bold text-xs transition-all flex items-center gap-2 border-b-4 ${
            activeTab === 'sub_banner'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> 2. Banner Nhỏ Phụ (Big Sale & Freeship) ({subBannersList.length})
        </button>
      </div>

      {/* Banners Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredBanners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBanners.map((banner, index) => (
            <div
              key={banner._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Banner Image Preview */}
              <div className="relative h-48 md:h-56 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Khung Đồ Họa Mẫu</span>
                    <h4 className="text-xl font-bold">{banner.title || 'BIG SALE'}</h4>
                    <p className="text-xs font-bold opacity-80">{banner.subtitle}</p>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full shadow uppercase ${
                      banner.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {banner.active ? 'Đang Hiển Thị' : 'Đã Ẩn'}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-slate-900 text-[10px] font-bold rounded-full shadow border border-slate-200">
                    Vị trí: {banner.order || index + 1}
                  </span>
                </div>

                {/* Quick Toggle Eye */}
                <button
                  onClick={() => handleToggleActive(banner)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors shadow z-10"
                  title={banner.active ? 'Ẩn banner' : 'Bật hiển thị banner'}
                >
                  {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Banner Details & Controls */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {banner.title || 'Chưa có tiêu đề'}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}

                  {banner.linkUrl && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-bold mt-2 truncate">
                      <LinkIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{banner.linkUrl}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                    Loại: {banner.type === 'sub_banner' ? 'Banner Phụ Nhỏ' : 'Slide Banner Lớn'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(banner)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa
                    </button>

                    <button
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Chưa có {activeTab === 'hero_slide' ? 'Slide Banner Lớn' : 'Banner Nhỏ Phụ'} nào</h3>
          <button
            onClick={() => handleOpenCreateModal(activeTab)}
            className="px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
          >
            + Thêm {activeTab === 'hero_slide' ? 'Slide Banner Lớn' : 'Banner Nhỏ Phụ'} Mới
          </button>
        </div>
      )}

      {/* CREATE / EDIT BANNER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 animate-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-slate-300" />
                <h3 className="text-base font-bold uppercase tracking-wider">
                  {editingBanner ? 'Chỉnh Sửa Banner' : `Tải Ảnh Mới & Thêm ${formData.type === 'sub_banner' ? 'Banner Phụ Nhỏ' : 'Slide Banner Lớn'}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vị Trí & Loại Banner *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                >
                  <option value="hero_slide">1. Slide Banner Lớn (Hero Slider)</option>
                  <option value="sub_banner">2. Banner Nhỏ Phụ Phía Dưới (Big Sale / Freeship)</option>
                </select>
              </div>

              {/* IMAGE UPLOAD ZONE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Tải Ảnh Banner Lên Máy Chủ CDN / Upload Image
                </label>
                
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      {uploading ? 'Đang tải tệp ảnh lên...' : 'Bấm vào đây để chọn tệp ảnh từ máy tính'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Hỗ trợ JPG, PNG, WEBP tối đa 50MB</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Hoặc dán URL hình ảnh sẵn có (Link CDN):
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../banner.jpg hoặc /uploads/banner_xxx.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">Xem trước ảnh Banner:</p>
                    <div className="h-36 w-full rounded-2xl overflow-hidden border border-slate-200">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Banner *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: BIG SALE UP TO 50% OFF..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Phụ (Subtitle)</label>
                  <input
                    type="text"
                    placeholder="VD: ONLY STORE & ONLINE hoặc KHI ĐẶT HÀNG TẠI WEBSITE..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Link URL & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link Chuyển Trang Khi Bấm</label>
                  <input
                    type="text"
                    placeholder="/products?isHot=true"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thứ Tự Xuất Hiện</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="pt-2 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Trạng Thái Hiển Thị Trên Trang Chủ</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    formData.active ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md"></span>
                </button>
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
                  disabled={uploading}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  {editingBanner ? 'Lưu Cập Nhật' : 'Tạo Banner Mới'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
