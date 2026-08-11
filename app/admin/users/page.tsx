'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Edit3, Trash2, CheckCircle2, XCircle, Search, Filter, Key, PenTool, User, Lock, Phone, Mail } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'content',
    canWrite: true
  });

  const [toastMsg, setToastMsg] = useState('');

  const loadUsers = () => {
    setLoading(true);
    fetchApi('/auth/users')
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '123456',
      role: 'content',
      canWrite: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      password: '',
      role: user.role || 'customer',
      canWrite: user.canWrite !== undefined ? user.canWrite : (user.role === 'admin' || user.role === 'content')
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // PUT permissions
        await fetchApi(`/auth/users/${editingUser._id}/permissions`, {
          method: 'PUT',
          body: JSON.stringify({
            role: formData.role,
            canWrite: formData.canWrite
          })
        });
        showToast(`Đã cập nhật quyền cho ${editingUser.name}!`);
      } else {
        // POST create user
        await fetchApi('/auth/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast('Đã tạo tài khoản và cấp quyền thành công!');
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Quick toggle write permission
  const handleToggleCanWrite = async (user: any) => {
    const nextVal = !user.canWrite;
    try {
      await fetchApi(`/auth/users/${user._id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ canWrite: nextVal })
      });
      showToast(`Đã ${nextVal ? 'cấp' : 'thu hồi'} Quyền Viết Bài của ${user.name}!`);
      loadUsers();
    } catch (err: any) {
      alert('Lỗi cập nhật quyền: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userName}"?`)) return;
    try {
      await fetchApi(`/auth/users/${userId}`, {
        method: 'DELETE'
      });
      showToast('Đã xóa tài khoản user!');
      loadUsers();
    } catch (err: any) {
      alert('Lỗi xóa user: ' + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'CAN_WRITE' && u.canWrite) ||
      u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản Lý Quyền & Tài Khoản User</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Phân quyền Viết bài / Biên tập bài viết & sản phẩm cho tài khoản nhân viên / biên tập viên
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 w-fit"
        >
          <UserPlus className="w-4 h-4 stroke-[3px]" /> Tạo Tài Khoản & Cấp Quyền Mới
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100 p-4 rounded-2xl border border-slate-200">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Số điện thoại hoặc Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="ALL">Tất cả tài khoản ({users.length})</option>
            <option value="CAN_WRITE">✍️ Chỉ tài khoản Có Quyền Viết Bài</option>
            <option value="admin">👑 Admin Master</option>
            <option value="content">📝 Biên Tập Viên (Content)</option>
            <option value="customer">🛍️ Khách Hàng</option>
          </select>
        </div>

      </div>

      {/* Users List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-bold">
          Đang tải danh sách tài khoản...
        </div>
      ) : filteredUsers.length > 0 ? (
        <>
          {/* MOBILE VIEW: Touch-friendly Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {filteredUsers.map((u) => {
              const isAdmin = u.role === 'admin';
              const isContent = u.role === 'content';
              const canWrite = u.canWrite || isAdmin || isContent;

              return (
                <div key={u._id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border border-slate-300 shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {u._id}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-slate-900 text-white'
                          : isContent
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isAdmin ? 'Admin' : isContent ? 'Biên Tập' : 'Khách'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                    </span>
                    {u.email && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[150px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" /> <span className="truncate">{u.email}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCanWrite(u)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[9px] uppercase transition-all ${
                        canWrite
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {canWrite ? (
                        <>
                          <PenTool className="w-3 h-3" /> Quyền Viết Bài: Bật
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Quyền Viết Bài: Tắt
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Sửa
                      </button>

                      {!isAdmin && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP / TABLET VIEW: Full Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Tài Khoản / Tên User</th>
                    <th className="p-4">Số Điện Thoại & Email</th>
                    <th className="p-4">Vai Trò (Role)</th>
                    <th className="p-4 text-center">Quyền Viết Bài (Can Write)</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin';
                    const isContent = u.role === 'content';
                    const canWrite = u.canWrite || isAdmin || isContent;

                    return (
                      <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Name */}
                        <td className="p-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border border-slate-300">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">ID: {u._id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Phone & Email */}
                        <td className="p-4 font-bold text-slate-800">
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                          </p>
                          {u.email && (
                            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                            </p>
                          )}
                        </td>

                        {/* Role Badge */}
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isAdmin
                                ? 'bg-slate-900 text-white shadow-sm'
                                : isContent
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {isAdmin ? '👑 Admin Master' : isContent ? '📝 Biên Tập Viên' : '🛍️ Khách Hàng'}
                          </span>
                        </td>

                        {/* Can Write Switch */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleCanWrite(u)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase transition-all shadow-sm ${
                              canWrite
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Bấm để bật / tắt quyền viết bài"
                          >
                            {canWrite ? (
                              <>
                                <PenTool className="w-3.5 h-3.5" /> Có Quyền Viết Bài
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Không Có Quyền
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Phân Quyền
                            </button>

                            {!isAdmin && (
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Xóa
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <User className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Không tìm thấy tài khoản nào phù hợp</h3>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 animate-in zoom-in-95">
            
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-slate-300" />
                <h3 className="text-base font-bold uppercase tracking-wider">
                  {editingUser ? `Phân Quyền User: ${editingUser.name}` : 'Tạo Tài Khoản & Cấp Quyền Viết Bài'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ & Tên User *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Biên Tập Viên Thanh Hằng"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số Điện Thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0912345678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mật Khẩu *</label>
                      <input
                        type="text"
                        required
                        placeholder="123456"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email (Không bắt buộc)</label>
                    <input
                      type="email"
                      placeholder="email@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vai Trò Tài Khoản (Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="content">📝 Biên Tập Viên (Content Writer)</option>
                  <option value="admin">👑 Admin Master (Quản Trị Viên Hàng Đầu)</option>
                  <option value="customer">🛍️ Khách Hàng Thường</option>
                </select>
              </div>

              {/* CAN WRITE PERMISSION SWITCH */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-slate-700" /> Cấp Quyền Viết Bài
                  </label>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Cho phép tài khoản này đăng bài viết, mix match lookbook & quản lý sản phẩm
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, canWrite: !formData.canWrite })}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    formData.canWrite ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
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
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  {editingUser ? 'Lưu Phân Quyền' : 'Tạo & Cấp Quyền'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
