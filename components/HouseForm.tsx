
import React, { useState } from 'react';
import { HouseNumberRecord, FormTab, Street, Neighborhood, FamilyMember, RelationshipType } from '../types';
import { X, Save, User, MapPin, FileText, Settings, Navigation, Plus, Trash2, Heart, HeartOff, Users, Edit } from 'lucide-react';
import MapView from './MapView';

interface HouseFormProps {
  initialData?: Partial<HouseNumberRecord>;
  onSubmit: (data: Partial<HouseNumberRecord>) => void;
  onClose: () => void;
  isEditing?: boolean;
  streets: Street[];
  neighborhoods: Neighborhood[];
  relationshipTypes: RelationshipType[];
}

const HouseForm: React.FC<HouseFormProps> = ({ 
  initialData, 
  onSubmit, 
  onClose, 
  isEditing, 
  streets, 
  neighborhoods,
  relationshipTypes
}) => {
  const [formData, setFormData] = useState<Partial<HouseNumberRecord>>(initialData || {
    Status: 'Active',
    X: 10.7719,
    Y: 106.6983,
    TranhChap: false,
    QuocTich: 'Việt Nam',
    DanToc: 'Kinh',
    QuanHeChuHo: []
  });
  
  const [activeTab, setActiveTab] = useState<FormTab>('Owner');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({
    HoTen: '',
    QuanHe: '',
    NgaySinh: '',
    GioiTinh: 'Nam',
    SoCCCD: '',
    TrangThai: 'Còn sống'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, X: lat, Y: lng }));
  };

  const addFamilyMember = () => {
    if (!newMember.HoTen || !newMember.QuanHe) {
      alert('Vui lòng nhập Họ tên và chọn Mối quan hệ.');
      return;
    }

    if (editingMemberId) {
      // Cập nhật thành viên đang sửa
      setFormData(prev => ({
        ...prev,
        QuanHeChuHo: (prev.QuanHeChuHo || []).map(m => 
          m.id === editingMemberId ? { ...newMember, id: editingMemberId } : m
        )
      }));
      setEditingMemberId(null);
    } else {
      // Thêm mới
      const memberWithId: FamilyMember = {
        ...newMember,
        id: Math.random().toString(36).substr(2, 9)
      };
      setFormData(prev => ({
        ...prev,
        QuanHeChuHo: [...(prev.QuanHeChuHo || []), memberWithId]
      }));
    }

    setNewMember({
      HoTen: '',
      QuanHe: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      SoCCCD: '',
      TrangThai: 'Còn sống'
    });
  };

  const editFamilyMember = (member: FamilyMember) => {
    setEditingMemberId(member.id);
    setNewMember({
      HoTen: member.HoTen,
      QuanHe: member.QuanHe,
      NgaySinh: member.NgaySinh,
      GioiTinh: member.GioiTinh,
      SoCCCD: member.SoCCCD,
      TrangThai: member.TrangThai
    });
  };

  const removeFamilyMember = (id: string) => {
    if (editingMemberId === id) {
       setEditingMemberId(null);
       setNewMember({ HoTen: '', QuanHe: '', NgaySinh: '', GioiTinh: 'Nam', SoCCCD: '', TrangThai: 'Còn sống' });
    }
    setFormData(prev => ({
      ...prev,
      QuanHeChuHo: (prev.QuanHeChuHo || []).filter(m => m.id !== id)
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Owner':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tên chủ hộ <span className="text-red-500">*</span></label>
                <input name="TenChuHo" value={formData.TenChuHo || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Số CCCD <span className="text-red-500">*</span></label>
                <input name="SoCCCD" value={formData.SoCCCD || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Giới tính</label>
                <select name="GioiTinhCh" value={formData.GioiTinhCh || 'Nam'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Điện thoại</label>
                <input name="DienThoaiC" value={formData.DienThoaiC || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ngày sinh</label>
                <input type="date" name="NgaySinhCh" value={formData.NgaySinhCh || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Quốc tịch</label>
                <input name="QuocTich" value={formData.QuocTich || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Users size={16} className="text-blue-600" /> Danh sách người liên quan / Thành viên gia đình
              </h3>
              
              <div className={`p-4 rounded-xl border border-dashed transition-all ${editingMemberId ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-200' : 'bg-slate-50 border-slate-300'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Họ tên</label>
                  <input value={newMember.HoTen} onChange={e => setNewMember({...newMember, HoTen: e.target.value})} className="w-full px-2 py-1.5 text-sm border rounded-md" placeholder="Nguyễn Văn B" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Quan hệ với chủ hộ</label>
                  <select 
                    value={newMember.QuanHe} 
                    onChange={e => setNewMember({...newMember, QuanHe: e.target.value})} 
                    className="w-full px-2 py-1.5 text-sm border rounded-md"
                  >
                    <option value="">-- Chọn quan hệ --</option>
                    {relationshipTypes.map(rel => <option key={rel.id} value={rel.name}>{rel.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CCCD</label>
                  <input value={newMember.SoCCCD} onChange={e => setNewMember({...newMember, SoCCCD: e.target.value})} className="w-full px-2 py-1.5 text-sm border rounded-md" placeholder="Số định danh" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Ngày sinh</label>
                  <input type="date" value={newMember.NgaySinh} onChange={e => setNewMember({...newMember, NgaySinh: e.target.value})} className="w-full px-2 py-1.5 text-sm border rounded-md" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Giới tính</label>
                  <select value={newMember.GioiTinh} onChange={e => setNewMember({...newMember, GioiTinh: e.target.value as any})} className="w-full px-2 py-1.5 text-sm border rounded-md">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Trạng thái</label>
                  <select value={newMember.TrangThai} onChange={e => setNewMember({...newMember, TrangThai: e.target.value as any})} className="w-full px-2 py-1.5 text-sm border rounded-md">
                    <option value="Còn sống">Còn sống</option>
                    <option value="Đã mất">Đã mất</option>
                  </select>
                </div>
                <div className="col-span-full flex justify-end pt-2 gap-2">
                  {editingMemberId && (
                    <button type="button" onClick={() => { setEditingMemberId(null); setNewMember({HoTen: '', QuanHe: '', NgaySinh: '', GioiTinh: 'Nam', SoCCCD: '', TrangThai: 'Còn sống'}); }} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">
                      Hủy bỏ sửa
                    </button>
                  )}
                  <button type="button" onClick={addFamilyMember} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm ${editingMemberId ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {editingMemberId ? <Save size={14} /> : <Plus size={14} />} 
                    {editingMemberId ? 'Cập nhật thành viên' : 'Thêm vào danh sách'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400">
                      <th className="px-4 py-3">Họ tên</th>
                      <th className="px-4 py-3">Quan hệ với chủ hộ</th>
                      <th className="px-4 py-3">CCCD</th>
                      <th className="px-4 py-3">Ngày sinh</th>
                      <th className="px-4 py-3">Giới tính</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-right">#</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.QuanHeChuHo && formData.QuanHeChuHo.length > 0 ? (
                      formData.QuanHeChuHo.map(member => (
                        <tr key={member.id} className={`hover:bg-slate-50 group transition-colors ${editingMemberId === member.id ? 'bg-orange-50' : ''}`}>
                          <td className="px-4 py-3 font-bold text-slate-700">{member.HoTen}</td>
                          <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{member.QuanHe}</span></td>
                          <td className="px-4 py-3 text-slate-500 font-mono">{member.SoCCCD || '--'}</td>
                          <td className="px-4 py-3 text-slate-500">{member.NgaySinh || '--'}</td>
                          <td className="px-4 py-3 text-slate-500">{member.GioiTinh}</td>
                          <td className="px-4 py-3">
                            {member.TrangThai === 'Còn sống' ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-medium"><Heart size={12} /> {member.TrangThai}</span>
                            ) : (
                              <span className="flex items-center gap-1 text-slate-400 font-medium"><HeartOff size={12} /> {member.TrangThai}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => editFamilyMember(member)} className="p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg">
                                <Edit size={14} />
                              </button>
                              <button type="button" onClick={() => removeFamilyMember(member.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">Chưa có người liên quan nào trong danh sách</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Address':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Số nhà chính thức</label>
              <input name="SoNha" value={formData.SoNha || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên đường <span className="text-red-500">*</span></label>
              <select 
                name="Duong" 
                value={formData.Duong || ''} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn đường --</option>
                {streets.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Khu phố / Tổ dân phố <span className="text-red-500">*</span></label>
              <select 
                name="KDC" 
                value={formData.KDC || ''} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn khu phố --</option>
                {neighborhoods.map(nb => <option key={nb.id} value={nb.nameNew}>{nb.nameNew} (Cũ: {nb.nameOld})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Số nhà tạm</label>
              <input name="SoNhaTam" value={formData.SoNhaTam || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">X (Lat)</label>
                <input type="number" step="0.000001" name="X" value={formData.X || 0} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Y (Lng)</label>
                <input type="number" step="0.000001" name="Y" value={formData.Y || 0} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setActiveTab('Map')}
              className="mt-7 h-10 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <MapPin size={16} /> Chọn trên bản đồ
            </button>
          </div>
        );
      case 'Legal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tình trạng pháp lý</label>
              <input name="PhapLy" value={formData.PhapLy || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Số tờ / Số thửa</label>
              <div className="flex gap-2">
                <input name="SoTo" value={formData.SoTo || ''} onChange={handleChange} placeholder="Số tờ" className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <input name="SoThua" value={formData.SoThua || ''} onChange={handleChange} placeholder="Số thửa" className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nguồn gốc đất</label>
              <input name="NguonGocDa" value={formData.NguonGocDa || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="col-span-full space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" name="TranhChap" checked={formData.TranhChap} onChange={handleChange} className="w-4 h-4 rounded text-blue-600" />
                Đang có tranh chấp
              </label>
              {formData.TranhChap && (
                <textarea name="NoiDungTra" value={formData.NoiDungTra || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Chi tiết nội dung tranh chấp..." />
              )}
            </div>
          </div>
        );
      case 'Technical':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ghi chú bổ sung</label>
              <textarea name="GhiChu" value={formData.GhiChu || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        );
      case 'Map':
        return (
          <div className="h-[400px] flex flex-col gap-2">
            <MapView 
              center={[formData.X || 10.7719, formData.Y || 106.6983]} 
              isSelectMode 
              onSelectLocation={handleLocationSelect} 
              markers={formData.X && formData.Y ? [{ id: 'current_selection', lat: formData.X, lng: formData.Y, label: 'Vị trí đã chọn' }] : []}
            />
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 bg-slate-100 p-2 rounded-lg">
               <span>Tọa độ hiện tại: {formData.X?.toFixed(6)}, {formData.Y?.toFixed(6)}</span>
               <button onClick={() => setActiveTab('Address')} className="text-blue-600 hover:underline">Xác nhận vị trí</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Cập Nhật Thông Tin Số Nhà' : 'Thêm Mới Số Nhà'}</h2>
            <p className="text-sm text-slate-500">Mã hồ sơ: {formData.MaSoHS || 'Tự động tạo'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 px-6 gap-6">
          <TabButton active={activeTab === 'Owner'} onClick={() => setActiveTab('Owner'} icon={<User size={18} />} label="Chủ hộ & Người liên quan" />
          <TabButton active={activeTab === 'Address'} onClick={() => setActiveTab('Address'} icon={<Navigation size={18} />} label="Địa chỉ" />
          <TabButton active={activeTab === 'Legal'} onClick={() => setActiveTab('Legal'} icon={<FileText size={18} />} label="Pháp lý" />
          <TabButton active={activeTab === 'Technical'} onClick={() => setActiveTab('Technical'} icon={<Settings size={18} />} label="Kỹ thuật" />
          <TabButton active={activeTab === 'Map'} onClick={() => setActiveTab('Map'} icon={<MapPin size={18} />} label="Vị trí" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors">Hủy</button>
          <button 
            onClick={() => onSubmit(formData)}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Save size={18} /> {isEditing ? 'Lưu thay đổi' : 'Tạo hồ sơ mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
  >
    {icon} {label}
  </button>
);

export default HouseForm;
