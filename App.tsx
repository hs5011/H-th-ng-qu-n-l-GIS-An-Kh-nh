
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Map as MapIcon, List, Filter, 
  Trash2, Edit, CheckCircle, AlertCircle,
  Home, Database, MapPin, Milestone, Building2, Landmark, Info, Layers, Eye, EyeOff, Globe, Users, ShieldAlert, Heart, Wallet, Award, ShieldCheck, Scale, HandHeart, BarChart3, FileSpreadsheet, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { HouseNumberRecord, Street, Neighborhood, PublicLandRecord, WardBoundary, RelationshipType, GeneralRecord, GeneralStatus, MeritRecord, MeritType, MedalRecord, MedalType, PolicyRecord, PolicyType, SocialProtectionRecord, SocialProtectionType, Bank } from './types';
import { INITIAL_DATA, INITIAL_STREETS, INITIAL_NEIGHBORHOODS, INITIAL_PUBLIC_LAND, INITIAL_WARD_BOUNDARY, INITIAL_RELATIONSHIPS, INITIAL_GENERAL_STATUS, INITIAL_MERIT_TYPES, INITIAL_MEDAL_TYPES, INITIAL_POLICY_TYPES, INITIAL_SOCIAL_PROTECTION_TYPES, INITIAL_BANKS } from './constants';
import HouseForm from './components/HouseForm';
import MapView from './components/MapView';
import StreetForm from './components/StreetForm';
import NeighborhoodForm from './components/NeighborhoodForm';
import PublicLandForm from './components/PublicLandForm';
import WardBoundaryForm from './components/WardBoundaryForm';
import RelationshipForm from './components/RelationshipForm';
import GeneralForm from './components/GeneralForm';
import GeneralStatusForm from './components/GeneralStatusForm';
import MeritForm from './components/MeritForm';
import MeritTypeForm from './components/MeritTypeForm';
import MedalForm from './components/MedalForm';
import MedalTypeForm from './components/MedalTypeForm';
import PolicyForm from './components/PolicyForm';
import PolicyTypeForm from './components/PolicyTypeForm';
import SocialProtectionForm from './components/SocialProtectionForm';
import SocialProtectionTypeForm from './components/SocialProtectionTypeForm';
import HouseLookup from './components/HouseLookup';
import BankForm from './components/BankForm';
import ReportsView from './components/ReportsView';
import RelatedRecordsManager from './components/RelatedRecordsManager';

type SidebarTab = 'records' | 'search_by_house' | 'public_land' | 'generals' | 'medals' | 'merits' | 'policies' | 'social_protections' | 'planning' | 'reports' | 'streets' | 'neighborhoods' | 'ward_boundary' | 'relationships' | 'general_statuses' | 'merit_types' | 'medal_types' | 'policy_types' | 'social_protection_types' | 'bank_management';

const ITEMS_PER_PAGE = 10;

const App: React.FC = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('records');
  const [records, setRecords] = useState<HouseNumberRecord[]>(INITIAL_DATA);
  const [publicLands, setPublicLands] = useState<PublicLandRecord[]>(INITIAL_PUBLIC_LAND);
  const [generals, setGenerals] = useState<GeneralRecord[]>([]);
  const [merits, setMerits] = useState<MeritRecord[]>([]);
  const [medals, setMedals] = useState<MedalRecord[]>([]);
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [socialProtections, setSocialProtections] = useState<SocialProtectionRecord[]>([]);
  const [streets, setStreets] = useState<Street[]>(INITIAL_STREETS);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(INITIAL_NEIGHBORHOODS);
  const [relationships, setRelationships] = useState<RelationshipType[]>(INITIAL_RELATIONSHIPS);
  const [generalStatuses, setGeneralStatuses] = useState<GeneralStatus[]>(INITIAL_GENERAL_STATUS);
  const [meritTypes, setMeritTypes] = useState<MeritType[]>(INITIAL_MERIT_TYPES);
  const [medalTypes, setMedalTypes] = useState<MedalType[]>(INITIAL_MEDAL_TYPES);
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>(INITIAL_POLICY_TYPES);
  const [socialProtectionTypes, setSocialProtectionTypes] = useState<SocialProtectionType[]>(INITIAL_SOCIAL_PROTECTION_TYPES);
  const [wardBoundary, setWardBoundary] = useState<WardBoundary>(INITIAL_WARD_BOUNDARY);
  const [banks, setBanks] = useState<Bank[]>(INITIAL_BANKS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HouseNumberRecord | undefined>(undefined);
  
  const [isRelatedManagerOpen, setIsRelatedManagerOpen] = useState(false);
  const [selectedHouseForRelated, setSelectedHouseForRelated] = useState<HouseNumberRecord | null>(null);

  const [isLandFormOpen, setIsLandFormOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<PublicLandRecord | undefined>(undefined);

  const [isGeneralFormOpen, setIsGeneralFormOpen] = useState(false);
  const [editingGeneral, setEditingGeneral] = useState<GeneralRecord | undefined>(undefined);

  const [isMeritFormOpen, setIsMeritFormOpen] = useState(false);
  const [editingMerit, setEditingMerit] = useState<MeritRecord | undefined>(undefined);

  const [isMedalFormOpen, setIsMedalFormOpen] = useState(false);
  const [editingMedal, setEditingMedal] = useState<MedalRecord | undefined>(undefined);

  const [isPolicyFormOpen, setIsPolicyFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyRecord | undefined>(undefined);

  const [isSocialFormOpen, setIsSocialFormOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialProtectionRecord | undefined>(undefined);
  
  const [isStreetFormOpen, setIsStreetFormOpen] = useState(false);
  const [editingStreet, setEditingStreet] = useState<Street | undefined>(undefined);
  
  const [isNbFormOpen, setIsNbFormOpen] = useState(false);
  const [editingNb, setEditingNb] = useState<Neighborhood | undefined>(undefined);

  const [isRelFormOpen, setIsRelFormOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<RelationshipType | undefined>(undefined);

  const [isGsFormOpen, setIsGsFormOpen] = useState(false);
  const [editingGs, setEditingGs] = useState<GeneralStatus | undefined>(undefined);

  const [isMtFormOpen, setIsMtFormOpen] = useState(false);
  const [editingMt, setEditingMt] = useState<MeritType | undefined>(undefined);

  const [isMdtFormOpen, setIsMdtFormOpen] = useState(false);
  const [editingMdt, setEditingMdt] = useState<MedalType | undefined>(undefined);

  const [isPtFormOpen, setIsPtFormOpen] = useState(false);
  const [editingPt, setEditingPt] = useState<PolicyType | undefined>(undefined);

  const [isSptFormOpen, setIsSptFormOpen] = useState(false);
  const [editingSpt, setEditingSpt] = useState<SocialProtectionType | undefined>(undefined);

  const [isBankFormOpen, setIsBankFormOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | undefined>(undefined);

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSidebarTab, searchTerm, activeFilter]);

  const getHouseAddress = (houseId?: string) => {
    if (!houseId) return '';
    const house = records.find(h => h.id === houseId);
    if (!house) return '';
    const sn = house.SoNha ? `${house.SoNha} ` : '';
    const d = house.Duong || '';
    return (sn + d).trim();
  };

  const [mapLayers, setMapLayers] = useState({
    houses: true,
    publicLand: true,
    neighborhoods: true,
    ward: true
  });
  const [mapSearch, setMapSearch] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = (
        (r.TenChuHo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.SoNha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.Duong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.SoCCCD || '').includes(searchTerm) ||
        (r.SoThua || '').includes(searchTerm)
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? r.Status === 'Active' : 
                          r.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [records, searchTerm, activeFilter]);

  const filteredPublicLand = useMemo(() => {
    return publicLands.filter(r => {
      const address = getHouseAddress(r.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (r.Donviquanl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.Donvisudun || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.Phuong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.Thua || '').includes(searchTerm) ||
        (r.To || '').includes(searchTerm) ||
        (r.Hientrang || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? r.Status === 'Active' : 
                          r.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [publicLands, searchTerm, activeFilter, records]);

  const filteredGenerals = useMemo(() => {
    return generals.filter(g => {
      const address = getHouseAddress(g.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (g.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.DiaChiThuongTru || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.GhiChu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? g.Status === 'Active' : 
                          g.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [generals, searchTerm, activeFilter, records]);

  const filteredMerits = useMemo(() => {
    return merits.filter(m => {
      const address = getHouseAddress(m.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (m.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.SoQuanLyHS || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.GhiChu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? m.Status === 'Active' : 
                          m.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [merits, searchTerm, activeFilter, records]);

  const filteredMedals = useMemo(() => {
    return medals.filter(m => {
      const address = getHouseAddress(m.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (m.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.SoQuanLyHS || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.GhiChu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? m.Status === 'Active' : 
                          m.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [medals, searchTerm, activeFilter, records]);

  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      const address = getHouseAddress(p.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (p.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.SoQuanLyHS || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.GhiChu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? p.Status === 'Active' : 
                          p.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [policies, searchTerm, activeFilter, records]);

  const filteredSocials = useMemo(() => {
    return socialProtections.filter(s => {
      const address = getHouseAddress(s.LinkedHouseId).toLowerCase();
      const matchSearch = (
        (s.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.SoQuanLyHS || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.GhiChu || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilter === 'all' ? true : 
                          activeFilter === 'active' ? s.Status === 'Active' : 
                          s.Status === 'Inactive';
      return matchSearch && matchFilter;
    });
  }, [socialProtections, searchTerm, activeFilter, records]);

  const filteredBanks = useMemo(() => {
    return banks.filter(bank => {
      const matchSearch = (
        (bank.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bank.shortName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bank.code || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchSearch;
    });
  }, [banks, searchTerm]);

  const handleExportExcel = (tab: SidebarTab) => {
    let dataToExport: any[] = [];
    let headers: string[] = [];
    let fileName = `Xuat_Du_Lieu_${tab}_${new Date().toISOString().slice(0, 10)}.csv`;

    switch(tab) {
      case 'records':
        dataToExport = filteredRecords.map(r => [r.MaSoHS || '', r.TenChuHo || '', r.SoCCCD || '', r.SoNha || '', r.Duong || '', r.KDC || '', r.SoTo || '', r.SoThua || '', r.TranhChap ? 'Có' : 'Không', r.Status]);
        headers = ['Mã HS', 'Chủ hộ', 'CCCD', 'Số nhà', 'Đường', 'Khu phố', 'Số tờ', 'Số thửa', 'Tranh chấp', 'Trạng thái'];
        break;
      case 'public_land':
        dataToExport = filteredPublicLand.map(l => [l.Bieu || '', getHouseAddress(l.LinkedHouseId), l.Donviquanl || '', l.Donvisudun || '', l.To || '', l.Thua || '', l.Phuong || '', l.Dientich || 0, l.Hientrang || '', l.Status]);
        headers = ['Biểu', 'Địa chỉ liên kết', 'Đơn vị QL', 'Đơn vị sử dụng', 'Tờ', 'Thửa', 'Phường', 'Diện tích', 'Hiện trạng', 'Trạng thái'];
        break;
      case 'generals':
        dataToExport = filteredGenerals.map(g => [g.HoTen || '', getHouseAddress(g.LinkedHouseId), g.QuanHe || '', g.Dien || '', g.TinhTrang || '', g.NguoiNhanThay || '', g.HinhThucNhan || '', g.NganHang || '', g.SoTaiKhoan || '']);
        headers = ['Họ tên', 'Địa chỉ số nhà', 'Quan hệ chủ hộ', 'Diện', 'Tình trạng', 'Người nhận thay', 'Hình thức nhận', 'Ngân hàng', 'Số tài khoản'];
        break;
      case 'merits':
        dataToExport = filteredMerits.map(m => [m.HoTen || '', getHouseAddress(m.LinkedHouseId), m.QuanHe || '', m.LoaiDoiTuong || '', m.SoQuanLyHS || '', m.SoTien || 0, m.NguoiNhanThay || '', m.HinhThucNhan || '']);
        headers = ['Họ tên', 'Địa chỉ số nhà', 'Quan hệ', 'Loại đối tượng', 'Số hồ sơ', 'Số tiền', 'Người nhận thay', 'Hình thức nhận'];
        break;
      case 'medals':
        dataToExport = filteredMedals.map(m => [m.HoTen || '', getHouseAddress(m.LinkedHouseId), m.QuanHe || '', m.LoaiDoiTuong || '', m.SoQuanLyHS || '', m.SoTien || 0, m.NguoiNhanThay || '']);
        headers = ['Họ tên', 'Địa chỉ số nhà', 'Quan hệ', 'Loại huân chương', 'Số hồ sơ', 'Số tiền', 'Người nhận thay'];
        break;
      case 'policies':
        dataToExport = filteredPolicies.map(p => [p.HoTen || '', getHouseAddress(p.LinkedHouseId), p.QuanHe || '', p.LoaiDienChinhSach || '', p.SoQuanLyHS || '', p.SoTien || 0, p.TyLeTonThuong || '']);
        headers = ['Họ tên', 'Địa chỉ số nhà', 'Quan hệ', 'Diện CS', 'Số hồ sơ', 'Số tiền', 'Tỷ lệ tổn thương'];
        break;
      case 'social_protections':
        dataToExport = filteredSocials.map(s => [s.HoTen || '', getHouseAddress(s.LinkedHouseId), s.QuanHe || '', s.LoaiDien || '', s.SoQuanLyHS || '', s.SoTien || 0, s.HinhThucNhan || '']);
        headers = ['Họ tên', 'Địa chỉ số nhà', 'Quan hệ', 'Diện bảo trợ', 'Số hồ sơ', 'Số tiền', 'Hình thức nhận'];
        break;
      default: return;
    }

    if (dataToExport.length === 0) {
      alert('Không có dữ liệu để xuất theo bộ lọc hiện tại');
      return;
    }

    let csvContent = "\uFEFF"; 
    csvContent += headers.join(",") + "\n";
    dataToExport.forEach(row => {
      const sanitizedRow = row.map((val: any) => {
        const s = String(val ?? '');
        return s.includes(',') ? `"${s}"` : s;
      });
      csvContent += sanitizedRow.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddOrEditHouse = (data: Partial<HouseNumberRecord>) => {
    if (editingRecord || data.id) {
      const targetId = editingRecord?.id || data.id;
      setRecords(prev => prev.map(r => r.id === targetId ? { ...r, ...data, UpdatedAt: new Date().toISOString() } as HouseNumberRecord : r));
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const newRecord: HouseNumberRecord = {
        ...data as HouseNumberRecord,
        id: newId,
        MaSoHS: `HS-${new Date().getFullYear()}-${records.length + 101}`,
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      };
      setRecords(prev => [...prev, newRecord]);
      setSelectedHouseForRelated(newRecord);
      setIsRelatedManagerOpen(true);
    }
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  const handleDeleteHouse = (id: string) => {
    if (window.confirm('Xác nhận ngưng sử dụng số nhà này?')) {
      setRecords(prev => prev.map(r => r.id === id ? { ...r, Status: 'Inactive' } as HouseNumberRecord : r));
    }
  };

  const handleAddRelated = (type: string) => {
    if (!selectedHouseForRelated) return;
    switch(type) {
      case 'general': setEditingGeneral(undefined); setIsGeneralFormOpen(true); break;
      case 'merit': setEditingMerit(undefined); setIsMeritFormOpen(true); break;
      case 'medal': setEditingMedal(undefined); setIsMedalFormOpen(true); break;
      case 'policy': setEditingPolicy(undefined); setIsPolicyFormOpen(true); break;
      case 'social': setEditingSocial(undefined); setIsSocialFormOpen(true); break;
    }
  };

  const handleEditRelated = (type: string, record: any) => {
    switch(type) {
      case 'general': setEditingGeneral(record); setIsGeneralFormOpen(true); break;
      case 'merit': setEditingMerit(record); setIsMeritFormOpen(true); break;
      case 'medal': setEditingMedal(record); setIsMedalFormOpen(true); break;
      case 'policy': setEditingPolicy(record); setIsPolicyFormOpen(true); break;
      case 'social': setEditingSocial(record); setIsSocialFormOpen(true); break;
    }
  };

  const handleDeleteRelated = (type: string, id: string) => {
    switch(type) {
      case 'general': handleDeleteGeneral(id); break;
      case 'merit': handleDeleteMerit(id); break;
      case 'medal': handleDeleteMedal(id); break;
      case 'policy': handleDeletePolicy(id); break;
      case 'social': handleDeleteSocial(id); break;
    }
  };

  const handleAddOrEditLand = (data: Partial<PublicLandRecord>) => {
    if (editingLand || data.id) {
      const targetId = editingLand?.id || data.id;
      setPublicLands(prev => prev.map(l => l.id === targetId ? { ...l, ...data } as PublicLandRecord : l));
    } else {
      const newRecord: PublicLandRecord = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      } as PublicLandRecord;
      setPublicLands(prev => [...prev, newRecord]);
    }
    setIsLandFormOpen(false);
    setEditingLand(undefined);
  };

  const handleDeleteLand = (id: string) => {
    if (window.confirm('Xác nhận ngưng sử dụng thửa đất công này?')) {
      setPublicLands(prev => prev.map(l => l.id === id ? { ...l, Status: 'Inactive' } as PublicLandRecord : l));
    }
  };

  const handleAddOrEditGeneral = (dataList: Partial<GeneralRecord>[]) => {
    const data = dataList[0];
    if (editingGeneral || data.id) {
      const targetId = editingGeneral?.id || data.id;
      setGenerals(prev => prev.map(g => g.id === targetId ? { ...g, ...data, UpdatedAt: new Date().toISOString() } as GeneralRecord : g));
    } else {
      const newRecords = dataList.map(data => ({
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      })) as GeneralRecord[];
      setGenerals(prev => [...prev, ...newRecords]);
    }
    setIsGeneralFormOpen(false);
    setEditingGeneral(undefined);
  };

  const handleDeleteGeneral = (id: string) => {
    if (window.confirm('Xác nhận ngưng quản lý tướng lĩnh này?')) {
      setGenerals(prev => prev.map(g => g.id === id ? { ...g, Status: 'Inactive', UpdatedAt: new Date().toISOString() } as GeneralRecord : g));
    }
  };

  const handleAddOrEditMerit = (dataList: Partial<MeritRecord>[]) => {
    const data = dataList[0];
    if (editingMerit || data.id) {
      const targetId = editingMerit?.id || data.id;
      setMerits(prev => prev.map(m => m.id === targetId ? { ...m, ...data, UpdatedAt: new Date().toISOString() } as MeritRecord : m));
    } else {
      const newRecords = dataList.map(data => ({
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      })) as MeritRecord[];
      setMerits(prev => [...prev, ...newRecords]);
    }
    setIsMeritFormOpen(false);
    setEditingMerit(undefined);
  };

  const handleDeleteMerit = (id: string) => {
    if (window.confirm('Xác nhận ngưng quản lý hồ sơ này?')) {
      setMerits(prev => prev.map(m => m.id === id ? { ...m, Status: 'Inactive', UpdatedAt: new Date().toISOString() } as MeritRecord : m));
    }
  };

  const handleAddOrEditMedal = (dataList: Partial<MedalRecord>[]) => {
    const data = dataList[0];
    if (editingMedal || data.id) {
      const targetId = editingMedal?.id || data.id;
      setMedals(prev => prev.map(m => m.id === targetId ? { ...m, ...data, UpdatedAt: new Date().toISOString() } as MedalRecord : m));
    } else {
      const newRecords = dataList.map(data => ({
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      })) as MedalRecord[];
      setMedals(prev => [...prev, ...newRecords]);
    }
    setIsMedalFormOpen(false);
    setEditingMedal(undefined);
  };

  const handleDeleteMedal = (id: string) => {
    if (window.confirm('Xác nhận ngưng quản lý hồ sơ này?')) {
      setMedals(prev => prev.map(m => m.id === id ? { ...m, Status: 'Inactive', UpdatedAt: new Date().toISOString() } as MedalRecord : m));
    }
  };

  const handleAddOrEditPolicy = (dataList: Partial<PolicyRecord>[]) => {
    const data = dataList[0];
    if (editingPolicy || data.id) {
      const targetId = editingPolicy?.id || data.id;
      setPolicies(prev => prev.map(p => p.id === targetId ? { ...p, ...data, UpdatedAt: new Date().toISOString() } as PolicyRecord : p));
    } else {
      const newRecords = dataList.map(data => ({
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      })) as PolicyRecord[];
      setPolicies(prev => [...prev, ...newRecords]);
    }
    setIsPolicyFormOpen(false);
    setEditingPolicy(undefined);
  };

  const handleDeletePolicy = (id: string) => {
    if (window.confirm('Xác nhận ngưng quản lý hồ sơ chính sách này?')) {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, Status: 'Inactive', UpdatedAt: new Date().toISOString() } as PolicyRecord : p));
    }
  };

  const handleAddOrEditSocial = (dataList: Partial<SocialProtectionRecord>[]) => {
    const data = dataList[0];
    if (editingSocial || data.id) {
      const targetId = editingSocial?.id || data.id;
      setSocialProtections(prev => prev.map(s => s.id === targetId ? { ...s, ...data, UpdatedAt: new Date().toISOString() } as SocialProtectionRecord : s));
    } else {
      const newRecords = dataList.map(data => ({
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'Admin',
        Status: 'Active'
      })) as SocialProtectionRecord[];
      setSocialProtections(prev => [...prev, ...newRecords]);
    }
    setIsSocialFormOpen(false);
    setEditingSocial(undefined);
  };

  const handleDeleteSocial = (id: string) => {
    if (window.confirm('Xác nhận ngưng quản lý hồ sơ bảo trợ này?')) {
      setSocialProtections(prev => prev.map(s => s.id === id ? { ...s, Status: 'Inactive', UpdatedAt: new Date().toISOString() } as SocialProtectionRecord : s));
    }
  };

  const handleAddOrEditStreet = (data: Partial<Street>) => {
    if (editingStreet) {
      setStreets(prev => prev.map(s => s.id === editingStreet.id ? { ...s, ...data } as Street : s));
    } else {
      setStreets(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as Street]);
    }
    setIsStreetFormOpen(false);
    setEditingStreet(undefined);
  };

  const handleDeleteStreet = (id: string) => {
    if (window.confirm('Xác nhận xóa đường này?')) {
      setStreets(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddOrEditRel = (data: Partial<RelationshipType>) => {
    if (editingRel) {
      setRelationships(prev => prev.map(r => r.id === editingRel.id ? { ...r, ...data } as RelationshipType : r));
    } else {
      setRelationships(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as RelationshipType]);
    }
    setIsRelFormOpen(false);
    setEditingRel(undefined);
  };

  const handleDeleteRel = (id: string) => {
    if (window.confirm('Xác nhận xóa loại quan hệ này?')) {
      setRelationships(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleAddOrEditGs = (data: Partial<GeneralStatus>) => {
    if (editingGs) {
      setGeneralStatuses(prev => prev.map(s => s.id === editingGs.id ? { ...s, ...data } as GeneralStatus : s));
    } else {
      setGeneralStatuses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as GeneralStatus]);
    }
    setIsGsFormOpen(false);
    setEditingGs(undefined);
  };

  const handleDeleteGs = (id: string) => {
    if (window.confirm('Xác nhận xóa tình trạng này?')) {
      setGeneralStatuses(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddOrEditMt = (data: Partial<MeritType>) => {
    if (editingMt) {
      setMeritTypes(prev => prev.map(m => m.id === editingMt.id ? { ...m, ...data } as MeritType : m));
    } else {
      setMeritTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as MeritType]);
    }
    setIsMtFormOpen(false);
    setEditingMt(undefined);
  };

  const handleDeleteMt = (id: string) => {
    if (window.confirm('Xác nhận xóa loại đối tượng này?')) {
      setMeritTypes(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddOrEditMdt = (data: Partial<MedalType>) => {
    if (editingMdt) {
      setMedalTypes(prev => prev.map(m => m.id === editingMdt.id ? { ...m, ...data } as MedalType : m));
    } else {
      setMedalTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as MedalType]);
    }
    setIsMdtFormOpen(false);
    setEditingMdt(undefined);
  };

  const handleDeleteMdt = (id: string) => {
    if (window.confirm('Xác nhận xóa loại huân chương này?')) {
      setMedalTypes(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddOrEditPt = (data: Partial<PolicyType>) => {
    if (editingPt) {
      setPolicyTypes(prev => prev.map(p => p.id === editingPt.id ? { ...p, ...data } as PolicyType : p));
    } else {
      setPolicyTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as PolicyType]);
    }
    setIsPtFormOpen(false);
    setEditingPt(undefined);
  };

  const handleDeletePt = (id: string) => {
    if (window.confirm('Xác nhận xóa loại diện chính sách này?')) {
      setPolicyTypes(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddOrEditSpt = (data: Partial<SocialProtectionType>) => {
    if (editingSpt) {
      setSocialProtectionTypes(prev => prev.map(p => p.id === editingSpt.id ? { ...p, ...data } as SocialProtectionType : p));
    } else {
      setSocialProtectionTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as SocialProtectionType]);
    }
    setIsSptFormOpen(false);
    setEditingSpt(undefined);
  };

  const handleDeleteSpt = (id: string) => {
    if (window.confirm('Xác nhận xóa loại diện bảo trợ này?')) {
      setSocialProtectionTypes(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddOrEditBank = (data: Partial<Bank>) => {
    if (editingBank) {
      setBanks(prev => prev.map(b => b.id === editingBank.id ? { ...b, ...data } as Bank : b));
    } else {
      setBanks(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as Bank]);
    }
    setIsBankFormOpen(false);
    setEditingBank(undefined);
  };

  const handleDeleteBank = (id: string) => {
    if (window.confirm('Xác nhận xóa ngân hàng này khỏi danh mục?')) {
      setBanks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleAddOrEditNb = (data: Partial<Neighborhood>) => {
    if (editingNb) {
      setNeighborhoods(prev => prev.map(n => n.id === editingNb.id ? { ...n, ...data } as Neighborhood : n));
    } else {
      setNeighborhoods(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as Neighborhood]);
    }
    setIsNbFormOpen(false);
    setEditingNb(undefined);
  };

  const handleDeleteNb = (id: string) => {
    if (window.confirm('Xác nhận xóa khu phố này?')) {
      setNeighborhoods(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleSaveWardBoundary = (data: WardBoundary) => {
    setWardBoundary(data);
    alert('Đã cập nhật ranh giới phường thành công!');
  };

  const renderHeaderButton = () => {
    const showExport = ['records', 'public_land', 'generals', 'merits', 'medals', 'policies', 'social_protections'].includes(activeSidebarTab);
    
    return (
      <div className="flex items-center gap-2">
        {showExport && (
          <button 
            onClick={() => handleExportExcel(activeSidebarTab)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all active:scale-95"
          >
            <FileSpreadsheet size={18} /> Xuất Excel
          </button>
        )}
        {activeSidebarTab === 'records' && (
          <button onClick={() => { setEditingRecord(undefined); setIsFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm số nhà
          </button>
        )}
        {activeSidebarTab === 'public_land' && (
          <button onClick={() => { setEditingLand(undefined); setIsLandFormOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm đất công
          </button>
        )}
        {activeSidebarTab === 'generals' && (
          <button onClick={() => { setEditingGeneral(undefined); setIsGeneralFormOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm tướng lĩnh
          </button>
        )}
        {activeSidebarTab === 'merits' && (
          <button onClick={() => { setEditingMerit(undefined); setIsMeritFormOpen(true); }} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm NCC mới
          </button>
        )}
        {activeSidebarTab === 'medals' && (
          <button onClick={() => { setEditingMedal(undefined); setIsMedalFormOpen(true); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm Huân chương KC
          </button>
        )}
        {activeSidebarTab === 'policies' && (
          <button onClick={() => { setEditingPolicy(undefined); setIsPolicyFormOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm Hồ sơ chính sách
          </button>
        )}
        {activeSidebarTab === 'social_protections' && (
          <button onClick={() => { setEditingSocial(undefined); setIsSocialFormOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm hồ sơ bảo trợ
          </button>
        )}
        {activeSidebarTab === 'bank_management' && (
          <button onClick={() => { setEditingBank(undefined); setIsBankFormOpen(true); }} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm ngân hàng
          </button>
        )}
        {activeSidebarTab === 'streets' && (
          <button onClick={() => { setEditingStreet(undefined); setIsStreetFormOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm đường mới
          </button>
        )}
        {activeSidebarTab === 'relationships' && (
          <button onClick={() => { setEditingRel(undefined); setIsRelFormOpen(true); }} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm loại quan hệ
          </button>
        )}
        {activeSidebarTab === 'neighborhoods' && (
          <button onClick={() => { setEditingNb(undefined); setIsNbFormOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm khu phố mới
          </button>
        )}
        {activeSidebarTab === 'general_statuses' && (
          <button onClick={() => { setEditingGs(undefined); setIsGsFormOpen(true); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm tình trạng
          </button>
        )}
        {activeSidebarTab === 'merit_types' && (
          <button onClick={() => { setEditingMt(undefined); setIsMtFormOpen(true); }} className="flex items-center gap-2 bg-rose-800 hover:bg-rose-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm loại đối tượng
          </button>
        )}
        {activeSidebarTab === 'medal_types' && (
          <button onClick={() => { setEditingMdt(undefined); setIsMdtFormOpen(true); }} className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm loại huân chương
          </button>
        )}
        {activeSidebarTab === 'policy_types' && (
          <button onClick={() => { setEditingPt(undefined); setIsPtFormOpen(true); }} className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm loại diện CS
          </button>
        )}
        {activeSidebarTab === 'social_protection_types' && (
          <button onClick={() => { setEditingSpt(undefined); setIsSptFormOpen(true); }} className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all">
            <Plus size={18} /> Thêm loại diện BT
          </button>
        )}
      </div>
    );
  };

  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const renderContent = () => {
    switch(activeSidebarTab) {
      case 'records':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ" value={records.length.toString()} icon={<Home className="text-blue-600" />} />
              <StatsCard label="Hoạt động" value={records.filter(r => r.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Tranh chấp" value={records.filter(r => r.TranhChap).length.toString()} icon={<AlertCircle className="text-orange-600" />} />
              <StatsCard label="Đã xóa" value={records.filter(r => r.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                  <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><List size={16} /> Danh sách</button>
                  <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><MapIcon size={16} /> Bản đồ</button>
                </div>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang dùng" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã xóa" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                {viewMode === 'list' ? (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                        <th className="px-6 py-4">Chủ hộ & CCCD</th>
                        <th className="px-6 py-4">Địa chỉ số nhà</th>
                        <th className="px-6 py-4">Tờ/Thửa</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getPaginatedData(filteredRecords).map(record => (
                        <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">{record.TenChuHo ? record.TenChuHo.charAt(0) : '?'}</div>
                              <div className="min-w-0"><p className="text-sm font-bold text-slate-800 truncate">{record.TenChuHo || ''}</p><p className="text-[10px] text-slate-400">CCCD: {record.SoCCCD || ''}</p></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-700">{record.SoNha ? `SN ${record.SoNha} ` : ''}{record.Duong || ''}</p>
                            <p className="text-[10px] text-slate-400 italic">{record.KDC || ''}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">T{record.SoTo || ''}-Th{record.SoThua || ''}</span></td>
                          <td className="px-6 py-4">{record.TranhChap ? <span className="text-[10px] text-orange-600 font-bold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">Tranh chấp</span> : <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Ổn định</span>}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-slate-400">
                              <button 
                                onClick={() => { setSelectedHouseForRelated(record); setIsRelatedManagerOpen(true); }} 
                                className="p-1.5 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                title="Quản lý đối tượng liên kết"
                              >
                                <Users size={16} />
                              </button>
                              <button onClick={() => { setEditingRecord(record); setIsFormOpen(true); }} className="p-1.5 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><Edit size={14} /></button>
                              {record.Status === 'Active' && <button onClick={() => handleDeleteHouse(record.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full w-full"><MapView center={[10.7719, 106.6983]} markers={filteredRecords.map(r => ({ id: r.id, lat: r.X, lng: r.Y, label: `${r.SoNha || ''} ${r.Duong || ''}` }))} /></div>
                )}
              </div>
              {viewMode === 'list' && <Pagination totalItems={filteredRecords.length} currentPage={currentPage} onPageChange={setCurrentPage} />}
            </div>
          </div>
        );
      case 'search_by_house':
        return (
          <HouseLookup 
            houses={records}
            generals={generals}
            merits={merits}
            medals={medals}
            policies={policies}
            socialProtections={socialProtections}
          />
        );
      case 'public_land':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng thửa đất công" value={publicLands.length.toString()} icon={<Landmark className="text-amber-600" />} />
              <StatsCard label="Đang sử dụng" value={publicLands.filter(l => l.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Đất trống" value={publicLands.filter(l => (l.Hientrang || '').toLowerCase().includes('trống')).length.toString()} icon={<Info className="text-blue-600" />} />
              <StatsCard label="Diện tích tổng" value={publicLands.reduce((acc, l) => acc + (l.Dientich || 0), 0).toLocaleString() + ' m²'} icon={<MapIcon className="text-indigo-600" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
               <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                  <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><List size={16} /> Danh sách</button>
                  <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><MapIcon size={16} /> Bản đồ</button>
                </div>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã thu hồi" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                {viewMode === 'list' ? (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                        <th className="px-6 py-4">Vị trí & Số nhà</th>
                        <th className="px-6 py-4">Đơn vị Quản lý / Sử dụng</th>
                        <th className="px-6 py-4">Diện tích (m²)</th>
                        <th className="px-6 py-4">Hiện trạng</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getPaginatedData(filteredPublicLand).map(land => (
                        <tr key={land.id} className="hover:bg-amber-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-800">T{land.To || ''} - Th{land.Thua || ''}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(land.LinkedHouseId) || land.Phuong || ''}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-700">{land.Donviquanl || ''}</p>
                            <p className="text-[10px] text-slate-400 italic">Sử dụng: {land.Donvisudun || ''}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{(land.Dientich || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">{land.Hientrang || ''}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditingLand(land); setIsLandFormOpen(true); }} className="p-1.5 hover:bg-amber-600 hover:text-white text-amber-600 rounded-lg transition-colors"><Edit size={14} /></button>
                              {land.Status === 'Active' && <button onClick={() => handleDeleteLand(land.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full w-full">
                    <MapView 
                      center={[10.7719, 106.6983]} 
                      markers={filteredPublicLand.map(l => ({ id: l.id, lat: l.X, lng: l.Y, label: `Đất công T${l.To || ''}-Th${l.Thua || ''}: ${l.Hientrang || ''}` }))} 
                      polygons={filteredPublicLand.filter(l => l.geometry && l.geometry.length > 2).map(l => ({
                        id: l.id,
                        points: l.geometry!,
                        label: `T${l.To || ''}/Th${l.Thua || ''}`,
                        color: (l.Hientrang || '').toLowerCase().includes('trống') ? '#fbbf24' : '#3b82f6'
                      }))}
                    />
                  </div>
                )}
              </div>
              {viewMode === 'list' && <Pagination totalItems={filteredPublicLand.length} currentPage={currentPage} onPageChange={setCurrentPage} />}
            </div>
          </div>
        );
      case 'bank_management':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Landmark className="text-blue-700" /> Quản lý danh mục Ngân hàng</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400">
                      <th className="px-6 py-4 w-24">Mã</th>
                      <th className="px-6 py-4 w-40">Viết tắt</th>
                      <th className="px-6 py-4">Tên đầy đủ ngân hàng</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(filteredBanks).map(bank => (
                      <tr key={bank.id} className="hover:bg-slate-50 group">
                        <td className="px-6 py-4 font-mono text-xs text-blue-600">{bank.code || '--'}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{bank.shortName || ''}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{bank.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingBank(bank); setIsBankFormOpen(true); }} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteBank(bank.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredBanks.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'generals':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ tướng lĩnh" value={generals.length.toString()} icon={<ShieldAlert className="text-indigo-600" />} />
              <StatsCard label="Diện TW" value={generals.filter(g => g.Dien === 'TW').length.toString()} icon={<Globe size={14} className="text-blue-600" />} />
              <StatsCard label="Diện Thành ủy" value={generals.filter(g => g.Dien === 'Thành ủy').length.toString()} icon={<Building2 className="text-emerald-600" />} />
              <StatsCard label="Đã mất" value={generals.filter(g => g.TinhTrang === 'Đã mất').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                      <th className="px-6 py-4">Tướng lĩnh & Địa chỉ</th>
                      <th className="px-6 py-4">Quan hệ với chủ hộ</th>
                      <th className="px-6 py-4">Diện</th>
                      <th className="px-6 py-4">Tình trạng</th>
                      <th className="px-6 py-4 text-center">Người nhận thay</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPaginatedData(filteredGenerals).map(general => (
                      <tr key={general.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{general.HoTen || ''}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(general.LinkedHouseId) || 'Chưa liên kết'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{general.QuanHe || ''}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${general.Dien === 'TW' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{general.Dien || ''}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">{general.TinhTrang || ''}</td>
                        <td className="px-6 py-4 text-center">
                          {general.NguoiNhanThay ? <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{general.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingGeneral(general); setIsGeneralFormOpen(true); }} className="p-1.5 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-lg transition-colors"><Edit size={14} /></button>
                            {general.Status === 'Active' && <button onClick={() => handleDeleteGeneral(general.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredGenerals.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'merits':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ NCC" value={merits.length.toString()} icon={<Heart className="text-rose-600" />} />
              <StatsCard label="Đang hưởng trợ cấp" value={merits.filter(m => m.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Tổng kinh phí trợ cấp" value={merits.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString() + ' VNĐ'} icon={<Wallet className="text-blue-600" />} />
              <StatsCard label="Đã ngưng" value={merits.filter(m => m.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                      <th className="px-6 py-4">Đối tượng & Địa chỉ</th>
                      <th className="px-6 py-4">Quan hệ với chủ nhà</th>
                      <th className="px-6 py-4">Loại đối tượng</th>
                      <th className="px-6 py-4 text-center">Người nhận thay</th>
                      <th className="px-6 py-4 text-right">Số tiền trợ cấp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPaginatedData(filteredMerits).map(merit => (
                      <tr key={merit.id} className="hover:bg-rose-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{merit.HoTen || ''}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(merit.LinkedHouseId) || 'Chưa liên kết'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{merit.QuanHe || ''}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{merit.LoaiDoiTuong || ''}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {merit.NguoiNhanThay ? <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">{merit.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">{(merit.SoTien || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingMerit(merit); setIsMeritFormOpen(true); }} className="p-1.5 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg transition-colors"><Edit size={14} /></button>
                            {merit.Status === 'Active' && <button onClick={() => handleDeleteMerit(merit.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredMerits.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'medals':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ Huân chương" value={medals.length.toString()} icon={<Award className="text-amber-600" />} />
              <StatsCard label="Đang hưởng trợ cấp" value={medals.filter(m => m.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Tổng kinh phí trợ cấp" value={medals.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString() + ' VNĐ'} icon={<Wallet className="text-blue-600" />} />
              <StatsCard label="Đã ngưng/Lưu trữ" value={medals.filter(m => m.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                      <th className="px-6 py-4">Họ tên & Địa chỉ</th>
                      <th className="px-6 py-4">Quan hệ với chủ nhà</th>
                      <th className="px-6 py-4">Loại huân chương</th>
                      <th className="px-6 py-4 text-center">Người nhận thay</th>
                      <th className="px-6 py-4 text-right">Số tiền trợ cấp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPaginatedData(filteredMedals).map(medal => (
                      <tr key={medal.id} className="hover:bg-amber-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{medal.HoTen || ''}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(medal.LinkedHouseId) || 'Chưa liên kết'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{medal.QuanHe || ''}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{medal.LoaiDoiTuong || ''}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {medal.NguoiNhanThay ? <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">{medal.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">{(medal.SoTien || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingMedal(medal); setIsMedalFormOpen(true); }} className="p-1.5 hover:bg-amber-600 hover:text-white text-amber-600 rounded-lg transition-colors"><Edit size={14} /></button>
                            {medal.Status === 'Active' && <button onClick={() => handleDeleteMedal(medal.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredMedals.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'policies':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Hồ sơ Chính sách" value={policies.length.toString()} icon={<ShieldCheck className="text-indigo-600" />} />
              <StatsCard label="Đang hưởng trợ cấp" value={policies.filter(p => p.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Tổng kinh phí trợ cấp" value={policies.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString() + ' VNĐ'} icon={<Wallet className="text-blue-600" />} />
              <StatsCard label="Đã ngưng" value={policies.filter(p => p.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                      <th className="px-6 py-4">Đối tượng & Địa chỉ</th>
                      <th className="px-6 py-4">Diện chính sách</th>
                      <th className="px-6 py-4 text-center">Người nhận thay</th>
                      <th className="px-6 py-4 text-right">Số hồ sơ / Tiền trợ cấp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPaginatedData(filteredPolicies).map(policy => (
                      <tr key={policy.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{policy.HoTen || ''}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(policy.LinkedHouseId) || 'Chưa liên kết'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{policy.LoaiDienChinhSach || ''}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {policy.NguoiNhanThay ? <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{policy.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xs font-mono text-slate-500">{policy.SoQuanLyHS || ''}</p>
                          <p className="text-sm font-black text-emerald-600">{(policy.SoTien || 0).toLocaleString()} VNĐ</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingPolicy(policy); setIsPolicyFormOpen(true); }} className="p-1.5 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-lg transition-colors"><Edit size={14} /></button>
                            {policy.Status === 'Active' && <button onClick={() => handleDeletePolicy(policy.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredPolicies.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'social_protections':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Hồ sơ Bảo trợ XH" value={socialProtections.length.toString()} icon={<HandHeart className="text-emerald-600" />} />
              <StatsCard label="Đang hưởng trợ cấp" value={socialProtections.filter(s => s.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Tổng kinh phí trợ cấp" value={socialProtections.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString() + ' VNĐ'} icon={<Wallet className="text-blue-600" />} />
              <StatsCard label="Đã ngưng" value={socialProtections.filter(s => s.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang quản lý" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b">
                      <th className="px-6 py-4">Đối tượng & Địa chỉ</th>
                      <th className="px-6 py-4">Diện bảo trợ</th>
                      <th className="px-6 py-4">Quan hệ với chủ nhà</th>
                      <th className="px-6 py-4 text-center">Người nhận thay</th>
                      <th className="px-6 py-4 text-right">Mức trợ cấp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPaginatedData(filteredSocials).map(social => (
                      <tr key={social.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{social.HoTen || ''}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Số nhà: {getHouseAddress(social.LinkedHouseId) || 'Chưa liên kết'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{social.LoaiDien || ''}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{social.QuanHe || ''}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {social.NguoiNhanThay ? <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{social.NguoiNhanThay}</span> : <span className="text-[10px] text-slate-400 italic">Chính chủ</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">{(social.SoTien || 0).toLocaleString()} VNĐ</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingSocial(social); setIsSocialFormOpen(true); }} className="p-1.5 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-lg transition-colors"><Edit size={14} /></button>
                            {social.Status === 'Active' && <button onClick={() => handleDeleteSocial(social.id)} className="p-1.5 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredSocials.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'general_statuses':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Info className="text-slate-600" /> Quản lý danh mục Tình trạng tướng lĩnh</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã</th><th className="px-6 py-4">Tên tình trạng</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(generalStatuses.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(st => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{st.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{st.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingGs(st); setIsGsFormOpen(true); }} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteGs(st.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={generalStatuses.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'merit_types':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Heart className="text-rose-600" /> Quản lý danh mục Loại đối tượng NCC</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã</th><th className="px-6 py-4">Tên loại đối tượng</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(meritTypes.filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (m.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(mt => (
                      <tr key={mt.id} className="hover:bg-rose-50">
                        <td className="px-6 py-4 font-mono text-xs text-rose-500">{mt.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{mt.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingMt(mt); setIsMtFormOpen(true); }} className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteMt(mt.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={meritTypes.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'medal_types':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Award className="text-amber-600" /> Quản lý danh mục Loại huân chương</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã</th><th className="px-6 py-4">Tên loại huân chương/huy chương</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(medalTypes.filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (m.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(md => (
                      <tr key={md.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 font-mono text-xs text-amber-600">{md.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{md.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingMdt(md); setIsMdtFormOpen(true); }} className="p-1.5 hover:bg-amber-100 text-amber-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteMdt(md.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={medalTypes.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'policy_types':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="text-indigo-600" /> Quản lý danh mục Loại diện chính sách</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã</th><th className="px-6 py-4">Tên diện chính sách</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(policyTypes.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(pt => (
                      <tr key={pt.id} className="hover:bg-indigo-50">
                        <td className="px-6 py-4 font-mono text-xs text-indigo-500">{pt.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{pt.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingPt(pt); setIsPtFormOpen(true); }} className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeletePt(pt.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={policyTypes.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'streets':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Milestone className="text-blue-600" /> Quản lý danh mục Đường</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã đường</th><th className="px-6 py-4">Tên đường</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(streets.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(st => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs text-blue-600">{st.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{st.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingStreet(st); setIsStreetFormOpen(true); }} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteStreet(st.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={streets.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'social_protection_types':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><HandHeart className="text-emerald-600" /> Quản lý danh mục Loại diện bảo trợ</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã diện</th><th className="px-6 py-4">Tên diện bảo trợ xã hội</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(socialProtectionTypes.filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(spt => (
                      <tr key={spt.id} className="hover:bg-emerald-50">
                        <td className="px-6 py-4 font-mono text-xs text-emerald-600">{spt.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{spt.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingSpt(spt); setIsSptFormOpen(true); }} className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteSpt(spt.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={socialProtectionTypes.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'relationships':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-pink-600" /> Quản lý danh mục Mối quan hệ với chủ hộ</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Mã</th><th className="px-6 py-4">Tên mối quan hệ với chủ hộ</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {getPaginatedData(relationships.filter(r => (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.code || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(rel => (
                      <tr key={rel.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs text-pink-600">{rel.code || ''}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{rel.name || ''}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingRel(rel); setIsRelFormOpen(true); }} className="p-1.5 hover:bg-pink-100 text-pink-600 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteRel(rel.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={relationships.length} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      case 'neighborhoods':
        return (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 className="text-blue-600" /> Quản lý danh mục Khu phố / KDC</h2>
              <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
              >
                {viewMode === 'list' ? <MapIcon size={18} /> : <List size={18} />}
                {viewMode === 'list' ? 'Xem bản đồ ranh giới' : 'Xem danh sách'}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              {viewMode === 'list' ? (
                <>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-bold uppercase text-slate-400"><th className="px-6 py-4">Tên khu phố MỚI</th><th className="px-6 py-4">Tên khu phố CŨ</th><th className="px-6 py-4">Ranh giới</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {getPaginatedData(neighborhoods.filter(n => (n.nameNew || '').toLowerCase().includes(searchTerm.toLowerCase()) || (n.nameOld || '').toLowerCase().includes(searchTerm.toLowerCase()))).map(nb => (
                          <tr key={nb.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{nb.nameNew || ''}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{nb.nameOld || ''}</td>
                            <td className="px-6 py-4">
                              {nb.geometry && nb.geometry.length > 0 ? (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Đã vẽ ranh giới</span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 italic">Chưa xác định</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => { setEditingNb(nb); setIsNbFormOpen(true); }} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteNb(nb.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg ml-2 transition-colors"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination totalItems={neighborhoods.length} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
              ) : (
                <div className="flex-1">
                  <MapView 
                    center={[10.7719, 106.6983]} 
                    polygons={neighborhoods.filter(n => n.geometry && n.geometry.length > 2).map(n => ({
                      id: n.id,
                      points: n.geometry!,
                      label: n.nameNew || '',
                      color: '#8b5cf6'
                    }))}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'ward_boundary':
        return (
          <div className="flex-1 p-6 overflow-hidden">
            <WardBoundaryForm 
              initialData={wardBoundary} 
              onClose={() => setActiveSidebarTab('records')}
              onSubmit={handleSaveWardBoundary}
            />
          </div>
        );
      case 'planning':
        const mapHouseMarkers = mapLayers.houses ? records
          .filter(r => (r.SoNha || '').toLowerCase().includes(mapSearch.toLowerCase()) || (r.Duong || '').toLowerCase().includes(mapSearch.toLowerCase()) || (r.TenChuHo || '').toLowerCase().includes(mapSearch.toLowerCase()))
          .map(r => ({ id: `house-${r.id}`, lat: r.X, lng: r.Y, label: `Số nhà: ${r.SoNha || ''} ${r.Duong || ''}` })) : [];

        const mapLandMarkers = mapLayers.publicLand ? publicLands
          .filter(l => (l.Thua || '').includes(mapSearch) || (l.To || '').includes(mapSearch) || (l.Donviquanl || '').toLowerCase().includes(mapSearch.toLowerCase()))
          .map(l => ({ id: `land-m-${l.id}`, lat: l.X, lng: l.Y, label: `Đất công: T${l.To || ''}/Th${l.Thua || ''}` })) : [];

        const mapLandPolygons = mapLayers.publicLand ? publicLands
          .filter(l => l.geometry && l.geometry.length > 2 && ((l.Thua || '').includes(mapSearch) || (l.To || '').includes(mapSearch)))
          .map(l => ({ id: `land-p-${l.id}`, points: l.geometry!, label: `Đất công: T${l.To || ''}/Th${l.Thua || ''}`, color: '#fbbf24' })) : [];

        const mapNbPolygons = mapLayers.neighborhoods ? neighborhoods
          .filter(n => n.geometry && n.geometry.length > 2 && ((n.nameNew || '').toLowerCase().includes(mapSearch.toLowerCase())))
          .map(n => ({ id: `nb-p-${n.id}`, points: n.geometry!, label: n.nameNew || '', color: '#8b5cf6' })) : [];

        const mapWardPolygon = mapLayers.ward && wardBoundary.geometry && wardBoundary.geometry.length > 2 ? [{
          id: 'ward-poly-view',
          points: wardBoundary.geometry,
          label: wardBoundary.name || '',
          color: '#3b82f6'
        }] : [];

        return (
          <div className="flex-1 p-6 flex flex-col gap-4 relative">
             <div className="bg-white p-2 rounded-2xl border border-slate-200 flex-1 flex flex-col overflow-hidden relative shadow-sm">
                <div className="absolute top-6 left-6 z-10 w-72 flex flex-col gap-2">
                   <div className="bg-white p-3 rounded-xl shadow-xl border flex flex-col gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                        <Search size={16} className="text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Tìm trên bản đồ..." 
                          className="bg-transparent border-none outline-none text-sm w-full"
                          value={mapSearch}
                          onChange={(e) => setMapSearch(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lớp dữ liệu</p>
                        <LayerToggle 
                          active={mapLayers.ward} 
                          onClick={() => setMapLayers({...mapLayers, ward: !mapLayers.ward})} 
                          label="Ranh giới Phường" 
                          icon={<Globe size={14} className="text-blue-500" />} 
                        />
                        <LayerToggle 
                          active={mapLayers.houses} 
                          onClick={() => setMapLayers({...mapLayers, houses: !mapLayers.houses})} 
                          label="Hồ sơ Số nhà" 
                          icon={<Home size={14} className="text-blue-500" />} 
                        />
                        <LayerToggle 
                          active={mapLayers.publicLand} 
                          onClick={() => setMapLayers({...mapLayers, publicLand: !mapLayers.publicLand})} 
                          label="Quản lý Đất công" 
                          icon={<Landmark size={14} className="text-amber-500" />} 
                        />
                        <LayerToggle 
                          active={mapLayers.neighborhoods} 
                          onClick={() => setMapLayers({...mapLayers, neighborhoods: !mapLayers.neighborhoods})} 
                          label="Ranh giới Khu phố" 
                          icon={<Building2 size={14} className="text-violet-500" />} 
                        />
                      </div>
                   </div>
                </div>

                <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                   <MapView 
                    center={[10.7719, 106.6983]} 
                    markers={[...mapHouseMarkers, ...mapLandMarkers]} 
                    polygons={[...mapWardPolygon, ...mapLandPolygons, ...mapNbPolygons]}
                   />
                </div>
             </div>
          </div>
        );
      case 'reports':
        return (
          <ReportsView 
            records={records}
            publicLands={publicLands}
            generals={generals}
            merits={merits}
            medals={medals}
            policies={policies}
            socialProtections={socialProtections}
            streets={streets}
            neighborhoods={neighborhoods}
            relationships={relationships}
            generalStatuses={generalStatuses}
            meritTypes={meritTypes}
            medalTypes={medalTypes}
            policyTypes={policyTypes}
            socialProtectionTypes={socialProtectionTypes}
            banks={banks}
            onUpdateHouse={handleAddOrEditHouse}
            onUpdateLand={handleAddOrEditLand}
            onUpdateGeneral={handleAddOrEditGeneral}
            onUpdateMerit={handleAddOrEditMerit}
            onUpdateMedal={handleAddOrEditMedal}
            onUpdatePolicy={handleAddOrEditPolicy}
            onUpdateSocial={handleAddOrEditSocial}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col text-slate-400 shrink-0 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Home size={20} /></div>
          <span className="font-bold text-lg tracking-tight">QLSNDC-GIS</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
          <NavItem icon={<Database size={18} />} label="Hồ sơ số nhà" active={activeSidebarTab === 'records'} onClick={() => setActiveSidebarTab('records')} />
          <NavItem icon={<Search size={18} />} label="Tra cứu theo Số nhà" active={activeSidebarTab === 'search_by_house'} onClick={() => setActiveSidebarTab('search_by_house')} />
          <NavItem icon={<Landmark size={18} />} label="Quản lý Đất công" active={activeSidebarTab === 'public_land'} onClick={() => setActiveSidebarTab('public_land')} />
          <NavItem icon={<ShieldAlert size={18} />} label="Quản lý Tướng lĩnh" active={activeSidebarTab === 'generals'} onClick={() => setActiveSidebarTab('generals')} />
          <NavItem icon={<Heart size={18} />} label="Người có công" active={activeSidebarTab === 'merits'} onClick={() => setActiveSidebarTab('merits')} />
          <NavItem icon={<Award size={18} />} label="Huân chương KC" active={activeSidebarTab === 'medals'} onClick={() => setActiveSidebarTab('medals')} />
          <NavItem icon={<ShieldCheck size={18} />} label="Đối tượng chính sách" active={activeSidebarTab === 'policies'} onClick={() => setActiveSidebarTab('policies')} />
          <NavItem icon={<HandHeart size={18} />} label="Đối tượng bảo trợ" active={activeSidebarTab === 'social_protections'} onClick={() => setActiveSidebarTab('social_protections')} />
          <NavItem icon={<BarChart3 size={18} />} label="Thống kê & Báo cáo" active={activeSidebarTab === 'reports'} onClick={() => setActiveSidebarTab('reports')} />
          <NavItem icon={<MapIcon size={18} />} label="Bản đồ" active={activeSidebarTab === 'planning'} onClick={() => setActiveSidebarTab('planning')} />
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh mục hệ thống</div>
          <NavItem icon={<Globe size={18} />} label="Ranh giới Phường" active={activeSidebarTab === 'ward_boundary'} onClick={() => setActiveSidebarTab('ward_boundary')} />
          <NavItem icon={<Landmark size={18} className="text-blue-400" />} label="Danh mục Ngân hàng" active={activeSidebarTab === 'bank_management'} onClick={() => setActiveSidebarTab('bank_management')} />
          <NavItem icon={<Milestone size={18} />} label="Danh mục Đường" active={activeSidebarTab === 'streets'} onClick={() => setActiveSidebarTab('streets')} />
          <NavItem icon={<Building2 size={18} />} label="Danh mục Khu phố" active={activeSidebarTab === 'neighborhoods'} onClick={() => setActiveSidebarTab('neighborhoods')} />
          <NavItem icon={<Heart size={18} className="text-rose-400" />} label="Loại đối tượng NCC" active={activeSidebarTab === 'merit_types'} onClick={() => setActiveSidebarTab('merit_types')} />
          <NavItem icon={<Award size={18} className="text-amber-400" />} label="Loại huân chương" active={activeSidebarTab === 'medal_types'} onClick={() => setActiveSidebarTab('medal_types')} />
          <NavItem icon={<Scale size={18} className="text-indigo-400" />} label="Loại diện chính sách" active={activeSidebarTab === 'policy_types'} onClick={() => setActiveSidebarTab('policy_types')} />
          <NavItem icon={<HandHeart size={18} className="text-emerald-400" />} label="Loại diện bảo trợ" active={activeSidebarTab === 'social_protection_types'} onClick={() => setActiveSidebarTab('social_protection_types')} />
          <NavItem icon={<Users size={18} />} label="Quan hệ chủ hộ" active={activeSidebarTab === 'relationships'} onClick={() => setActiveSidebarTab('relationships')} />
          <NavItem icon={<Info size={18} />} label="Tình trạng tướng lĩnh" active={activeSidebarTab === 'general_statuses'} onClick={() => setActiveSidebarTab('general_statuses')} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-xl w-72 max-md:hidden border">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-sm w-full font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {renderHeaderButton()}
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">{renderContent()}</main>
      </div>

      {isFormOpen && (
        <HouseForm 
          onClose={() => { setIsFormOpen(false); setEditingRecord(undefined); }} 
          onSubmit={handleAddOrEditHouse} 
          initialData={editingRecord} 
          isEditing={!!editingRecord} 
          streets={streets} 
          neighborhoods={neighborhoods} 
          relationshipTypes={relationships}
        />
      )}

      {isRelatedManagerOpen && selectedHouseForRelated && (
        <RelatedRecordsManager 
          house={selectedHouseForRelated}
          generals={generals.filter(g => g.LinkedHouseId === selectedHouseForRelated.id && g.Status === 'Active')}
          merits={merits.filter(m => m.LinkedHouseId === selectedHouseForRelated.id && m.Status === 'Active')}
          medals={medals.filter(m => m.LinkedHouseId === selectedHouseForRelated.id && m.Status === 'Active')}
          policies={policies.filter(p => p.LinkedHouseId === selectedHouseForRelated.id && p.Status === 'Active')}
          socialProtections={socialProtections.filter(s => s.LinkedHouseId === selectedHouseForRelated.id && s.Status === 'Active')}
          onClose={() => { setIsRelatedManagerOpen(false); setSelectedHouseForRelated(null); }}
          onAdd={handleAddRelated}
          onEdit={handleEditRelated}
          onDelete={handleDeleteRelated}
        />
      )}

      {isLandFormOpen && (
        <PublicLandForm onClose={() => { setIsLandFormOpen(false); setEditingLand(undefined); }} onSubmit={handleAddOrEditLand} initialData={editingLand} isEditing={!!editingLand} houseRecords={records} />
      )}
      {isGeneralFormOpen && (
        <GeneralForm 
          onClose={() => { setIsGeneralFormOpen(false); setEditingGeneral(undefined); }} 
          onSubmit={handleAddOrEditGeneral} 
          initialData={editingGeneral || (selectedHouseForRelated ? { LinkedHouseId: selectedHouseForRelated.id } : undefined)} 
          isEditing={!!editingGeneral} 
          houseRecords={records}
          relationshipTypes={relationships}
          generalStatuses={generalStatuses}
          banks={banks}
        />
      )}
      {isMeritFormOpen && (
        <MeritForm 
          onClose={() => { setIsMeritFormOpen(false); setEditingMerit(undefined); }} 
          onSubmit={handleAddOrEditMerit} 
          initialData={editingMerit || (selectedHouseForRelated ? { LinkedHouseId: selectedHouseForRelated.id } : undefined)} 
          isEditing={!!editingMerit} 
          houseRecords={records}
          relationshipTypes={relationships}
          meritTypes={meritTypes}
          banks={banks}
        />
      )}
      {isMedalFormOpen && (
        <MedalForm 
          onClose={() => { setIsMedalFormOpen(false); setEditingMedal(undefined); }} 
          onSubmit={handleAddOrEditMedal} 
          initialData={editingMedal || (selectedHouseForRelated ? { LinkedHouseId: selectedHouseForRelated.id } : undefined)} 
          isEditing={!!editingMedal} 
          houseRecords={records}
          relationshipTypes={relationships}
          medalTypes={medalTypes}
          banks={banks}
        />
      )}
      {isPolicyFormOpen && (
        <PolicyForm 
          onClose={() => { setIsPolicyFormOpen(false); setEditingPolicy(undefined); }} 
          onSubmit={handleAddOrEditPolicy} 
          initialData={editingPolicy || (selectedHouseForRelated ? { LinkedHouseId: selectedHouseForRelated.id } : undefined)} 
          isEditing={!!editingPolicy} 
          houseRecords={records}
          relationshipTypes={relationships}
          policyTypes={policyTypes}
          banks={banks}
        />
      )}
      {isSocialFormOpen && (
        <SocialProtectionForm 
          onClose={() => { setIsSocialFormOpen(false); setEditingSocial(undefined); }} 
          onSubmit={handleAddOrEditSocial} 
          initialData={editingSocial || (selectedHouseForRelated ? { LinkedHouseId: selectedHouseForRelated.id } : undefined)} 
          isEditing={!!editingSocial} 
          houseRecords={records}
          relationshipTypes={relationships}
          protectionTypes={socialProtectionTypes}
          banks={banks}
        />
      )}
      {isStreetFormOpen && (
        <StreetForm initialData={editingStreet} onClose={() => { setIsStreetFormOpen(false); setEditingStreet(undefined); }} onSubmit={handleAddOrEditStreet} />
      )}
      {isNbFormOpen && (
        <NeighborhoodForm initialData={editingNb} onClose={() => { setIsNbFormOpen(false); setEditingNb(undefined); }} onSubmit={handleAddOrEditNb} />
      )}
      {isRelFormOpen && (
        <RelationshipForm initialData={editingRel} onClose={() => { setIsRelFormOpen(false); setEditingRel(undefined); }} onSubmit={handleAddOrEditRel} />
      )}
      {isGsFormOpen && (
        <GeneralStatusForm initialData={editingGs} onClose={() => { setIsGsFormOpen(false); setEditingGs(undefined); }} onSubmit={handleAddOrEditGs} />
      )}
      {isMtFormOpen && (
        <MeritTypeForm initialData={editingMt} onClose={() => { setIsMtFormOpen(false); setEditingMt(undefined); }} onSubmit={handleAddOrEditMt} />
      )}
      {isMdtFormOpen && (
        <MedalTypeForm initialData={editingMdt} onClose={() => { setIsMdtFormOpen(false); setEditingMdt(undefined); }} onSubmit={handleAddOrEditMdt} />
      )}
      {isPtFormOpen && (
        <PolicyTypeForm initialData={editingPt} onClose={() => { setIsPtFormOpen(false); setEditingPt(undefined); }} onSubmit={handleAddOrEditPt} />
      )}
      {isSptFormOpen && (
        <SocialProtectionTypeForm initialData={editingSpt} onClose={() => { setIsSptFormOpen(false); setEditingSpt(undefined); }} onSubmit={handleAddOrEditSpt} />
      )}
      {isBankFormOpen && (
        <BankForm initialData={editingBank} onClose={() => { setIsBankFormOpen(false); setEditingBank(undefined); }} onSubmit={handleAddOrEditBank} />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl transition-all shrink-0 ${active ? 'bg-blue-600 text-white font-bold shadow-lg' : 'hover:bg-slate-800 hover:text-slate-200'}`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const StatsCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-all">
    <div className="min-w-0"><p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p><p className="text-xl font-black text-slate-900 truncate">{value}</p></div>
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">{icon}</div>
  </div>
);

const FilterButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight transition-all ${active ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>
);

const LayerToggle: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between w-full p-2 rounded-lg text-xs font-medium transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    {active ? <Eye size={14} /> : <EyeOff size={14} className="opacity-40" />}
  </button>
);

const Pagination: React.FC<{ totalItems: number; currentPage: number; onPageChange: (page: number) => void }> = ({ totalItems, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-3 border-t bg-slate-50/50 flex items-center justify-between shrink-0">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        HIỂN THỊ {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} / {totalItems} KẾT QUẢ
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={14} className="text-slate-600" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
              currentPage === page 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={14} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
};

export default App;
