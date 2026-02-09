
export interface Street {
  id: string;
  name: string;
  code: string;
}

export interface RelationshipType {
  id: string;
  name: string;
  code: string;
}

export interface GeneralStatus {
  id: string;
  name: string;
  code: string;
}

export interface MeritType {
  id: string;
  name: string;
  code: string;
}

export interface Neighborhood {
  id: string;
  nameNew: string;
  nameOld: string;
  X?: number;
  Y?: number;
  geometry?: Array<[number, number]>;
}

export interface WardBoundary {
  id: string;
  name: string;
  X: number;
  Y: number;
  geometry?: Array<[number, number]>;
}

export interface FamilyMember {
  id: string;
  HoTen: string;
  QuanHe: string;
  NgaySinh: string;
  GioiTinh: 'Nam' | 'Nữ' | 'Khác';
  SoCCCD: string;
  TrangThai: 'Còn sống' | 'Đã mất';
}

export interface PublicLandRecord {
  id: string;
  Bieu: string;
  Donviquanl: string;
  Donvisudun: string;
  Thua: string;
  To: string;
  Phuong: string;
  Dientich: number;
  Hientrang: string;
  Nguongoc: string;
  Noidungxul: string;
  Vanbanxuly: string;
  Thongtin: string;
  Vanbanphed: string;
  Dexuatcuap: string;
  Dexuacuaph: string;
  Ghichu: string;
  X: number;
  Y: number;
  geometry?: Array<[number, number]>;
  Status: 'Active' | 'Inactive';
  CreatedAt: string;
  CreatedBy: string;
  LinkedHouseId?: string;
}

export interface GeneralRecord {
  id: string;
  LinkedHouseId: string;
  HoTen: string;
  QuanHe: string;
  Dien: 'TW' | 'Thành ủy';
  DiaChiThuongTru: string;
  TinhTrang: string;
  GhiChu?: string;
  Status: 'Active' | 'Inactive';
  CreatedAt: string;
  CreatedBy: string;
}

export interface MeritRecord {
  id: string;
  LinkedHouseId: string;
  HoTen: string; // Họ và tên liệt sỹ / đối tượng
  QuanHe: string; // Quan hệ với chủ nhà
  LoaiDoiTuong: string; // Thương binh, Con LS...
  SoQuanLyHS: string;
  SoTien: number;
  GhiChu?: string;
  Status: 'Active' | 'Inactive';
  CreatedAt: string;
  CreatedBy: string;
}

export interface HouseNumberRecord {
  id: string;
  TenChuHo: string;
  SoCCCD: string;
  GioiTinhCh: 'Nam' | 'Nữ' | 'Khác';
  DienThoaiC: string;
  NgaySinhCh: string;
  QuocTich: string;
  DanToc: string;
  QuanHeChuHo: FamilyMember[];
  DiaChiLien: string;
  SoNha: string;
  SoNhaTam?: string;
  Duong: string;
  KDC: string; 
  CanHoPhong?: string;
  LoBlock?: string;
  Tang?: string;
  TenChungCu?: string;
  MaPhuong_Cu: string;
  KhuVuc_Cu: string;
  Phuong_Cu: string;
  KhuVuc_Moi: string;
  Phuong_Moi: string;
  PhapLy: string;
  KyHieuLoDa: string;
  SoTo: string;
  SoThua: string;
  NamBDDC: string;
  MaSoHS: string;
  NguonGocNh: string;
  NguonGocDa: string;
  TranhChap: boolean;
  NoiDungTra?: string;
  TongPhongT?: number;
  STTPhongTr?: string;
  TongNhaTro?: number;
  TongLoBloc?: number;
  X: number;
  Y: number;
  GhiChu: string;
  Status: 'Active' | 'Inactive';
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt?: string;
  UpdatedBy?: string;
}

export type FormTab = 'Owner' | 'Address' | 'Legal' | 'Technical' | 'Map';
export type PublicLandTab = 'Admin' | 'Management' | 'Status' | 'Processing' | 'Map';
export type NeighborhoodTab = 'Info' | 'Boundary';
