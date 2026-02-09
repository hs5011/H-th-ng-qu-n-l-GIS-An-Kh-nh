
import React, { useState, useMemo } from 'react';
import { 
  HouseNumberRecord, GeneralRecord, MeritRecord, MedalRecord, 
  PolicyRecord, SocialProtectionRecord 
} from '../types';
import { 
  X, Plus, ShieldAlert, Heart, Award, 
  ShieldCheck, HandHeart, Trash2, Edit, Home, MapPin,
  Search, ChevronLeft, ChevronRight, FileSpreadsheet
} from 'lucide-react';

interface RelatedRecordsManagerProps {
  house: HouseNumberRecord;
  generals: GeneralRecord[];
  merits: MeritRecord[];
  medals: MedalRecord[];
  policies: PolicyRecord[];
  socialProtections: SocialProtectionRecord[];
  onClose: () => void;
  onAdd: (type: 'general' | 'merit' | 'medal' | 'policy' | 'social') => void;
  onEdit: (type: 'general' | 'merit' | 'medal' | 'policy' | 'social', record: any) => void;
  onDelete: (type: 'general' | 'merit' | 'medal' | 'policy' | 'social', id: string) => void;
}

const ITEMS_PER_PAGE = 5;

const RelatedRecordsManager: React.FC<RelatedRecordsManagerProps> = ({
  house, generals, merits, medals, policies, socialProtections,
  onClose, onAdd, onEdit, onDelete
}) => {
  // Quản lý tìm kiếm và phân trang cho từng loại
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    general: '', merit: '', medal: '', policy: '', social: ''
  });
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({
    general: 1, merit: 1, medal: 1, policy: 1, social: 1
  });

  const categories = [
    { id: 'general', label: 'Tướng lĩnh', icon: <ShieldAlert size={18} />, data: generals, color: 'indigo' },
    { id: 'merit', label: 'Người có công', icon: <Heart size={18} />, data: merits, color: 'rose' },
    { id: 'medal', label: 'Huân chương KC', icon: <Award size={18} />, data: medals, color: 'amber' },
    { id: 'policy', label: 'Đối tượng chính sách', icon: <ShieldCheck size={18} />, data: policies, color: 'blue' },
    { id: 'social', label: 'Bảo trợ xã hội', icon: <HandHeart size={18} />, data: socialProtections, color: 'emerald' },
  ];

  const handleSearchChange = (id: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [id]: value }));
    setCurrentPages(prev => ({ ...prev, [id]: 1 })); // Reset về trang 1 khi tìm kiếm
  };

  const handlePageChange = (id: string, newPage: number) => {
    setCurrentPages(prev => ({ ...prev, [id]: newPage }));
  };

  const handleExportExcel = () => {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Vietnamese character support
    
    // Header section for the House
    csvContent += `BÁO CÁO TỔNG HỢP ĐỐI TƯỢNG GẮN VỚI SỐ NHÀ\n`;
    csvContent += `Địa chỉ,${house.SoNha} ${house.Duong}\n`;
    csvContent += `Chủ hộ,${house.TenChuHo}\n`;
    csvContent += `Ngày xuất,${new Date().toLocaleString('vi-VN')}\n\n`;

    // Function to sanitize CSV data
    const sanitize = (val: any) => {
      const s = String(val || '');
      return s.includes(',') ? `"${s}"` : s;
    };

    // 1. Generals
    csvContent += `1. DANH SÁCH TƯỚNG LĨNH\n`;
    csvContent += `Họ và tên,Quan hệ,Diện,Tình trạng,Người nhận thay,Hình thức nhận,Ngân hàng,Số tài khoản\n`;
    generals.forEach(g => {
      csvContent += `${sanitize(g.HoTen)},${sanitize(g.QuanHe)},${sanitize(g.Dien)},${sanitize(g.TinhTrang)},${sanitize(g.NguoiNhanThay)},${sanitize(g.HinhThucNhan)},${sanitize(g.NganHang)},${sanitize(g.SoTaiKhoan)}\n`;
    });
    csvContent += `\n`;

    // 2. Merits
    csvContent += `2. DANH SÁCH NGƯỜI CÓ CÔNG\n`;
    csvContent += `Họ và tên,Quan hệ,Loại đối tượng,Số hồ sơ,Số tiền trợ cấp,Người nhận thay\n`;
    merits.forEach(m => {
      csvContent += `${sanitize(m.HoTen)},${sanitize(m.QuanHe)},${sanitize(m.LoaiDoiTuong)},${sanitize(m.SoQuanLyHS)},${m.SoTien},${sanitize(m.NguoiNhanThay)}\n`;
    });
    csvContent += `\n`;

    // 3. Medals
    csvContent += `3. DANH SÁCH HUÂN CHƯƠNG KHÁNG CHIẾN\n`;
    csvContent += `Họ và tên,Quan hệ,Loại huân chương,Số hồ sơ,Số tiền,Người nhận thay\n`;
    medals.forEach(m => {
      csvContent += `${sanitize(m.HoTen)},${sanitize(m.QuanHe)},${sanitize(m.LoaiDoiTuong)},${sanitize(m.SoQuanLyHS)},${m.SoTien},${sanitize(m.NguoiNhanThay)}\n`;
    });
    csvContent += `\n`;

    // 4. Policies
    csvContent += `4. DANH SÁCH ĐỐI TƯỢNG CHÍNH SÁCH\n`;
    csvContent += `Họ và tên,Quan hệ,Diện chính sách,Số hồ sơ,Số tiền,Tỷ lệ tổn thương\n`;
    policies.forEach(p => {
      csvContent += `${sanitize(p.HoTen)},${sanitize(p.QuanHe)},${sanitize(p.LoaiDienChinhSach)},${sanitize(p.SoQuanLyHS)},${p.SoTien},${sanitize(p.TyLeTonThuong)}\n`;
    });
    csvContent += `\n`;

    // 5. Social Protection
    csvContent += `5. DANH SÁCH BẢO TRỢ XÃ HỘI\n`;
    csvContent += `Họ và tên,Quan hệ,Diện bảo trợ,Số hồ sơ,Số tiền,Người nhận thay\n`;
    socialProtections.forEach(s => {
      csvContent += `${sanitize(s.HoTen)},${sanitize(s.QuanHe)},${sanitize(s.LoaiDien)},${sanitize(s.SoQuanLyHS)},${s.SoTien},${sanitize(s.NguoiNhanThay)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const fileName = `Ho_So_Doi_Tuong_${house.SoNha}_${house.Duong.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Home size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Quản lý đối tượng gắn với số nhà
              </h2>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mt-0.5">
                <span className="flex items-center gap-1 text-blue-600 font-bold"><MapPin size={14} /> {house.SoNha} {house.Duong}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Chủ hộ: <strong className="text-slate-700">{house.TenChuHo}</strong></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
              <FileSpreadsheet size={16} /> Xuất Excel tổng hợp
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-12">
          {categories.map((cat) => {
            const searchTerm = searchTerms[cat.id];
            const currentPage = currentPages[cat.id];

            // Lọc dữ liệu theo tìm kiếm
            const filteredData = cat.data.filter(item => 
              item.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.SoQuanLyHS || '').toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Phân trang
            const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

            return (
              <section key={cat.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest text-${cat.color}-600`}>
                    {cat.icon} {cat.label}
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-500 font-bold border">
                      {cat.data.length} tổng số
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                      <input 
                        type="text"
                        placeholder={`Tìm ${cat.label.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(cat.id, e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48 sm:w-64 font-medium"
                      />
                    </div>
                    <button 
                      onClick={() => onAdd(cat.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 bg-${cat.color}-600 hover:bg-${cat.color}-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 shrink-0`}
                    >
                      <Plus size={14} /> Thêm mới
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 border-b">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-3">Họ và tên</th>
                        <th className="px-6 py-3">Quan hệ chủ hộ</th>
                        <th className="px-6 py-3">Chi tiết / Diện quản lý</th>
                        <th className="px-6 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{item.HoTen}</p>
                              {item.SoQuanLyHS ? (
                                <p className="text-[10px] text-blue-500 font-mono font-bold mt-0.5">Mã HS: {item.SoQuanLyHS}</p>
                              ) : (
                                <p className="text-[10px] text-slate-300 italic mt-0.5">Chưa cập nhật mã</p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                {item.QuanHe}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-black text-${cat.color}-700`}>
                                {item.LoaiDoiTuong || item.Dien || item.LoaiDienChinhSach || item.LoaiDien}
                              </span>
                              {item.SoTien > 0 && (
                                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                                  Trợ cấp: {item.SoTien.toLocaleString()} đ
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => onEdit(cat.id as any, item)}
                                  className={`p-2 hover:bg-${cat.color}-50 text-${cat.color}-600 rounded-xl transition-all`}
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => onDelete(cat.id as any, item.id)}
                                  className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                                  title="Xóa hồ sơ"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-xs bg-slate-50/30">
                            {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : `Chưa có dữ liệu ${cat.label.toLowerCase()} gắn với số nhà này`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="px-6 py-3 border-t bg-slate-50/50 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} / {filteredData.length} kết quả
                      </p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handlePageChange(cat.id, currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-lg border bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                          <ChevronLeft size={14} className="text-slate-600" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(cat.id, i + 1)}
                            className={`w-7 h-7 rounded-lg text-[11px] font-black transition-all ${
                              currentPage === i + 1 
                                ? `bg-${cat.color}-600 text-white shadow-md shadow-${cat.color}-100` 
                                : 'bg-white border text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button 
                          onClick={() => handlePageChange(cat.id, currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded-lg border bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                          <ChevronRight size={14} className="text-slate-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="px-12 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Hoàn tất quản lý
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedRecordsManager;
