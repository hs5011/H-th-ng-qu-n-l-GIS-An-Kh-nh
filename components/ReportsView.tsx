
import React, { useState, useMemo } from 'react';
import { 
  HouseNumberRecord, PublicLandRecord, GeneralRecord, 
  MeritRecord, MedalRecord, PolicyRecord, SocialProtectionRecord,
  Street, Neighborhood, RelationshipType, GeneralStatus, MeritType, MedalType, PolicyType, SocialProtectionType, Bank
} from '../types';
import { 
  BarChart3, Download, Calendar, Filter, Home, 
  Landmark, ShieldAlert, Heart, Award, ShieldCheck, HandHeart,
  FileSpreadsheet, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, ArrowLeft, Wallet, TrendingUp, Edit, Users, MapPin
} from 'lucide-react';

// Import Forms
import HouseForm from './HouseForm';
import PublicLandForm from './PublicLandForm';
import GeneralForm from './GeneralForm';
import MeritForm from './MeritForm';
import MedalForm from './MedalForm';
import PolicyForm from './PolicyForm';
import SocialProtectionForm from './SocialProtectionForm';

interface ReportsViewProps {
  records: HouseNumberRecord[];
  publicLands: PublicLandRecord[];
  generals: GeneralRecord[];
  merits: MeritRecord[];
  medals: MedalRecord[];
  policies: PolicyRecord[];
  socialProtections: SocialProtectionRecord[];
  
  // Danh mục lookup
  streets: Street[];
  neighborhoods: Neighborhood[];
  relationships: RelationshipType[];
  generalStatuses: GeneralStatus[];
  meritTypes: MeritType[];
  medalTypes: MedalType[];
  policyTypes: PolicyType[];
  socialProtectionTypes: SocialProtectionType[];
  banks: Bank[];

  // Hàm cập nhật
  onUpdateHouse: (data: Partial<HouseNumberRecord>) => void;
  onUpdateLand: (data: Partial<PublicLandRecord>) => void;
  onUpdateGeneral: (dataList: Partial<GeneralRecord>[]) => void;
  onUpdateMerit: (dataList: Partial<MeritRecord>[]) => void;
  onUpdateMedal: (dataList: Partial<MedalRecord>[]) => void;
  onUpdatePolicy: (dataList: Partial<PolicyRecord>[]) => void;
  onUpdateSocial: (dataList: Partial<SocialProtectionRecord>[]) => void;
}

const ITEMS_PER_PAGE = 10;

const ReportsView: React.FC<ReportsViewProps> = ({
  records, publicLands, generals, merits, medals, policies, socialProtections,
  streets, neighborhoods, relationships, generalStatuses, meritTypes, medalTypes, policyTypes, socialProtectionTypes, banks,
  onUpdateHouse, onUpdateLand, onUpdateGeneral, onUpdateMerit, onUpdateMedal, onUpdatePolicy, onUpdateSocial
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  
  // State drill-down
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailSearch, setDetailSearch] = useState('');
  const [detailStatusFilter, setDetailStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('Active');
  const [currentPage, setCurrentPage] = useState(1);

  // State Form Modal
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formType, setFormType] = useState<string | null>(null);

  // Helper: Lấy địa chỉ từ ID số nhà
  const getHouseAddress = (houseId?: string) => {
    if (!houseId) return '';
    const house = records.find(h => h.id === houseId);
    if (!house) return '';
    return `${house.SoNha ? `SN ${house.SoNha} ` : ''}${house.Duong || ''}`.trim();
  };

  const filterByDateAndStatus = (list: any[], status: string) => {
    return list.filter(item => {
      const lastActivityDate = item.UpdatedAt ? new Date(item.UpdatedAt) : new Date(item.CreatedAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
      
      const matchStatus = status === 'all' || item.Status === status;
      const matchStart = !start || lastActivityDate >= start;
      const matchEnd = !end || lastActivityDate <= end;
      
      return matchStatus && matchStart && matchEnd;
    });
  };

  const stats = useMemo(() => {
    const fRecords = filterByDateAndStatus(records, reportStatusFilter);
    const fLands = filterByDateAndStatus(publicLands, reportStatusFilter);
    const fGenerals = filterByDateAndStatus(generals, reportStatusFilter);
    const fMerits = filterByDateAndStatus(merits, reportStatusFilter);
    const fMedals = filterByDateAndStatus(medals, reportStatusFilter);
    const fPolicies = filterByDateAndStatus(policies, reportStatusFilter);
    const fSocials = filterByDateAndStatus(socialProtections, reportStatusFilter);

    const totalBudget = fMerits.reduce((acc, m) => acc + (m.SoTien || 0), 0) +
                        fMedals.reduce((acc, m) => acc + (m.SoTien || 0), 0) +
                        fPolicies.reduce((acc, p) => acc + (p.SoTien || 0), 0) +
                        fSocials.reduce((acc, s) => acc + (s.SoTien || 0), 0);

    return {
      house: { total: fRecords.length, active: fRecords.filter(r => r.Status === 'Active').length, data: fRecords },
      land: { total: fLands.length, area: fLands.reduce((acc, l) => acc + (l.Dientich || 0), 0), data: fLands },
      general: { total: fGenerals.length, dienTW: fGenerals.filter(g => g.Dien === 'TW').length, data: fGenerals },
      merit: { total: fMerits.length, budget: fMerits.reduce((acc, m) => acc + (m.SoTien || 0), 0), data: fMerits },
      medal: { total: fMedals.length, budget: fMedals.reduce((acc, m) => acc + (m.SoTien || 0), 0), data: fMedals },
      policy: { total: fPolicies.length, budget: fPolicies.reduce((acc, p) => acc + (p.SoTien || 0), 0), data: fPolicies },
      social: { total: fSocials.length, budget: fSocials.reduce((acc, s) => acc + (s.SoTien || 0), 0), data: fSocials },
      totalBudget
    };
  }, [records, publicLands, generals, merits, medals, policies, socialProtections, startDate, endDate, reportStatusFilter]);

  const currentDetailData = useMemo(() => {
    if (!selectedCategory) return [];
    let source: any[] = [];
    switch(selectedCategory) {
      case 'house': source = records; break;
      case 'land': source = publicLands; break;
      case 'general': source = generals; break;
      case 'merit': source = merits; break;
      case 'medal': source = medals; break;
      case 'policy': source = policies; break;
      case 'social': source = socialProtections; break;
      default: source = [];
    }

    let filtered = source.filter(item => detailStatusFilter === 'all' || item.Status === detailStatusFilter);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
    if (start || end) {
      filtered = filtered.filter(item => {
        const d = item.UpdatedAt ? new Date(item.UpdatedAt) : new Date(item.CreatedAt);
        return (!start || d >= start) && (!end || d <= end);
      });
    }

    const s = detailSearch.toLowerCase().trim();
    if (s) {
      filtered = filtered.filter(item => 
        (item.HoTen || '').toLowerCase().includes(s) || 
        (item.TenChuHo || '').toLowerCase().includes(s) || 
        (item.SoNha || '').toLowerCase().includes(s) || 
        (item.Duong || '').toLowerCase().includes(s) || 
        (item.SoCCCD || '').includes(s) ||
        (item.SoQuanLyHS || '').toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [selectedCategory, detailStatusFilter, detailSearch, startDate, endDate, records, publicLands, generals, merits, medals, policies, socialProtections]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentDetailData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentDetailData, currentPage]);

  const handleOpenCategory = (cat: string) => {
    setSelectedCategory(cat);
    setDetailSearch('');
    setDetailStatusFilter(reportStatusFilter === 'all' ? 'Active' : reportStatusFilter);
    setCurrentPage(1);
  };

  const handleRowClick = (item: any) => {
    setEditingItem(item);
    setFormType(selectedCategory);
  };

  const closeForm = () => {
    setEditingItem(null);
    setFormType(null);
  };

  const exportToCSV = () => {
    const data = [
      ['PHÂN HỆ', 'TỔNG SỐ HỒ SƠ', 'TRẠNG THÁI/CHI TIẾT', 'KINH PHÍ/DIỆN TÍCH'],
      ['Số nhà', stats.house.total, `${stats.house.active} đang dùng`, '-'],
      ['Đất công', stats.land.total, '-', `${stats.land.area.toLocaleString()} m2`],
      ['Tướng lĩnh', stats.general.total, `${stats.general.dienTW} diện TW`, '-'],
      ['Người có công', stats.merit.total, '-', `${stats.merit.budget.toLocaleString()} VNĐ`],
      ['Huân chương KC', stats.medal.total, '-', `${stats.medal.budget.toLocaleString()} VNĐ`],
      ['Đối tượng chính sách', stats.policy.total, '-', `${stats.policy.budget.toLocaleString()} VNĐ`],
      ['Bảo trợ xã hội', stats.social.total, '-', `${stats.social.budget.toLocaleString()} VNĐ`],
    ];

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    data.forEach(row => csvContent += row.join(",") + "\r\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_thong_ke_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedCategory) {
    const categoryInfo: any = {
      house: { label: 'Quản lý Số nhà', icon: <Home size={20}/>, color: 'blue' },
      land: { label: 'Thửa đất công', icon: <Landmark size={20}/>, color: 'amber' },
      general: { label: 'Diện Tướng lĩnh', icon: <ShieldAlert size={20}/>, color: 'indigo' },
      merit: { label: 'Người có công', icon: <Heart size={20}/>, color: 'rose' },
      medal: { label: 'Huân chương KC', icon: <Award size={20}/>, color: 'orange' },
      policy: { label: 'Đối tượng chính sách', icon: <ShieldCheck size={20}/>, color: 'blue' },
      social: { label: 'Bảo trợ xã hội', icon: <HandHeart size={20}/>, color: 'emerald' },
    }[selectedCategory];

    return (
      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6 bg-slate-50/50">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-slate-200 text-slate-500"><ArrowLeft size={24} /></button>
            <div>
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {categoryInfo.icon} Danh sách {categoryInfo.label}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kết quả: {currentDetailData.length} hồ sơ (Click dòng để xem/sửa)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-80 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-sm w-full font-medium" value={detailSearch} onChange={(e) => { setDetailSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex border rounded-xl overflow-hidden bg-white shadow-sm h-10">
               <button onClick={() => setDetailStatusFilter('Active')} className={`px-4 text-[10px] font-black uppercase transition-all ${detailStatusFilter === 'Active' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Đang dùng</button>
               <button onClick={() => setDetailStatusFilter('Inactive')} className={`px-4 text-[10px] font-black uppercase transition-all ${detailStatusFilter === 'Inactive' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Đã xóa</button>
               <button onClick={() => setDetailStatusFilter('all')} className={`px-4 text-[10px] font-black uppercase transition-all ${detailStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>Tất cả</button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {selectedCategory === 'house' && (<><th className="px-6 py-4">Chủ hộ & CCCD</th><th className="px-6 py-4">Địa chỉ số nhà</th><th className="px-6 py-4">Tờ/Thửa</th><th className="px-6 py-4">Trạng thái</th></>)}
                  {selectedCategory === 'land' && (<><th className="px-6 py-4">Vị trí & Số nhà</th><th className="px-6 py-4">Đơn vị Quản lý / Sử dụng</th><th className="px-6 py-4">Diện tích (m²)</th><th className="px-6 py-4">Hiện trạng</th></>)}
                  {selectedCategory === 'general' && (<><th className="px-6 py-4">Tướng lĩnh & Địa chỉ</th><th className="px-6 py-4">Quan hệ</th><th className="px-6 py-4">Diện</th><th className="px-6 py-4">Tình trạng</th><th className="px-6 py-4 text-center">Người nhận thay</th></>)}
                  {(['merit', 'medal', 'policy', 'social'].includes(selectedCategory)) && (<><th className="px-6 py-4">Đối tượng & Địa chỉ</th><th className="px-6 py-4">Quan hệ</th><th className="px-6 py-4">Phân loại</th><th className="px-6 py-4 text-center">Người nhận thay</th><th className="px-6 py-4 text-right">Mức trợ cấp (đ)</th></>)}
                  <th className="px-6 py-4 text-right">#</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? paginatedData.map((item: any, idx: number) => (
                  <tr key={idx} onClick={() => handleRowClick(item)} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                    {selectedCategory === 'house' && (
                      <><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{item.TenChuHo?.charAt(0)}</div><div><p className="font-bold text-slate-800">{item.TenChuHo}</p><p className="text-[10px] text-slate-400">CCCD: {item.SoCCCD}</p></div></div></td><td className="px-6 py-4"><p className="font-semibold text-slate-700">{item.SoNha ? `SN ${item.SoNha} ` : ''}{item.Duong}</p><p className="text-[10px] text-slate-400 italic">{item.KDC}</p></td><td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border">T{item.SoTo}-Th{item.SoThua}</span></td><td className="px-6 py-4">{item.TranhChap ? <span className="text-[10px] text-orange-600 font-bold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">Tranh chấp</span> : <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Ổn định</span>}</td></>
                    )}
                    {selectedCategory === 'land' && (
                      <><td className="px-6 py-4"><p className="text-sm font-bold text-slate-800">T{item.To} - Th{item.Thua}</p><p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(item.LinkedHouseId)}</p></td><td className="px-6 py-4"><p className="text-sm font-semibold text-slate-700">{item.Donviquanl}</p><p className="text-[10px] text-slate-400">Sử dụng: {item.Donvisudun}</p></td><td className="px-6 py-4 font-mono text-sm">{(item.Dientich || 0).toLocaleString()}</td><td className="px-6 py-4 text-xs font-medium text-slate-600">{item.Hientrang}</td></>
                    )}
                    {selectedCategory === 'general' && (
                      <><td className="px-6 py-4"><p className="text-sm font-bold text-slate-800">{item.HoTen}</p><p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(item.LinkedHouseId)}</p></td><td className="px-6 py-4"><span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{item.QuanHe}</span></td><td className="px-6 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.Dien === 'TW' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{item.Dien}</span></td><td className="px-6 py-4 text-xs font-semibold text-slate-700">{item.TinhTrang}</td><td className="px-6 py-4 text-center">{item.NguoiNhanThay ? <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{item.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}</td></>
                    )}
                    {['merit', 'medal', 'policy', 'social'].includes(selectedCategory) && (
                      <><td className="px-6 py-4"><p className="text-sm font-bold text-slate-800">{item.HoTen}</p><p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(item.LinkedHouseId)}</p></td><td className="px-6 py-4"><span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{item.QuanHe}</span></td><td className="px-6 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border bg-${categoryInfo.color}-50 text-${categoryInfo.color}-700 border-${categoryInfo.color}-100`}>{item.LoaiDoiTuong || item.LoaiDien || item.LoaiDienChinhSach}</span></td><td className="px-6 py-4 text-center">{item.NguoiNhanThay ? <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{item.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}</td><td className="px-6 py-4 text-right font-black text-emerald-600">{(item.SoTien || 0).toLocaleString()}</td></>
                    )}
                    <td className="px-6 py-4 text-right">
                       <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Edit size={14}/></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={10} className="px-6 py-20 text-center text-slate-400 italic">Không tìm thấy dữ liệu phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination totalItems={currentDetailData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>

        {/* Modal Forms tương ứng */}
        {formType === 'house' && editingItem && (
          <HouseForm initialData={editingItem} isEditing streets={streets} neighborhoods={neighborhoods} relationshipTypes={relationships} onSubmit={(data) => { onUpdateHouse(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'land' && editingItem && (
          <PublicLandForm initialData={editingItem} isEditing houseRecords={records} onSubmit={(data) => { onUpdateLand(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'general' && editingItem && (
          <GeneralForm initialData={editingItem} isEditing houseRecords={records} relationshipTypes={relationships} generalStatuses={generalStatuses} banks={banks} onSubmit={(data) => { onUpdateGeneral(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'merit' && editingItem && (
          <MeritForm initialData={editingItem} isEditing houseRecords={records} relationshipTypes={relationships} meritTypes={meritTypes} banks={banks} onSubmit={(data) => { onUpdateMerit(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'medal' && editingItem && (
          <MedalForm initialData={editingItem} isEditing houseRecords={records} relationshipTypes={relationships} medalTypes={medalTypes} banks={banks} onSubmit={(data) => { onUpdateMedal(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'policy' && editingItem && (
          <PolicyForm initialData={editingItem} isEditing houseRecords={records} relationshipTypes={relationships} policyTypes={policyTypes} banks={banks} onSubmit={(data) => { onUpdatePolicy(data); closeForm(); }} onClose={closeForm} />
        )}
        {formType === 'social' && editingItem && (
          <SocialProtectionForm initialData={editingItem} isEditing houseRecords={records} relationshipTypes={relationships} protectionTypes={socialProtectionTypes} banks={banks} onSubmit={(data) => { onUpdateSocial(data); closeForm(); }} onClose={closeForm} />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-8 custom-scrollbar bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2"><BarChart3 className="text-blue-600" size={28} /> Thống kê & Báo cáo tổng hợp</h2>
          <p className="text-sm text-slate-500 font-medium italic">Tiêu chí: Ngày thêm mới hoặc cập nhật dữ liệu cuối cùng</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 shrink-0"><Download size={18} /> Xuất báo cáo Excel</button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Từ ngày biến động</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" /></div>
        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Đến ngày biến động</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" /></div>
        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Filter size={12}/> Trạng thái hồ sơ</label><select value={reportStatusFilter} onChange={e => setReportStatusFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"><option value="all">Tất cả hồ sơ</option><option value="Active">Đang hoạt động</option><option value="Inactive">Đã ngưng sử dụng</option></select></div>
        <div className="flex items-end gap-2"><button onClick={() => { setStartDate(''); setEndDate(''); setReportStatusFilter('all'); }} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline pb-3 transition-colors">Xóa bộ lọc</button></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <ReportCard icon={<Home />} label="Tổng số nhà" value={stats.house.total} subValue={`${stats.house.active} hồ sơ có tác động`} color="blue" onClick={() => handleOpenCategory('house')} />
        <ReportCard icon={<Landmark />} label="Thửa đất công" value={stats.land.total} subValue={`${stats.land.area.toLocaleString()} m2 tổng diện tích`} color="amber" onClick={() => handleOpenCategory('land')} />
        <ReportCard icon={<ShieldAlert />} label="Tướng lĩnh" value={stats.general.total} subValue={`${stats.general.dienTW} diện TW được ghi nhận`} color="indigo" onClick={() => handleOpenCategory('general')} />
        <ReportCard icon={<Heart />} label="Người có công" value={stats.merit.total} subValue={`${stats.merit.budget.toLocaleString()} VNĐ trợ cấp`} color="rose" onClick={() => handleOpenCategory('merit')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <ReportCard icon={<Award />} label="Huân chương KC" value={stats.medal.total} subValue={`${stats.medal.budget.toLocaleString()} VNĐ kinh phí`} color="orange" onClick={() => handleOpenCategory('medal')} />
        <ReportCard icon={<ShieldCheck />} label="Đối tượng chính sách" value={stats.policy.total} subValue={`${stats.policy.budget.toLocaleString()} VNĐ chi trả`} color="blue" onClick={() => handleOpenCategory('policy')} />
        <ReportCard icon={<HandHeart />} label="Bảo trợ xã hội" value={stats.social.total} subValue={`${stats.social.budget.toLocaleString()} VNĐ định kỳ`} color="emerald" onClick={() => handleOpenCategory('social')} />
        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-default">
          <div className="flex justify-between items-start"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng kinh phí chi trả trợ cấp</p><TrendingUp size={24} className="text-emerald-400" /></div>
          <div className="mt-4"><p className="text-4xl font-black text-white">{stats.totalBudget.toLocaleString()}</p><p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-wider">Việt Nam Đồng (VNĐ)</p></div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span className="text-[10px] font-bold text-slate-400 uppercase">Dữ liệu cập nhật {new Date().toLocaleDateString('vi-VN')}</span></div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between"><div className="flex items-center gap-2"><FileSpreadsheet size={18} className="text-blue-600" /><h3 className="font-bold text-slate-800">Chi tiết theo danh mục diện quản lý</h3></div><div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><Clock size={12} /> Căn cứ trên ngày cập nhật cuối cùng (Click từng dòng để xem chi tiết)</div></div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead><tr className="border-b bg-slate-50/30"><th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phân hệ quản lý</th><th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hồ sơ phát sinh</th><th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chi tiết điểm nhấn</th><th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tổng kinh phí/Diện tích</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              <DetailRow label="Quản lý Số nhà" icon={<Home size={14}/>} count={stats.house.total} detail={`${stats.house.active} hồ sơ có biến động`} meta="-" color="blue" onClick={() => handleOpenCategory('house')} />
              <DetailRow label="Thửa đất công" icon={<Landmark size={14}/>} count={stats.land.total} detail="Đất trống & Đang khai thác" meta={`${stats.land.area.toLocaleString()} m2`} color="amber" onClick={() => handleOpenCategory('land')} />
              <DetailRow label="Diện Tướng lĩnh" icon={<ShieldAlert size={14}/>} count={stats.general.total} detail={`${stats.general.dienTW} hồ sơ diện Trung ương`} meta="-" color="indigo" onClick={() => handleOpenCategory('general')} />
              <DetailRow label="Người có công" icon={<Heart size={14}/>} count={stats.merit.total} detail="Ưu đãi & Trợ cấp hàng tháng" meta={`${stats.merit.budget.toLocaleString()} đ`} color="rose" onClick={() => handleOpenCategory('merit')} />
              <DetailRow label="Huân chương kháng chiến" icon={<Award size={14}/>} count={stats.medal.total} detail="Đối tượng khen thưởng" meta={`${stats.medal.budget.toLocaleString()} đ`} color="orange" onClick={() => handleOpenCategory('medal')} />
              <DetailRow label="Đối tượng chính sách" icon={<ShieldCheck size={14}/>} count={stats.policy.total} detail="Thương bệnh binh, nhiễm chất độc" meta={`${stats.policy.budget.toLocaleString()} đ`} color="blue" onClick={() => handleOpenCategory('policy')} />
              <DetailRow label="Bảo trợ xã hội" icon={<HandHeart size={14}/>} count={stats.social.total} detail="NKT, NCT, Đơn thân nghèo" meta={`${stats.social.budget.toLocaleString()} đ`} color="emerald" onClick={() => handleOpenCategory('social')} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ icon: React.ReactNode; label: string; value: number; subValue: string; color: string; onClick?: () => void }> = ({ icon, label, value, subValue, color, onClick }) => {
  const colorClasses: Record<string, string> = { blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-50', amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-50', indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-50', rose: 'text-rose-600 bg-rose-50 border-rose-100 shadow-rose-50', orange: 'text-orange-600 bg-orange-50 border-orange-100 shadow-orange-50', emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-50' };
  return (
    <div onClick={onClick} className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all hover:-translate-y-1 min-h-[160px] cursor-pointer group`}>
      <div className="flex items-center justify-between"><div className={`p-3 rounded-2xl ${colorClasses[color]} transition-colors group-hover:bg-slate-900 group-hover:text-white`}>{icon}</div><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p><p className="text-3xl font-black text-slate-800">{value.toLocaleString()}</p></div></div>
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto"><span className="text-[11px] font-bold text-slate-500 italic">{subValue}</span></div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; icon: React.ReactNode; count: number; detail: string; meta: string; color: string; onClick: () => void }> = ({ label, icon, count, detail, meta, color, onClick }) => {
  const themeClasses: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', amber: 'bg-amber-50 text-amber-600', indigo: 'bg-indigo-50 text-indigo-600', rose: 'bg-rose-50 text-rose-600', orange: 'bg-orange-50 text-orange-600', emerald: 'bg-emerald-50 text-emerald-600' };
  return (<tr onClick={onClick} className="hover:bg-blue-50/50 transition-colors cursor-pointer group"><td className="px-6 py-5"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${themeClasses[color]}`}>{icon}</div><span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{label}</span></div></td><td className="px-6 py-5 font-black text-slate-600 text-center">{count.toLocaleString()}</td><td className="px-6 py-5 text-xs font-medium text-slate-500 italic">{detail}</td><td className="px-6 py-5 text-right font-black text-slate-800">{meta}</td></tr>);
};

const Pagination: React.FC<{ totalItems: number; currentPage: number; onPageChange: (page: number) => void }> = ({ totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;
  return (<div className="px-6 py-3 border-t bg-slate-50/50 flex items-center justify-between shrink-0"><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HIỂN THỊ {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} / {totalItems} KẾT QUẢ</div><div className="flex items-center gap-1"><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"><ChevronLeft size={14} className="text-slate-600" /></button>{Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const page = i + 1; return (<button key={page} onClick={() => onPageChange(page)} className={`flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-black transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>); })}<button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"><ChevronRight size={14} className="text-slate-600" /></button></div></div>);
};

export default ReportsView;
