
import React, { useState, useMemo } from 'react';
import { 
  HouseNumberRecord, PublicLandRecord, GeneralRecord, 
  MeritRecord, MedalRecord, PolicyRecord, SocialProtectionRecord 
} from '../types';
import { 
  BarChart3, Download, Calendar, Filter, Home, 
  Landmark, ShieldAlert, Heart, Award, ShieldCheck, HandHeart,
  FileSpreadsheet, CheckCircle, Clock
} from 'lucide-react';

interface ReportsViewProps {
  records: HouseNumberRecord[];
  publicLands: PublicLandRecord[];
  generals: GeneralRecord[];
  merits: MeritRecord[];
  medals: MedalRecord[];
  policies: PolicyRecord[];
  socialProtections: SocialProtectionRecord[];
}

const ReportsView: React.FC<ReportsViewProps> = ({
  records, publicLands, generals, merits, medals, policies, socialProtections
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Logic lọc mới: Ưu tiên ngày cập nhật cuối cùng
  const filterByDateAndStatus = (list: any[]) => {
    return list.filter(item => {
      // Lấy mốc thời gian cuối cùng mà hồ sơ được ghi nhận (Cập nhật hoặc Tạo mới)
      const lastActivityDate = item.UpdatedAt ? new Date(item.UpdatedAt) : new Date(item.CreatedAt);
      
      const start = startDate ? new Date(startDate) : null;
      // Đặt giờ kết thúc là cuối ngày (23:59:59) để bao gồm cả dữ liệu trong ngày đó
      const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
      
      const matchStatus = statusFilter === 'all' || item.Status === statusFilter;
      const matchStart = !start || lastActivityDate >= start;
      const matchEnd = !end || lastActivityDate <= end;
      
      return matchStatus && matchStart && matchEnd;
    });
  };

  const stats = useMemo(() => {
    const fRecords = filterByDateAndStatus(records);
    const fLands = filterByDateAndStatus(publicLands);
    const fGenerals = filterByDateAndStatus(generals);
    const fMerits = filterByDateAndStatus(merits);
    const fMedals = filterByDateAndStatus(medals);
    const fPolicies = filterByDateAndStatus(policies);
    const fSocials = filterByDateAndStatus(socialProtections);

    return {
      house: { total: fRecords.length, active: fRecords.filter(r => r.Status === 'Active').length },
      land: { total: fLands.length, area: fLands.reduce((acc, l) => acc + (l.Dientich || 0), 0) },
      general: { total: fGenerals.length, dienTW: fGenerals.filter(g => g.Dien === 'TW').length },
      merit: { total: fMerits.length, budget: fMerits.reduce((acc, m) => acc + (m.SoTien || 0), 0) },
      medal: { total: fMedals.length, budget: fMedals.reduce((acc, m) => acc + (m.SoTien || 0), 0) },
      policy: { total: fPolicies.length, budget: fPolicies.reduce((acc, p) => acc + (p.SoTien || 0), 0) },
      social: { total: fSocials.length, budget: fSocials.reduce((acc, s) => acc + (s.SoTien || 0), 0) },
    };
  }, [records, publicLands, generals, merits, medals, policies, socialProtections, startDate, endDate, statusFilter]);

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
    data.forEach(row => {
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_thong_ke_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-8 custom-scrollbar">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={28} /> Thống kê & Báo cáo tổng hợp
          </h2>
          <p className="text-sm text-slate-500 font-medium italic">Tiêu chí: Ngày thêm mới hoặc cập nhật dữ liệu cuối cùng</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 shrink-0"
        >
          <Download size={18} /> Xuất báo cáo Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Từ ngày biến động</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Đến ngày biến động</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Filter size={12}/> Trạng thái hồ sơ</label>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
          >
            <option value="all">Tất cả hồ sơ</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Đã ngưng sử dụng</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter('all'); }}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 underline pb-3"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <ReportCard 
          icon={<Home />} 
          label="Tổng số nhà" 
          value={stats.house.total} 
          subValue={`${stats.house.active} hồ sơ có tác động`}
          color="blue" 
        />
        <ReportCard 
          icon={<Landmark />} 
          label="Thửa đất công" 
          value={stats.land.total} 
          subValue={`${stats.land.area.toLocaleString()} m2 tổng diện tích`}
          color="amber" 
        />
        <ReportCard 
          icon={<ShieldAlert />} 
          label="Tướng lĩnh" 
          value={stats.general.total} 
          subValue={`${stats.general.dienTW} diện TW được ghi nhận`}
          color="indigo" 
        />
        <ReportCard 
          icon={<Heart />} 
          label="Người có công" 
          value={stats.merit.total} 
          subValue={`${stats.merit.budget.toLocaleString()} VNĐ trợ cấp`}
          color="rose" 
        />
        <ReportCard 
          icon={<Award />} 
          label="Huân chương KC" 
          value={stats.medal.total} 
          subValue={`${stats.medal.budget.toLocaleString()} VNĐ kinh phí`}
          color="orange" 
        />
        <ReportCard 
          icon={<ShieldCheck />} 
          label="Đối tượng chính sách" 
          value={stats.policy.total} 
          subValue={`${stats.policy.budget.toLocaleString()} VNĐ chi trả`}
          color="blue" 
        />
        <ReportCard 
          icon={<HandHeart />} 
          label="Bảo trợ xã hội" 
          value={stats.social.total} 
          subValue={`${stats.social.budget.toLocaleString()} VNĐ định kỳ`}
          color="emerald" 
        />
        
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-white overflow-hidden relative group shrink-0 min-h-[160px]">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <BarChart3 size={100} />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tổng kinh phí chi trả trợ cấp</p>
             <p className="text-3xl font-black">
               {(stats.merit.budget + stats.medal.budget + stats.policy.budget + stats.social.budget).toLocaleString()}
             </p>
             <p className="text-xs font-bold text-emerald-400 mt-1">Việt Nam Đồng (VNĐ)</p>
           </div>
           <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400">
             <CheckCircle size={14} className="text-emerald-500" /> Dữ liệu cập nhật {new Date().toLocaleDateString()}
           </div>
        </div>
      </div>
      
      {/* Detailed Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Chi tiết theo danh mục diện quản lý</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
            <Clock size={12} /> Căn cứ trên ngày cập nhật cuối cùng
          </div>
        </div>
        <div className="w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b bg-slate-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phân hệ quản lý</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hồ sơ phát sinh</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chi tiết điểm nhấn</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tổng kinh phí/Diện tích</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <DetailRow label="Quản lý Số nhà" icon={<Home size={14}/>} count={stats.house.total} detail={`${stats.house.active} hồ sơ có biến động`} meta="-" color="blue" />
              <DetailRow label="Thửa đất công" icon={<Landmark size={14}/>} count={stats.land.total} detail="Đất trống & Đang khai thác" meta={`${stats.land.area.toLocaleString()} m2`} color="amber" />
              <DetailRow label="Diện Tướng lĩnh" icon={<ShieldAlert size={14}/>} count={stats.general.total} detail={`${stats.general.dienTW} hồ sơ diện Trung ương`} meta="-" color="indigo" />
              <DetailRow label="Người có công" icon={<Heart size={14}/>} count={stats.merit.total} detail="Ưu đãi & Trợ cấp hàng tháng" meta={`${stats.merit.budget.toLocaleString()} đ`} color="rose" />
              <DetailRow label="Huân chương kháng chiến" icon={<Award size={14}/>} count={stats.medal.total} detail="Đối tượng khen thưởng" meta={`${stats.medal.budget.toLocaleString()} đ`} color="orange" />
              <DetailRow label="Đối tượng chính sách" icon={<ShieldCheck size={14}/>} count={stats.policy.total} detail="Thương bệnh binh, nhiễm chất độc" meta={`${stats.policy.budget.toLocaleString()} đ`} color="blue" />
              <DetailRow label="Bảo trợ xã hội" icon={<HandHeart size={14}/>} count={stats.social.total} detail="NKT, NCT, Đơn thân nghèo" meta={`${stats.social.budget.toLocaleString()} đ`} color="emerald" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ icon: React.ReactNode; label: string; value: number; subValue: string; color: string }> = ({ 
  icon, label, value, subValue, color 
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-50',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-50',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-50',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 shadow-rose-50',
    orange: 'text-orange-600 bg-orange-50 border-orange-100 shadow-orange-50',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-50',
  };

  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all hover:-translate-y-1 min-h-[160px]`}>
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-slate-800">{value.toLocaleString()}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-bold text-slate-500 italic">{subValue}</span>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; icon: React.ReactNode; count: number; detail: string; meta: string; color: string }> = ({
  label, icon, count, detail, meta, color
}) => {
  const themeClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${themeClasses[color]}`}>{icon}</div>
          <span className="font-bold text-slate-700">{label}</span>
        </div>
      </td>
      <td className="px-6 py-5 font-black text-slate-600 text-center">{count.toLocaleString()}</td>
      <td className="px-6 py-5 text-xs font-medium text-slate-500 italic">{detail}</td>
      <td className="px-6 py-5 text-right font-black text-slate-800">{meta}</td>
    </tr>
  );
};

export default ReportsView;
