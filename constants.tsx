
import { HouseNumberRecord, Street, Neighborhood, PublicLandRecord, WardBoundary, RelationshipType, GeneralStatus, MeritType, MedalType } from './types';

export const INITIAL_STREETS: Street[] = [
  { id: 'st1', name: 'Lê Lợi', code: 'D001' },
  { id: 'st2', name: 'Nguyễn Huệ', code: 'D002' },
  { id: 'st3', name: 'Đồng Khởi', code: 'D003' },
  { id: 'st4', name: 'Pasteur', code: 'D004' },
  { id: 'st5', name: 'Lý Tự Trọng', code: 'D005' }
];

export const INITIAL_RELATIONSHIPS: RelationshipType[] = [
  { id: 'rel1', name: 'Vợ', code: 'VO' },
  { id: 'rel2', name: 'Chồng', code: 'CHONG' },
  { id: 'rel3', name: 'Con đẻ', code: 'CON_DE' },
  { id: 'rel4', name: 'Con nuôi', code: 'CON_NUOI' },
  { id: 'rel5', name: 'Anh ruột', code: 'ANH' },
  { id: 'rel6', name: 'Chị ruột', code: 'CHI' },
  { id: 'rel7', name: 'Em ruột', code: 'EM' },
  { id: 'rel8', name: 'Bố đẻ', code: 'BO' },
  { id: 'rel9', name: 'Mẹ đẻ', code: 'ME' }
];

export const INITIAL_GENERAL_STATUS: GeneralStatus[] = [
  { id: 'gs1', name: 'Đang công tác', code: 'DANG_CONG_TAC' },
  { id: 'gs2', name: 'Nghỉ hưu', code: 'NGHI_HUU' },
  { id: 'gs3', name: 'Đã mất', code: 'DA_MAT' },
  { id: 'gs4', name: 'Chuyển công tác', code: 'CHUYEN_CONG_TAC' }
];

export const INITIAL_MERIT_TYPES: MeritType[] = [
  { id: 'mt1', name: 'Thương binh', code: 'THUONG_BINH' },
  { id: 'mt2', name: 'Bệnh binh', code: 'BENH_BINH' },
  { id: 'mt3', name: 'Con liệt sỹ', code: 'CON_LS' },
  { id: 'mt4', name: 'Vợ liệt sỹ', code: 'VO_LS' },
  { id: 'mt5', name: 'Người hoạt động kháng chiến bị nhiễm chất độc hóa học', code: 'CD_HOA_HOC' },
  { id: 'mt6', name: 'Người có công giúp đỡ cách mạng', code: 'GIUP_DO_CM' }
];

export const INITIAL_MEDAL_TYPES: MedalType[] = [
  { id: 'md1', name: 'Huân chương kháng chiến hạng Nhất', code: 'HCKC_1' },
  { id: 'md2', name: 'Huân chương kháng chiến hạng Nhì', code: 'HCKC_2' },
  { id: 'md3', name: 'Huân chương kháng chiến hạng Ba', code: 'HCKC_3' },
  { id: 'md4', name: 'Huy chương kháng chiến hạng Nhất', code: 'HYCKC_1' },
  { id: 'md5', name: 'Huy chương kháng chiến hạng Nhì', code: 'HYCKC_2' }
];

export const INITIAL_WARD_BOUNDARY: WardBoundary = {
  id: 'ward-1',
  name: 'Phường Bến Thành',
  X: 10.7719,
  Y: 106.6983,
  geometry: [
    [10.775, 106.695],
    [10.775, 106.702],
    [10.768, 106.702],
    [10.768, 106.695]
  ]
};

export const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  { id: 'nb1', nameNew: 'Khu phố 1', nameOld: 'Tổ dân phố 12' },
  { id: 'nb2', nameNew: 'Khu phố 2', nameOld: 'Tổ dân phố 13' },
  { id: 'nb3', nameNew: 'Khu phố 3', nameOld: 'Tổ dân phố 05' },
  { id: 'nb4', nameNew: 'Khu phố 4', nameOld: 'Tổ dân phố 08' },
  { id: 'nb5', nameNew: 'KDC Trung Tâm', nameOld: 'Khu tập thể A' }
];

export const INITIAL_PUBLIC_LAND: PublicLandRecord[] = [
  {
    id: 'pl1',
    Bieu: 'Biểu 01',
    Donviquanl: 'Trung tâm Phát triển quỹ đất',
    Donvisudun: 'Phòng Giáo dục và Đào tạo',
    Thua: '12',
    To: '45',
    Phuong: 'Bến Thành',
    Dientich: 1500.5,
    Hientrang: 'Đất trống',
    Nguongoc: 'Đất nhà nước quản lý',
    Noidungxul: 'Đang lập phương án đấu giá',
    Vanbanxuly: 'QĐ 123/UBND',
    Thongtin: 'Khu vực lõi trung tâm',
    Vanbanphed: 'VB 456/SXD',
    Dexuatcuap: 'Duyệt đấu giá quyền sử dụng đất',
    Dexuacuaph: 'Ủng hộ phương án đấu giá',
    Ghichu: 'Ưu tiên làm công viên cây xanh',
    X: 10.7725,
    Y: 106.6975,
    geometry: [
      [10.773, 106.697],
      [10.773, 106.698],
      [10.772, 106.698],
      [10.772, 106.697]
    ],
    Status: 'Active',
    CreatedAt: '2024-03-01T09:00:00Z',
    CreatedBy: 'Admin'
  }
];

export const INITIAL_DATA: HouseNumberRecord[] = [
  {
    id: '1',
    TenChuHo: 'Nguyễn Văn A',
    SoCCCD: '012345678901',
    GioiTinhCh: 'Nam',
    DienThoaiC: '0901234567',
    NgaySinhCh: '1985-05-20',
    QuocTich: 'Việt Nam',
    DanToc: 'Kinh',
    QuanHeChuHo: [
      {
        id: 'fm1',
        HoTen: 'Trần Thị B',
        QuanHe: 'Vợ',
        NgaySinh: '1988-08-15',
        GioiTinh: 'Nữ',
        SoCCCD: '012345678902',
        TrangThai: 'Còn sống'
      }
    ],
    DiaChiLien: '123 Đường Lê Lợi, Phường 1, TP. HCM',
    SoNha: '123',
    Duong: 'Lê Lợi',
    KDC: 'Khu phố 1',
    MaPhuong_Cu: 'P01',
    KhuVuc_Cu: 'Khu phố 1',
    Phuong_Cu: 'Phường Bến Thành',
    KhuVuc_Moi: 'Khu vực 1',
    Phuong_Moi: 'Phường Bến Thành',
    PhapLy: 'Sổ đỏ chính chủ',
    KyHieuLoDa: 'L01',
    SoTo: '10',
    SoThua: '150',
    NamBDDC: '2020',
    MaSoHS: 'HS-2024-001',
    NguonGocNh: 'Xây dựng mới',
    NguonGocDa: 'Nhận chuyển nhượng',
    TranhChap: false,
    X: 10.7719,
    Y: 106.6983,
    GhiChu: 'Nhà 2 tầng, mới sơn sửa',
    Status: 'Active',
    CreatedAt: '2024-01-10T08:00:00Z',
    CreatedBy: 'Admin'
  }
];
