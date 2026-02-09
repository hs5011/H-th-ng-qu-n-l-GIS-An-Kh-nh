
import React, { useState, useMemo } from 'react';
import { GeneralRecord, HouseNumberRecord, RelationshipType, GeneralStatus } from '../types';
import { X, Save, Search, CheckCircle2, User, Building, Plus, Trash2, List, UserCog, Edit, RotateCcw } from 'lucide-react';

interface GeneralFormProps {
  initialData?: Partial<GeneralRecord>;
  onSubmit: (data: Partial<GeneralRecord>[]) => void;
  onClose: () => void;
  isEditing?: boolean;
  houseRecords: HouseNumberRecord[];
  relationshipTypes: RelationshipType[];
  generalStatuses: GeneralStatus[];
}

const GeneralForm: React.FC<GeneralFormProps> = ({ 
  initialData, 
  onSubmit, 
  onClose, 
  isEditing, 
  houseRecords,
  relationshipTypes,
  generalStatuses
}) => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | undefined>(initialData?.LinkedHouseId);
  const [houseSearch, setHouseSearch] = useState('');
  const [editingTempIndex, setEditingTempIndex] = useState<number | null>(null);
  
  const [generalsList, setGeneralsList] = useState<Partial<GeneralRecord>[]>(
    isEditing && initialData ? [initialData] : []
  );

  const [currentGeneral, setCurrentGeneral] = useState<Partial<GeneralRecord>>({
    Dien: 'TW',
    TinhTrang: '',
    HoTen: '',
    QuanHe: '',
    DiaChiThuongTru: '',
    NguoiNhanThay: '',
    GhiChu: ''
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
    if (!currentGeneral.HoTen) return alert('Vui lòng nhập họ tên tướng lĩnh');
    if (!currentGeneral.TinhTrang) return alert('Vui lòng chọn tình trạng');
    
    if (editingTempIndex !== null) {
      const newList = [...generalsList];
      newList[editingTempIndex] = { ...currentGeneral };
      setGeneralsList(newList);
      setEditingTempIndex(null);
    } else {
      setGeneralsList(prev => [...prev, { ...currentGeneral, id: Math.random().toString(36).substr(2, 9) }]);
    }

    setCurrentGeneral({
      Dien: 'TW',
      TinhTrang: '',
      HoTen: '',
      QuanHe: '',
      DiaChiThuongTru: '',
      NguoiNhanThay: '',
      GhiChu: ''
    });
  };

  const handleEditTemp = (index: number) => {
    setEditingTempIndex(index);
    setCurrentGeneral(generalsList[index]);
  };

  const cancelEdit = () => {
    setEditingTempIndex(null);
    setCurrentGeneral({
      Dien: 'TW',
      TinhTrang: '',
      HoTen: '',
      QuanHe: '',
      DiaChiThuongTru: '',
      NguoiNhanThay: '',
      GhiChu: ''
    });
  };

  const removeFromList = (index: number) => {
    if (editingTempIndex === index) setEditingTempIndex(null);
    setGeneralsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    if (!selectedHouseId) return alert('Vui lòng chọn số nhà liên kết');
    if (generalsList.length === 0) return alert('Vui lòng thêm ít nhất một tướng lĩnh vào danh sách');
    
    const finalData = generalsList.map(g => ({ ...g, LinkedHouseId: selectedHouseId }));
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Sửa thông tin tướng lĩnh' : 'Thêm hồ sơ tướng lĩnh'}</h2>
            <p className="text-xs text-slate-500 italic mt-1">Một số nhà có thể nhập nhiều tướng lĩnh liên quan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Building size={14} className="text-blue-600" /> 1. Chọn số nhà liên kết
            </label>
            
            {!isEditing && (
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
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Đã chọn địa chỉ</p>
                    <p className="text-sm font-black text-slate-800">{selectedHouse.SoNha} {selectedHouse.Duong}</p>
                    <p className="text-[11px] text-slate-600">Chủ hộ: {selectedHouse.TenChuHo} | Tờ/Thửa: T{selectedHouse.SoTo}/Th{selectedHouse.SoThua}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button onClick={() => { setSelectedHouseId(undefined); setGeneralsList([]); }} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50">
                <p className="text-sm text-slate-400 italic">Vui lòng chọn hồ sơ số nhà để bắt đầu nhập tướng lĩnh</p>
              </div>
            )}
          </div>

          {selectedHouseId && (
            <div className="space-y-6 border-t pt-6 animation-fade-in">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-blue-600" /> 2. Nhập thông tin tướng lĩnh
              </label>

              <div className={`p-6 rounded-2xl border transition-all ${editingTempIndex !== null ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-200' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                {editingTempIndex !== null && (
                  <div className="flex items-center justify-between bg-orange-100 px-3 py-1.5 rounded-lg mb-2">
                    <p className="text-xs font-bold text-orange-700 flex items-center gap-2"><Edit size={14} /> Đang chỉnh sửa dòng thứ {editingTempIndex + 1}</p>
                    <button onClick={cancelEdit} className="text-[10px] font-bold text-orange-600 flex items-center gap-1 hover:underline"><RotateCcw size={12}/> Hủy sửa</button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Họ và tên tướng lĩnh <span className="text-red-500">*</span></label>
                    <input 
                      value={currentGeneral.HoTen || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, HoTen: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      placeholder="Nhập họ tên..." 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Quan hệ với chủ hộ</label>
                    <select 
                      value={currentGeneral.QuanHe || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, QuanHe: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">-- Chọn quan hệ --</option>
                      {relationshipTypes.map(rel => <option key={rel.id} value={rel.name}>{rel.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Diện quản lý</label>
                    <select 
                      value={currentGeneral.Dien || 'TW'} 
                      onChange={e => setCurrentGeneral({...currentGeneral, Dien: e.target.value as any})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="TW">TW (Trung ương)</option>
                      <option value="Thành ủy">Thành ủy</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Tình trạng hiện tại <span className="text-red-500">*</span></label>
                    <select 
                      value={currentGeneral.TinhTrang || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, TinhTrang: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">-- Chọn tình trạng --</option>
                      {generalStatuses.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><UserCog size={12}/> Người nhận thay</label>
                    <select 
                      value={currentGeneral.NguoiNhanThay || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, NguoiNhanThay: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-blue-700 bg-blue-50"
                    >
                      <option value="">-- Chính chủ (không nhận thay) --</option>
                      {availableReceivers.map(rec => <option key={rec.id} value={rec.name}>{rec.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-full space-y-1">
                    <label className="text-xs font-bold text-slate-600">Địa chỉ thường trú</label>
                    <input 
                      value={currentGeneral.DiaChiThuongTru || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, DiaChiThuongTru: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      placeholder="Nhập địa chỉ..." 
                    />
                  </div>
                  <div className="col-span-full space-y-1">
                    <label className="text-xs font-bold text-slate-600">Ghi chú</label>
                    <textarea 
                      value={currentGeneral.GhiChu || ''} 
                      onChange={e => setCurrentGeneral({...currentGeneral, GhiChu: e.target.value})} 
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none" 
                      placeholder="Nhập ghi chú thêm..." 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={handleAddToList}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${editingTempIndex !== null ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {editingTempIndex !== null ? <Save size={16} /> : <Plus size={16} />} 
                    {editingTempIndex !== null ? 'Cập nhật vào danh sách' : 'Thêm vào danh sách tạm'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <List size={14} className="text-indigo-600" /> Danh sách đang chờ lưu ({generalsList.length})
                </label>
                <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b">
                      <tr className="text-[10px] font-bold uppercase text-slate-400">
                        <th className="px-4 py-3 text-center w-12">STT</th>
                        <th className="px-4 py-3">Họ và tên</th>
                        <th className="px-4 py-3">Diện</th>
                        <th className="px-4 py-3">Tình trạng</th>
                        <th className="px-4 py-3 text-center">Người nhận thay</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {generalsList.length > 0 ? (
                        generalsList.map((g, idx) => (
                          <tr key={idx} className={`hover:bg-slate-50 group transition-colors ${editingTempIndex === idx ? 'bg-orange-50/50' : ''}`}>
                            <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="px-4 py-3 font-bold text-slate-700">{g.HoTen}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.Dien === 'TW' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                {g.Dien}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-600">{g.TinhTrang}</td>
                            <td className="px-4 py-3 text-center">
                               {g.NguoiNhanThay ? <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{g.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400">Chính chủ</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => handleEditTemp(idx)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => removeFromList(idx)} className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">Chưa có tướng lĩnh nào được thêm vào danh sách</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors">Hủy</button>
          <button 
            onClick={handleSaveAll}
            disabled={!selectedHouseId || generalsList.length === 0}
            className={`px-8 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95 font-bold ${(!selectedHouseId || generalsList.length === 0) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'}`}
          >
            <Save size={18} /> {isEditing ? 'Cập nhật' : 'Lưu tất cả hồ sơ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralForm;
