
import React, { useState, useMemo } from 'react';
import { MedalRecord, HouseNumberRecord, RelationshipType, MedalType, Bank } from '../types';
import { X, Save, Search, CheckCircle2, User, Building, Plus, Trash2, Award, List, Wallet, UserCog, Edit, RotateCcw, CreditCard, Banknote } from 'lucide-react';

interface MedalFormProps {
  initialData?: Partial<MedalRecord>;
  onSubmit: (data: Partial<MedalRecord>[]) => void;
  onClose: () => void;
  isEditing?: boolean;
  houseRecords: HouseNumberRecord[];
  relationshipTypes: RelationshipType[];
  medalTypes: MedalType[];
  banks: Bank[];
}

const MedalForm: React.FC<MedalFormProps> = ({ 
  initialData, 
  onSubmit, 
  onClose, 
  isEditing, 
  houseRecords,
  relationshipTypes,
  medalTypes,
  banks
}) => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | undefined>(initialData?.LinkedHouseId);
  const [houseSearch, setHouseSearch] = useState('');
  const [editingTempIndex, setEditingTempIndex] = useState<number | null>(null);

  const isHouseLocked = useMemo(() => !!initialData?.LinkedHouseId && !isEditing, [initialData, isEditing]);
  
  const [medalsList, setMedalsList] = useState<Partial<MedalRecord>[]>(
    isEditing && initialData ? [initialData] : []
  );

  const [currentMedal, setCurrentMedal] = useState<Partial<MedalRecord>>({
    HoTen: initialData?.HoTen || '',
    QuanHe: initialData?.QuanHe || '',
    LoaiDoiTuong: initialData?.LoaiDoiTuong || '',
    SoQuanLyHS: initialData?.SoQuanLyHS || '',
    SoTien: initialData?.SoTien || 0,
    NguoiNhanThay: initialData?.NguoiNhanThay || '',
    GhiChu: initialData?.GhiChu || '',
    HinhThucNhan: initialData?.HinhThucNhan || 'Tiền mặt',
    NganHang: initialData?.NganHang || '',
    SoTaiKhoan: initialData?.SoTaiKhoan || '',
    ChuTaiKhoan: initialData?.ChuTaiKhoan || ''
  });

  const filteredHouses = useMemo(() => {
    if (!houseSearch.trim()) return [];
    return houseRecords.filter(h => 
      (h.TenChuHo || '').toLowerCase().includes(houseSearch.toLowerCase()) ||
      (h.SoNha || '').toLowerCase().includes(houseSearch.toLowerCase()) ||
      (h.SoCCCD || '').includes(houseSearch)
    ).slice(0, 5);
  }, [houseSearch, houseRecords]);

  const selectedHouse = useMemo(() => {
    return houseRecords.find(h => h.id === selectedHouseId);
  }, [selectedHouseId, houseRecords]);

  const availableReceivers = useMemo(() => {
    if (!selectedHouse) return [];
    const members = [
      { id: 'chuho', name: `${selectedHouse.TenChuHo} (Chủ hộ)` },
      ...(selectedHouse.QuanHeChuHo || []).map(m => ({ id: m.id, name: `${m.HoTen} (${m.QuanHe})` }))
    ];
    return members;
  }, [selectedHouse]);

  const handleAddToList = () => {
    if (!currentMedal.HoTen) return alert('Vui lòng nhập họ tên người được huân chương');
    if (!currentMedal.LoaiDoiTuong) return alert('Vui lòng chọn loại huân chương');
    if (currentMedal.HinhThucNhan === 'Chuyển khoản') {
      if (!currentMedal.NganHang || !currentMedal.SoTaiKhoan || !currentMedal.ChuTaiKhoan) {
        return alert('Vui lòng nhập đầy đủ thông tin chuyển khoản');
      }
    }
    
    if (editingTempIndex !== null) {
      const newList = [...medalsList];
      newList[editingTempIndex] = { ...currentMedal };
      setMedalsList(newList);
      setEditingTempIndex(null);
    } else {
      setMedalsList(prev => [...prev, { ...currentMedal, id: Math.random().toString(36).substr(2, 9) }]);
    }

    if (!isEditing) {
      setCurrentMedal({
        HoTen: '',
        QuanHe: '',
        LoaiDoiTuong: '',
        SoQuanLyHS: '',
        SoTien: 0,
        NguoiNhanThay: '',
        GhiChu: '',
        HinhThucNhan: 'Tiền mặt',
        NganHang: '',
        SoTaiKhoan: '',
        ChuTaiKhoan: ''
      });
    }
  };

  const handleEditTemp = (index: number) => {
    setEditingTempIndex(index);
    setCurrentMedal(medalsList[index]);
  };

  const cancelEdit = () => {
    setEditingTempIndex(null);
    setCurrentMedal({
      HoTen: '',
      QuanHe: '',
      LoaiDoiTuong: '',
      SoQuanLyHS: '',
      SoTien: 0,
      NguoiNhanThay: '',
      GhiChu: '',
      HinhThucNhan: 'Tiền mặt',
      NganHang: '',
      SoTaiKhoan: '',
      ChuTaiKhoan: ''
    });
  };

  const removeFromList = (index: number) => {
    if (editingTempIndex === index) setEditingTempIndex(null);
    setMedalsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    if (!selectedHouseId) return alert('Vui lòng chọn số nhà liên kết');
    
    let finalData;
    if (isEditing) {
      finalData = [{ ...currentMedal, LinkedHouseId: selectedHouseId }];
    } else {
      if (medalsList.length === 0) return alert('Vui lòng thêm ít nhất một hồ sơ vào danh sách');
      finalData = medalsList.map(m => ({ ...m, LinkedHouseId: selectedHouseId }));
    }
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Sửa hồ sơ Huân chương' : 'Thêm hồ sơ Huân chương KC'}</h2>
            <p className="text-xs text-slate-500 italic mt-1">Thông tin khen thưởng và phương thức chi trả trợ cấp</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Building size={14} className="text-blue-600" /> 1. Chọn số nhà liên kết
            </label>
            
            {!isEditing && !isHouseLocked && (
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-sm transition-all">
                  <Search size={18} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm theo Tên chủ hộ, Số nhà hoặc CCCD..." 
                    className="w-full outline-none text-sm"
                    value={houseSearch}
                    onChange={(e) => setHouseSearch(e.target.value)}
                  />
                </div>

                {filteredHouses.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border rounded-lg shadow-xl overflow-hidden divide-y">
                    {filteredHouses.map(house => (
                      <button 
                        key={house.id}
                        onClick={() => { setSelectedHouseId(house.id); setHouseSearch(''); }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{house.TenChuHo}</p>
                          <p className="text-[10px] text-slate-500">SN: {house.SoNha} {house.Duong} | CCCD: {house.SoCCCD}</p>
                        </div>
                        <Plus size={16} className="text-slate-300 group-hover:text-blue-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedHouse ? (
              <div className={`border rounded-xl p-4 flex items-center justify-between ${isHouseLocked || isEditing ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isHouseLocked || isEditing ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-600'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ liên kết</p>
                    <p className="text-sm font-black text-slate-800">{selectedHouse.SoNha} {selectedHouse.Duong}</p>
                    <p className="text-[11px] text-slate-600">Chủ hộ: {selectedHouse.TenChuHo} | Tờ/Thửa: T{selectedHouse.SoTo}/Th{selectedHouse.SoThua}</p>
                  </div>
                </div>
                {!isEditing && !isHouseLocked && (
                  <button onClick={() => { setSelectedHouseId(undefined); setMedalsList([]); }} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50">
                <p className="text-sm text-slate-400 italic">Vui lòng chọn hồ sơ số nhà để bắt đầu</p>
              </div>
            )}
          </div>

          {selectedHouseId && (
            <div className="space-y-6 border-t pt-6 animation-fade-in">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Award size={14} className="text-amber-600" /> 2. Nhập thông tin Huân chương kháng chiến & Thanh toán
              </label>

              <div className={`p-6 rounded-2xl border transition-all ${editingTempIndex !== null ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-200' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                {editingTempIndex !== null && (
                  <div className="flex items-center justify-between bg-orange-100 px-3 py-1.5 rounded-lg mb-2">
                    <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit size={14} /> Đang chỉnh sửa hồ sơ</p>
                    <button onClick={cancelEdit} className="text-[10px] font-bold text-orange-600 flex items-center gap-1 hover:underline"><RotateCcw size={12}/> Hủy sửa</button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Họ và tên người nhận <span className="text-red-500">*</span></label>
                    <input 
                      value={currentMedal.HoTen || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, HoTen: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm" 
                      placeholder="Nhập họ tên..." 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Quan hệ với chủ hộ</label>
                    <select 
                      value={currentMedal.QuanHe || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, QuanHe: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    >
                      <option value="">-- Chọn quan hệ --</option>
                      {relationshipTypes.map(rel => <option key={rel.id} value={rel.name}>{rel.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Loại Huân chương/Huy chương <span className="text-red-500">*</span></label>
                    <select 
                      value={currentMedal.LoaiDoiTuong || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, LoaiDoiTuong: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    >
                      <option value="">-- Chọn loại đối tượng --</option>
                      {medalTypes.map(mt => <option key={mt.id} value={mt.name}>{mt.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Số quản lý hồ sơ</label>
                    <input 
                      value={currentMedal.SoQuanLyHS || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, SoQuanLyHS: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono" 
                      placeholder="Nhập số hồ sơ..." 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><Wallet size={12}/> Số tiền trợ cấp (nếu có)</label>
                    <input 
                      type="number"
                      value={currentMedal.SoTien || 0} 
                      onChange={e => setCurrentMedal({...currentMedal, SoTien: parseFloat(e.target.value) || 0})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-emerald-600" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><UserCog size={12}/> Người nhận thay</label>
                    <select 
                      value={currentMedal.NguoiNhanThay || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, NguoiNhanThay: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-amber-700 bg-amber-50"
                    >
                      <option value="">-- Chính chủ (không nhận thay) --</option>
                      {availableReceivers.map(rec => <option key={rec.id} value={rec.name}>{rec.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><Banknote size={12}/> Hình thức nhận trợ cấp</label>
                    <select 
                      value={currentMedal.HinhThucNhan || 'Tiền mặt'} 
                      onChange={e => setCurrentMedal({...currentMedal, HinhThucNhan: e.target.value as any})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-emerald-700"
                    >
                      <option value="Tiền mặt">Tiền mặt</option>
                      <option value="Chuyển khoản">Chuyển khoản</option>
                    </select>
                  </div>

                  {currentMedal.HinhThucNhan === 'Chuyển khoản' && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-blue-100 rounded-xl animation-slide-down">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Ngân hàng</label>
                        <select 
                          value={currentMedal.NganHang || ''} 
                          onChange={e => setCurrentMedal({...currentMedal, NganHang: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">-- Chọn ngân hàng --</option>
                          {banks.map(bank => <option key={bank.id} value={bank.shortName}>{bank.shortName} - {bank.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Số tài khoản</label>
                        <input 
                          value={currentMedal.SoTaiKhoan || ''} 
                          onChange={e => setCurrentMedal({...currentMedal, SoTaiKhoan: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                          placeholder="Nhập số tài khoản..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tên chủ tài khoản</label>
                        <input 
                          value={currentMedal.ChuTaiKhoan || ''} 
                          onChange={e => setCurrentMedal({...currentMedal, ChuTaiKhoan: e.target.value.toUpperCase()})}
                          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold uppercase"
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-span-full space-y-1">
                    <label className="text-xs font-bold text-slate-600">Ghi chú</label>
                    <textarea 
                      value={currentMedal.GhiChu || ''} 
                      onChange={e => setCurrentMedal({...currentMedal, GhiChu: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm h-20 resize-none" 
                      placeholder="Nhập ghi chú thêm..." 
                    />
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={handleAddToList}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${editingTempIndex !== null ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {editingTempIndex !== null ? <Save size={16} /> : <Plus size={16} />} 
                      {editingTempIndex !== null ? 'Cập nhật dòng' : 'Thêm vào danh sách chờ'}
                    </button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <List size={14} className="text-amber-600" /> Danh sách đang chờ lưu ({medalsList.length})
                  </label>
                  <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-bold uppercase text-slate-400">
                          <th className="px-4 py-3 text-center w-12">STT</th>
                          <th className="px-4 py-3">Họ tên người nhận</th>
                          <th className="px-4 py-3">Nhận trợ cấp</th>
                          <th className="px-4 py-3 text-center">Người nhận thay</th>
                          <th className="px-4 py-3 text-right">Số tiền</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {medalsList.length > 0 ? (
                          medalsList.map((m, idx) => (
                            <tr key={idx} className={`hover:bg-slate-50 group transition-colors ${editingTempIndex === idx ? 'bg-orange-50/50' : ''}`}>
                              <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 font-bold text-slate-700">{m.HoTen} <span className="text-[10px] font-normal text-slate-400">({m.QuanHe})</span></td>
                              <td className="px-4 py-3">
                                 {m.HinhThucNhan === 'Chuyển khoản' ? (
                                  <div className="flex flex-col">
                                    <span className="text-blue-600 font-bold flex items-center gap-1"><CreditCard size={10}/> CK</span>
                                    <span className="text-[9px] text-slate-400 font-mono">{m.SoTaiKhoan}</span>
                                  </div>
                                ) : (
                                  <span className="text-emerald-600 font-bold flex items-center gap-1"><Banknote size={10}/> Tiền mặt</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {m.NguoiNhanThay ? <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">{m.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400">Chính chủ</span>}
                              </td>
                              <td className="px-4 py-3 text-right font-black text-emerald-600">{(m.SoTien || 0).toLocaleString()}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => handleEditTemp(idx)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => removeFromList(idx)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic text-xs">Chưa có hồ sơ nào được thêm</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors">Hủy</button>
          <button 
            onClick={handleSaveAll}
            disabled={!selectedHouseId || (!isEditing && medalsList.length === 0)}
            className={`px-8 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95 font-bold ${(!selectedHouseId || (!isEditing && medalsList.length === 0)) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white transform hover:scale-105'}`}
          >
            <Save size={18} /> {isEditing ? 'Cập nhật' : 'Lưu tất cả hồ sơ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedalForm;
