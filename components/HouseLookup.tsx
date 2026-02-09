
import React, { useState, useMemo } from 'react';
import { 
  HouseNumberRecord, GeneralRecord, MeritRecord, MedalRecord, 
  PolicyRecord, SocialProtectionRecord 
} from '../types';
import { 
  Search, Home, ShieldAlert, Heart, Award, 
  ShieldCheck, HandHeart, Users, MapPin, ChevronRight, 
  FileText, Wallet
} from 'lucide-react';

interface HouseLookupProps {
  houses: HouseNumberRecord[];
  generals: GeneralRecord[];
  merits: MeritRecord[];
  medals: MedalRecord[];
  policies: PolicyRecord[];
  socialProtections: SocialProtectionRecord[];
}

const HouseLookup: React.FC<HouseLookupProps> = ({ 
  houses, generals, merits, medals, policies, socialProtections 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);

  const filteredHouses = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return houses.filter(h => 
      (h.SoNha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.Duong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.TenChuHo || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [searchTerm, houses]);

  const selectedHouse = useMemo(() => 
    houses.find(h => h.id === selectedHouseId), 
  [selectedHouseId, houses]);

  const relatedData = useMemo(() => {
    if (!selectedHouseId) return null;
    return {
      generals: generals.filter(g => g.LinkedHouseId === selectedHouseId && g.Status === 'Active'),
      merits: merits.filter(m => m.LinkedHouseId === selectedHouseId && m.Status === 'Active'),
      medals: medals.filter(m => m.LinkedHouseId === selectedHouseId && m.Status === 'Active'),
      policies: policies.filter(p => p.LinkedHouseId === selectedHouseId && p.Status === 'Active'),
      socials: socialProtections.filter(s => s.LinkedHouseId === selectedHouseId && s.Status === 'Active'),
    };
  }, [selectedHouseId, generals, merits, medals, policies, socialProtections]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Search size={22} className="text-blue-600" /> Tra cứu tổng hợp theo Số nhà
        </h2>
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Home size={20} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Nhập số nhà, tên đường hoặc tên chủ hộ để tìm kiếm..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && !selectedHouseId && filteredHouses.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-2 bg-white border rounded-xl shadow-xl overflow-hidden divide-y">
              {filteredHouses.map(h => (
                <button 
                  key={h.id}
                  onClick={() => { setSelectedHouseId(h.id); setSearchTerm(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-blue-50 flex items-center justify-between group"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">SN {h.SoNha} {h.Duong}</p>
                    <p className="text-xs text-slate-500">Chủ hộ: {h.TenChuHo} | CCCD: {h.SoCCCD}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedHouse ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-6">
          {/* House Info Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <Home size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">SN {selectedHouse.SoNha} {selectedHouse.Duong}</h3>
                  <div className="flex items-center gap-4 mt-1 opacity-90 text-sm font-medium">
                    <span className="flex items-center gap-1"><Users size={14} /> Chủ hộ: {selectedHouse.TenChuHo}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedHouse.KDC}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHouseId(null)}
                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all"
              >
                Chọn số nhà khác
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatBox label="Tướng lĩnh" count={relatedData?.generals.length || 0} icon={<ShieldAlert className="text-indigo-600" />} color="indigo" />
            <StatBox label="Người có công" count={relatedData?.merits.length || 0} icon={<Heart className="text-rose-600" />} color="rose" />
            <StatBox label="Huân chương KC" count={relatedData?.medals.length || 0} icon={<Award className="text-amber-600" />} color="amber" />
            <StatBox label="Chính sách" count={relatedData?.policies.length || 0} icon={<ShieldCheck className="text-blue-600" />} color="blue" />
            <StatBox label="Bảo trợ XH" count={relatedData?.socials.length || 0} icon={<HandHeart className="text-emerald-600" />} color="emerald" />
          </div>

          {/* Details Tables */}
          <div className="space-y-8">
            <ListSection title="Danh sách Tướng lĩnh" icon={<ShieldAlert size={18} className="text-indigo-600" />} data={relatedData?.generals || []} columns={['HoTen', 'QuanHe', 'Dien', 'TinhTrang']} />
            <ListSection title="Danh sách Người có công" icon={<Heart size={18} className="text-rose-600" />} data={relatedData?.merits || []} columns={['HoTen', 'QuanHe', 'LoaiDoiTuong', 'SoTien']} />
            <ListSection title="Danh sách Huân chương KC" icon={<Award size={18} className="text-amber-600" />} data={relatedData?.medals || []} columns={['HoTen', 'QuanHe', 'LoaiDoiTuong', 'SoTien']} />
            <ListSection title="Danh sách Đối tượng chính sách" icon={<ShieldCheck size={18} className="text-blue-600" />} data={relatedData?.policies || []} columns={['HoTen', 'QuanHe', 'LoaiDienChinhSach', 'SoTien']} />
            <ListSection title="Danh sách Đối tượng bảo trợ" icon={<HandHeart size={18} className="text-emerald-600" />} data={relatedData?.socials || []} columns={['HoTen', 'QuanHe', 'LoaiDien', 'SoTien']} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 italic py-20">
          <div className="p-8 rounded-full bg-slate-200 mb-4">
            <Search size={64} />
          </div>
          <p className="text-lg font-medium">Vui lòng tìm kiếm và chọn một số nhà để xem dữ liệu tổng hợp</p>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ label: string; count: number; icon: React.ReactNode; color: string }> = ({ label, count, icon, color }) => (
  <div className={`bg-white p-4 rounded-2xl border-l-4 border-${color}-500 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform`}>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800">{count}</p>
    </div>
    <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center`}>
      {icon}
    </div>
  </div>
);

const ListSection: React.FC<{ title: string; icon: React.ReactNode; data: any[]; columns: string[] }> = ({ title, icon, data, columns }) => {
  if (data.length === 0) return null;

  const getColLabel = (col: string) => {
    switch(col) {
      case 'HoTen': return 'Họ và tên';
      case 'QuanHe': return 'Quan hệ chủ hộ';
      case 'Dien': return 'Diện';
      case 'TinhTrang': return 'Tình trạng';
      case 'LoaiDoiTuong': return 'Loại đối tượng';
      case 'LoaiDienChinhSach': return 'Diện chính sách';
      case 'LoaiDien': return 'Diện bảo trợ';
      case 'SoTien': return 'Mức trợ cấp (VNĐ)';
      default: return col;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2">
        {icon}
        <h4 className="font-bold text-slate-800">{title}</h4>
        <span className="px-2 py-0.5 bg-white border rounded-full text-[10px] font-black text-slate-500">{data.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b">
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {getColLabel(col)}
                </th>
              ))}
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Người nhận thay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-6 py-4">
                    {col === 'SoTien' ? (
                      <span className="font-black text-emerald-600">{(item[col] || 0).toLocaleString()}</span>
                    ) : col === 'Dien' ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item[col] === 'TW' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{item[col]}</span>
                    ) : (
                      <span className={col === 'HoTen' ? 'font-bold text-slate-700' : 'text-slate-600'}>{item[col] || '--'}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  {item.NguoiNhanThay ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg text-blue-700 font-bold text-[10px]">
                       <Users size={10} /> {item.NguoiNhanThay}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">Chính chủ</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HouseLookup;
