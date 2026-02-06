
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Map as MapIcon, List, Filter, 
  Trash2, Edit, CheckCircle, AlertCircle,
  Home, Database, MapPin, Milestone, Building2, Landmark, Info, Layers, Globe, Users, ShieldAlert, Award, Wallet, Ruler, FileText, ClipboardList, Mail, Phone, Heart, Eye, EyeOff, X
} from 'lucide-react';
import { HouseNumberRecord, Street, Neighborhood, PublicLandRecord, WardBoundary, RelationshipType, GeneralRecord, GeneralStatus, MedalRecord, MedalType, MeritRecord, MeritType } from './types';
import { INITIAL_DATA, INITIAL_STREETS, INITIAL_NEIGHBORHOODS, INITIAL_PUBLIC_LAND, INITIAL_WARD_BOUNDARY, INITIAL_RELATIONSHIPS, INITIAL_GENERAL_STATUS, INITIAL_MEDAL_TYPES, INITIAL_MERIT_TYPES } from './constants';
import HouseForm from './components/HouseForm';
import MapView from './components/MapView';
import StreetForm from './components/StreetForm';
import NeighborhoodForm from './components/NeighborhoodForm';
import PublicLandForm from './components/PublicLandForm';
import WardBoundaryForm from './components/WardBoundaryForm';
import RelationshipForm from './components/RelationshipForm';
import GeneralForm from './components/GeneralForm';
import GeneralStatusForm from './components/GeneralStatusForm';
import MedalForm from './components/MedalForm';
import MedalTypeForm from './components/MedalTypeForm';
import MeritForm from './components/MeritForm';
import MeritTypeForm from './components/MeritTypeForm';

type SidebarTab = 'records' | 'public_land' | 'generals' | 'medals' | 'merits' | 'planning' | 'streets' | 'neighborhoods' | 'ward_boundary' | 'relationships' | 'general_statuses' | 'medal_types' | 'merit_types';

const App: React.FC = () => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('records');
  const [records, setRecords] = useState<HouseNumberRecord[]>(INITIAL_DATA);
  const [publicLands, setPublicLands] = useState<PublicLandRecord[]>(INITIAL_PUBLIC_LAND);
  const [generals, setGenerals] = useState<GeneralRecord[]>([]);
  const [medals, setMedals] = useState<MedalRecord[]>([]);
  const [merits, setMerits] = useState<MeritRecord[]>([]);
  const [streets, setStreets] = useState<Street[]>(INITIAL_STREETS);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(INITIAL_NEIGHBORHOODS);
  const [relationships, setRelationships] = useState<RelationshipType[]>(INITIAL_RELATIONSHIPS);
  const [generalStatuses, setGeneralStatuses] = useState<GeneralStatus[]>(INITIAL_GENERAL_STATUS);
  const [medalTypes, setMedalTypes] = useState<MedalType[]>(INITIAL_MEDAL_TYPES);
  const [meritTypes, setMeritTypes] = useState<MeritType[]>(INITIAL_MERIT_TYPES);
  const [wardBoundary, setWardBoundary] = useState<WardBoundary>(INITIAL_WARD_BOUNDARY);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // State cho Bản đồ GIS (Planning)
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [mapLayers, setMapLayers] = useState({
    houses: true,
    publicLand: true,
    neighborhoods: true,
    ward: true
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HouseNumberRecord | undefined>(undefined);
  
  const [isLandFormOpen, setIsLandFormOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<PublicLandRecord | undefined>(undefined);

  const [isGeneralFormOpen, setIsGeneralFormOpen] = useState(false);
  const [editingGeneral, setEditingGeneral] = useState<GeneralRecord | undefined>(undefined);

  const [isMedalFormOpen, setIsMedalFormOpen] = useState(false);
  const [editingMedal, setEditingMedal] = useState<MedalRecord | undefined>(undefined);

  const [isMeritFormOpen, setIsMeritFormOpen] = useState(false);
  const [editingMerit, setEditingMerit] = useState<MeritRecord | undefined>(undefined);
  
  const [isStreetFormOpen, setIsStreetFormOpen] = useState(false);
  const [editingStreet, setEditingStreet] = useState<Street | undefined>(undefined);
  
  const [isNbFormOpen, setIsNbFormOpen] = useState(false);
  const [editingNb, setEditingNb] = useState<Neighborhood | undefined>(undefined);

  const [isRelFormOpen, setIsRelFormOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<RelationshipType | undefined>(undefined);

  const [isGsFormOpen, setIsGsFormOpen] = useState(false);
  const [editingGs, setEditingGs] = useState<GeneralStatus | undefined>(undefined);

  const [isMtFormOpen, setIsMtFormOpen] = useState(false);
  const [editingMt, setEditingMt] = useState<MedalType | undefined>(undefined);

  const [isMetFormOpen, setIsMetFormOpen] = useState(false);
  const [editingMet, setEditingMet] = useState<MeritType | undefined>(undefined);

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active');

  // Filtering Logic
  const filteredRecords = useMemo(() => records.filter(r => (
    ((r.TenChuHo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (r.SoNha || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (r.SoCCCD || '').includes(searchTerm)) &&
    (activeFilter === 'all' ? true : activeFilter === 'active' ? r.Status === 'Active' : r.Status === 'Inactive')
  )), [records, searchTerm, activeFilter]);

  const filteredPublicLand = useMemo(() => publicLands.filter(r => (
    ((r.Donviquanl || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (r.Thua || '').includes(searchTerm)) &&
    (activeFilter === 'all' ? true : activeFilter === 'active' ? r.Status === 'Active' : r.Status === 'Inactive')
  )), [publicLands, searchTerm, activeFilter]);

  const filteredGenerals = useMemo(() => generals.filter(g => (
    (g.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === 'all' ? true : activeFilter === 'active' ? g.Status === 'Active' : g.Status === 'Inactive')
  )), [generals, searchTerm, activeFilter]);

  const filteredMedals = useMemo(() => medals.filter(m => (
    ((m.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (m.SoQuanLyHS || '').includes(searchTerm)) &&
    (activeFilter === 'all' ? true : activeFilter === 'active' ? m.Status === 'Active' : m.Status === 'Inactive')
  )), [medals, searchTerm, activeFilter]);

  const filteredMerits = useMemo(() => merits.filter(m => (
    ((m.HoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (m.SoQuanLyHS || '').includes(searchTerm)) &&
    (activeFilter === 'all' ? true : activeFilter === 'active' ? m.Status === 'Active' : m.Status === 'Inactive')
  )), [merits, searchTerm, activeFilter]);

  // Map view dynamic data based on search and layer toggles
  const mapData = useMemo(() => {
    const polygons: any[] = [];
    const markers: any[] = [];

    // Ranh giới phường
    if (mapLayers.ward) {
      polygons.push({
        id: 'ward-boundary',
        points: wardBoundary.geometry || [],
        label: wardBoundary.name,
        color: '#3b82f6'
      });
    }

    // Khu phố
    if (mapLayers.neighborhoods) {
      neighborhoods.forEach(nb => {
        if (nb.geometry && (mapSearchTerm === '' || nb.nameNew.toLowerCase().includes(mapSearchTerm.toLowerCase()))) {
          polygons.push({
            id: nb.id,
            points: nb.geometry,
            label: nb.nameNew,
            color: '#8b5cf6'
          });
        }
      });
    }

    // Đất công
    if (mapLayers.publicLand) {
      publicLands.forEach(pl => {
        if (pl.Status === 'Active' && pl.geometry && (mapSearchTerm === '' || pl.Donviquanl.toLowerCase().includes(mapSearchTerm.toLowerCase()) || pl.Thua.includes(mapSearchTerm))) {
          polygons.push({
            id: pl.id,
            points: pl.geometry,
            label: `Đất công: T${pl.To}/Th${pl.Thua}`,
            color: '#f59e0b'
          });
        }
      });
    }

    // Số nhà (Markers)
    if (mapLayers.houses) {
      records.forEach(r => {
        if (r.Status === 'Active' && (mapSearchTerm === '' || r.SoNha.toLowerCase().includes(mapSearchTerm.toLowerCase()) || r.TenChuHo.toLowerCase().includes(mapSearchTerm.toLowerCase()))) {
          markers.push({
            id: r.id,
            lat: r.X,
            lng: r.Y,
            label: `${r.SoNha} ${r.Duong} (${r.TenChuHo})`
          });
        }
      });
    }

    return { polygons, markers };
  }, [mapLayers, mapSearchTerm, wardBoundary, neighborhoods, publicLands, records]);

  // CRUD Handlers
  const handleAddOrEditHouse = (data: Partial<HouseNumberRecord>) => {
    if (editingRecord) setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...data, UpdatedAt: new Date().toISOString() } as HouseNumberRecord : r));
    else setRecords(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), MaSoHS: `HS-${Date.now()}`, CreatedAt: new Date().toISOString(), Status: 'Active' } as HouseNumberRecord]);
    setIsFormOpen(false); setEditingRecord(undefined);
  };

  const handleAddOrEditLand = (data: Partial<PublicLandRecord>) => {
    if (editingLand) setPublicLands(prev => prev.map(l => l.id === editingLand.id ? { ...l, ...data } as PublicLandRecord : l));
    else setPublicLands(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), CreatedAt: new Date().toISOString(), Status: 'Active' } as PublicLandRecord]);
    setIsLandFormOpen(false); setEditingLand(undefined);
  };

  const handleAddOrEditGeneral = (dataList: Partial<GeneralRecord>[]) => {
    if (editingGeneral) setGenerals(prev => prev.map(g => g.id === editingGeneral.id ? { ...g, ...dataList[0] } as GeneralRecord : g));
    else setGenerals(prev => [...prev, ...dataList.map(d => ({ ...d, id: Math.random().toString(36).substr(2, 9), CreatedAt: new Date().toISOString(), Status: 'Active' } as GeneralRecord))]);
    setIsGeneralFormOpen(false); setEditingGeneral(undefined);
  };

  const handleAddOrEditMedal = (dataList: Partial<MedalRecord>[]) => {
    if (editingMedal) setMedals(prev => prev.map(m => m.id === editingMedal.id ? { ...m, ...dataList[0] } as MedalRecord : m));
    else setMedals(prev => [...prev, ...dataList.map(d => ({ ...d, id: Math.random().toString(36).substr(2, 9), CreatedAt: new Date().toISOString(), Status: 'Active' } as MedalRecord))]);
    setIsMedalFormOpen(false); setEditingMedal(undefined);
  };

  const handleAddOrEditMerit = (dataList: Partial<MeritRecord>[]) => {
    if (editingMerit) setMerits(prev => prev.map(m => m.id === editingMerit.id ? { ...m, ...dataList[0] } as MeritRecord : m));
    else setMerits(prev => [...prev, ...dataList.map(d => ({ ...d, id: Math.random().toString(36).substr(2, 9), CreatedAt: new Date().toISOString(), Status: 'Active' } as MeritRecord))]);
    setIsMeritFormOpen(false); setEditingMerit(undefined);
  };

  const handleDelete = (id: string, type: 'house' | 'land' | 'general' | 'medal' | 'merit' | 'street' | 'neighborhood' | 'medal_type' | 'merit_type' | 'relationship' | 'general_status') => {
    if (!confirm('Bạn có chắc chắn muốn xóa/ngưng sử dụng hồ sơ này?')) return;
    
    switch(type) {
      case 'house': setRecords(prev => prev.map(item => item.id === id ? { ...item, Status: 'Inactive' } : item)); break;
      case 'land': setPublicLands(prev => prev.map(item => item.id === id ? { ...item, Status: 'Inactive' } : item)); break;
      case 'general': setGenerals(prev => prev.map(item => item.id === id ? { ...item, Status: 'Inactive' } : item)); break;
      case 'medal': setMedals(prev => prev.map(item => item.id === id ? { ...item, Status: 'Inactive' } : item)); break;
      case 'merit': setMerits(prev => prev.map(item => item.id === id ? { ...item, Status: 'Inactive' } : item)); break;
      case 'street': setStreets(prev => prev.filter(item => item.id !== id)); break;
      case 'neighborhood': setNeighborhoods(prev => prev.filter(item => item.id !== id)); break;
      case 'medal_type': setMedalTypes(prev => prev.filter(item => item.id !== id)); break;
      case 'merit_type': setMeritTypes(prev => prev.filter(item => item.id !== id)); break;
      case 'relationship': setRelationships(prev => prev.filter(item => item.id !== id)); break;
      case 'general_status': setGeneralStatuses(prev => prev.filter(item => item.id !== id)); break;
    }
  };

  const handleAddOrEditStreet = (data: Partial<Street>) => {
    if (editingStreet) setStreets(prev => prev.map(s => s.id === editingStreet.id ? { ...s, ...data } as Street : s));
    else setStreets(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as Street]);
    setIsStreetFormOpen(false); setEditingStreet(undefined);
  };

  const handleAddOrEditMt = (data: Partial<MedalType>) => {
    if (editingMt) setMedalTypes(prev => prev.map(m => m.id === editingMt.id ? { ...m, ...data } as MedalType : m));
    else setMedalTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as MedalType]);
    setIsMtFormOpen(false); setEditingMt(undefined);
  };

  const handleAddOrEditMet = (data: Partial<MeritType>) => {
    if (editingMet) setMeritTypes(prev => prev.map(m => m.id === editingMet.id ? { ...m, ...data } as MeritType : m));
    else setMeritTypes(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as MeritType]);
    setIsMetFormOpen(false); setEditingMet(undefined);
  };

  const handleAddOrEditNb = (data: Partial<Neighborhood>) => {
    if (editingNb) setNeighborhoods(prev => prev.map(n => n.id === editingNb.id ? { ...n, ...data } as Neighborhood : n));
    else setNeighborhoods(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as Neighborhood]);
    setIsNbFormOpen(false); setEditingNb(undefined);
  };

  const handleAddOrEditRel = (data: Partial<RelationshipType>) => {
    if (editingRel) setRelationships(prev => prev.map(r => r.id === editingRel.id ? { ...r, ...data } as RelationshipType : r));
    else setRelationships(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as RelationshipType]);
    setIsRelFormOpen(false); setEditingRel(undefined);
  };

  const handleAddOrEditGs = (data: Partial<GeneralStatus>) => {
    if (editingGs) setGeneralStatuses(prev => prev.map(s => s.id === editingGs.id ? { ...s, ...data } as GeneralStatus : s));
    else setGeneralStatuses(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as GeneralStatus]);
    setIsGsFormOpen(false); setEditingGs(undefined);
  };

  const renderHeaderButton = () => {
    switch(activeSidebarTab) {
      case 'records': return <button onClick={() => { setEditingRecord(undefined); setIsFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm số nhà</button>;
      case 'public_land': return <button onClick={() => { setEditingLand(undefined); setIsLandFormOpen(true); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm đất công</button>;
      case 'generals': return <button onClick={() => { setEditingGeneral(undefined); setIsGeneralFormOpen(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm tướng lĩnh</button>;
      case 'medals': return <button onClick={() => { setEditingMedal(undefined); setIsMedalFormOpen(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm khen thưởng</button>;
      case 'merits': return <button onClick={() => { setEditingMerit(undefined); setIsMeritFormOpen(true); }} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm hồ sơ NCC</button>;
      case 'streets': return <button onClick={() => { setEditingStreet(undefined); setIsStreetFormOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm đường</button>;
      case 'neighborhoods': return <button onClick={() => { setEditingNb(undefined); setIsNbFormOpen(true); }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm khu phố</button>;
      case 'medal_types': return <button onClick={() => { setEditingMt(undefined); setIsMtFormOpen(true); }} className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm loại HC</button>;
      case 'merit_types': return <button onClick={() => { setEditingMet(undefined); setIsMetFormOpen(true); }} className="flex items-center gap-2 bg-rose-800 hover:bg-rose-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm loại đối tượng NCC</button>;
      case 'relationships': return <button onClick={() => { setEditingRel(undefined); setIsRelFormOpen(true); }} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm quan hệ</button>;
      case 'general_statuses': return <button onClick={() => { setEditingGs(undefined); setIsGsFormOpen(true); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold shadow-md active:scale-95 transition-all"><Plus size={18} /> Thêm tình trạng</button>;
      default: return null;
    }
  };

  const renderContent = () => {
    switch(activeSidebarTab) {
      case 'records':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ số nhà" value={records.length.toString()} icon={<Database className="text-blue-600" />} />
              <StatsCard label="Đang hoạt động" value={records.filter(r => r.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
              <StatsCard label="Đang tranh chấp" value={records.filter(r => r.TranhChap).length.toString()} icon={<AlertCircle className="text-orange-600" />} />
              <StatsCard label="Đã xóa/Ngưng dùng" value={records.filter(r => r.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                  <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Danh sách</button>
                  <button onClick={() => setViewMode('map')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Bản đồ GIS</button>
                </div>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang dùng" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã xóa" />
                  <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} label="Tất cả" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                {viewMode === 'list' ? (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-white border-b text-[10px] font-bold uppercase text-slate-400 z-10">
                      <tr><th className="px-6 py-4">Chủ hộ & CCCD</th><th className="px-6 py-4">Địa chỉ chính thức</th><th className="px-6 py-4">Vị trí (Tờ/Thửa)</th><th className="px-6 py-4">Mã hồ sơ</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRecords.map(r => (
                        <tr key={r.id} className="hover:bg-blue-50/30 group transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{r.TenChuHo}</p>
                            <p className="text-[10px] text-slate-400 font-mono">CCCD: {r.SoCCCD}</p>
                          </td>
                          <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-700">{r.SoNha} {r.Duong}</p><p className="text-[10px] text-slate-400 italic">{r.KDC}</p></td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">T{r.SoTo} - Th{r.SoThua}</span></td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">{r.MaSoHS}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingRecord(r); setIsFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={14} /></button>
                              <button onClick={() => handleDelete(r.id, 'house')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <MapView center={[10.7719, 106.6983]} markers={filteredRecords.map(r => ({ id: r.id, lat: r.X, lng: r.Y, label: `${r.SoNha} ${r.Duong}` }))} />
                )}
              </div>
            </div>
          </div>
        );

      case 'public_land':
        const totalLandArea = publicLands.reduce((acc, curr) => acc + (curr.Dientich || 0), 0);
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng diện tích (m²)" value={totalLandArea.toLocaleString()} icon={<Ruler className="text-amber-600" />} />
              <StatsCard label="Tổng số thửa đất" value={publicLands.length.toString()} icon={<Layers className="text-emerald-600" />} />
              <StatsCard label="Đang quản lý" value={publicLands.filter(l => l.Status === 'Active').length.toString()} icon={<CheckCircle className="text-blue-600" />} />
              <StatsCard label="Đã thu hồi" value={publicLands.filter(l => l.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
               <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Landmark size={18} className="text-amber-600" /> Danh sách Đất công ích</h2>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang dùng" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã thu hồi" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 bg-white border-b text-[10px] font-bold uppercase text-slate-400 z-10">
                    <tr><th className="px-6 py-4">Biểu</th><th className="px-6 py-4">Đơn vị Quản lý</th><th className="px-6 py-4">Đơn vị Sử dụng</th><th className="px-6 py-4">Vị trí (Tờ/Thửa)</th><th className="px-6 py-4">Diện tích (m²)</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPublicLand.map(l => (
                      <tr key={l.id} className="hover:bg-amber-50/20 group transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-amber-600">{l.Bieu}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{l.Donviquanl}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{l.Donvisudun || '--'}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">T{l.To} - Th{l.Thua}</td>
                        <td className="px-6 py-4 font-black text-emerald-600">{(l.Dientich || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingLand(l); setIsLandFormOpen(true); }} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(l.id, 'land')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'generals':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng tướng lĩnh" value={generals.length.toString()} icon={<ShieldAlert className="text-indigo-600" />} />
              <StatsCard label="Diện Trung ương" value={generals.filter(g => g.Dien === 'TW').length.toString()} icon={<Globe className="text-red-600" />} />
              <StatsCard label="Diện Thành ủy" value={generals.filter(g => g.Dien === 'Thành ủy').length.toString()} icon={<Building2 className="text-blue-600" />} />
              <StatsCard label="Đang hoạt động" value={generals.filter(g => g.Status === 'Active').length.toString()} icon={<CheckCircle className="text-emerald-600" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><ShieldAlert size={18} className="text-indigo-600" /> Hồ sơ Tướng lĩnh Phường</h2>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Hoạt động" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white border-b text-[10px] font-bold uppercase text-slate-400 z-10">
                    <tr><th className="px-6 py-4">Họ và tên</th><th className="px-6 py-4">Diện quản lý</th><th className="px-6 py-4">Tình trạng</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGenerals.map(g => (
                      <tr key={g.id} className="hover:bg-indigo-50/20 group transition-colors">
                        <td className="px-6 py-4"><p className="font-bold text-slate-800">{g.HoTen}</p><p className="text-[10px] text-slate-400">Quan hệ: {g.QuanHe || '--'}</p></td>
                        <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${g.Dien === 'TW' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{g.Dien}</span></td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{g.TinhTrang}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingGeneral(g); setIsGeneralFormOpen(true); }} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(g.id, 'general')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'medals':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ khen thưởng" value={medals.length.toString()} icon={<Award className="text-amber-600" />} />
              <StatsCard label="Tổng tiền trợ cấp" value={medals.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString()} icon={<Wallet className="text-emerald-600" />} />
              <StatsCard label="Đang quản lý" value={medals.filter(m => m.Status === 'Active').length.toString()} icon={<CheckCircle className="text-blue-600" />} />
              <StatsCard label="Đã lưu trữ" value={medals.filter(m => m.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Award size={18} className="text-amber-600" /> Hồ sơ Huân chương kháng chiến</h2>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang dùng" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white border-b text-[10px] font-bold uppercase text-slate-400 z-10">
                    <tr><th className="px-6 py-4">Người hưởng</th><th className="px-6 py-4">Loại khen thưởng</th><th className="px-6 py-4">Liên hệ</th><th className="px-6 py-4 text-right">Số tiền</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedals.map(m => (
                      <tr key={m.id} className="hover:bg-amber-50/20 group transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{m.HoTen}</p>
                          <p className="text-[10px] text-slate-400">Quan hệ: {m.QuanHe || '--'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-amber-700 text-sm">{m.LoaiDoiTuong}</p>
                          <p className="text-[10px] font-mono text-slate-500">HS: {m.SoQuanLyHS}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {m.DienThoai && <span className="text-[10px] flex items-center gap-1"><Phone size={10} /> {m.DienThoai}</span>}
                            {m.Email && <span className="text-[10px] flex items-center gap-1"><Mail size={10} /> {m.Email}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">{(m.SoTien || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingMedal(m); setIsMedalFormOpen(true); }} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(m.id, 'medal')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'merits':
        return (
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
              <StatsCard label="Tổng hồ sơ Người có công" value={merits.length.toString()} icon={<Heart className="text-rose-600" />} />
              <StatsCard label="Tổng tiền trợ cấp" value={merits.reduce((a, b) => a + (b.SoTien || 0), 0).toLocaleString()} icon={<Wallet className="text-emerald-600" />} />
              <StatsCard label="Đang quản lý" value={merits.filter(m => m.Status === 'Active').length.toString()} icon={<CheckCircle className="text-blue-600" />} />
              <StatsCard label="Đã ngưng/Lưu trữ" value={merits.filter(m => m.Status === 'Inactive').length.toString()} icon={<Trash2 className="text-slate-500" />} />
            </section>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Heart size={18} className="text-rose-600" /> Danh sách Người có công với cách mạng</h2>
                <div className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                  <FilterButton active={activeFilter === 'active'} onClick={() => setActiveFilter('active')} label="Đang hưởng" />
                  <FilterButton active={activeFilter === 'inactive'} onClick={() => setActiveFilter('inactive')} label="Đã ngưng" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-white border-b text-[10px] font-bold uppercase text-slate-400 z-10">
                    <tr><th className="px-6 py-4">Người hưởng</th><th className="px-6 py-4">Loại đối tượng</th><th className="px-6 py-4">Liên hệ</th><th className="px-6 py-4 text-right">Số tiền</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMerits.map(m => (
                      <tr key={m.id} className="hover:bg-rose-50/20 group transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{m.HoTen}</p>
                          <p className="text-[10px] text-slate-400">Quan hệ: {m.QuanHe || '--'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-rose-700 text-sm">{m.LoaiDoiTuong}</p>
                          <p className="text-[10px] font-mono text-slate-500">HS: {m.SoQuanLyHS}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {m.DienThoai && <span className="text-[10px] flex items-center gap-1"><Phone size={10} /> {m.DienThoai}</span>}
                            {m.Email && <span className="text-[10px] flex items-center gap-1"><Mail size={10} /> {m.Email}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">{(m.SoTien || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingMerit(m); setIsMeritFormOpen(true); }} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(m.id, 'merit')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'planning':
        return (
          <div className="flex-1 p-6 flex flex-col overflow-hidden relative">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><MapIcon className="text-blue-600" /> Bản đồ GIS Tổng thể Phường</h2>
            
            {/* Map UI Container */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
              {/* Overlay: Search & Controls */}
              <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 w-72">
                <div className="bg-white rounded-xl shadow-xl border p-2 flex items-center gap-2">
                  <Search size={18} className="text-slate-400 ml-2" />
                  <input 
                    type="text" 
                    placeholder="Tìm số nhà, đất công..." 
                    className="w-full text-xs font-medium outline-none py-1.5"
                    value={mapSearchTerm}
                    onChange={(e) => setMapSearchTerm(e.target.value)}
                  />
                  {mapSearchTerm && (
                    <button onClick={() => setMapSearchTerm('')} className="p-1 hover:bg-slate-100 rounded-full">
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Layer Toggle Panel */}
                <div className="bg-white rounded-xl shadow-xl border p-4 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Lớp dữ liệu bản đồ</p>
                  
                  <LayerToggle 
                    label="Hồ sơ Số nhà" 
                    active={mapLayers.houses} 
                    color="bg-blue-500" 
                    onClick={() => setMapLayers({...mapLayers, houses: !mapLayers.houses})} 
                  />
                  <LayerToggle 
                    label="Đất công ích" 
                    active={mapLayers.publicLand} 
                    color="bg-amber-500" 
                    onClick={() => setMapLayers({...mapLayers, publicLand: !mapLayers.publicLand})} 
                  />
                  <LayerToggle 
                    label="Ranh giới Khu phố" 
                    active={mapLayers.neighborhoods} 
                    color="bg-purple-500" 
                    onClick={() => setMapLayers({...mapLayers, neighborhoods: !mapLayers.neighborhoods})} 
                  />
                  <LayerToggle 
                    label="Địa giới Phường" 
                    active={mapLayers.ward} 
                    color="bg-blue-600" 
                    onClick={() => setMapLayers({...mapLayers, ward: !mapLayers.ward})} 
                  />
                </div>
              </div>

              {/* Dynamic Legend */}
              <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg border p-2 shadow-lg text-[10px] space-y-1">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-600/30 border border-blue-600"></span> Phường</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500"></span> Khu phố</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500"></span> Đất công</div>
                <div className="flex items-center gap-2"><span className="w-3 h-1 border-t-2 border-blue-500 border-dashed"></span> Vị trí số nhà</div>
              </div>

              <MapView 
                center={[wardBoundary.X, wardBoundary.Y]} 
                zoom={16}
                polygons={mapData.polygons}
                markers={mapData.markers}
              />
            </div>
          </div>
        );

      case 'streets':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Milestone className="text-emerald-600"/> Đường</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-slate-50 border-b text-xs font-bold text-slate-400 uppercase"><tr><th className="px-6 py-3">Mã đường</th><th className="px-6 py-3">Tên đường chính thức</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{streets.map(s => (<tr key={s.id} className="hover:bg-slate-50 group transition-all"><td className="px-6 py-4 font-mono text-xs">{s.code}</td><td className="px-6 py-4 text-sm font-semibold">{s.name}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingStreet(s); setIsStreetFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(s.id, 'street')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;
      case 'neighborhoods':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="text-purple-600"/> Khu phố</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-slate-50 border-b text-xs font-bold text-slate-400 uppercase"><tr><th className="px-6 py-3">Tên mới</th><th className="px-6 py-3">Tên cũ (TDP)</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{neighborhoods.map(n => (<tr key={n.id} className="hover:bg-slate-50 group transition-all"><td className="px-6 py-4 text-sm font-semibold">{n.nameNew}</td><td className="px-6 py-4 text-sm text-slate-500 italic">{n.nameOld}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingNb(n); setIsNbFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(n.id, 'neighborhood')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;
      case 'medal_types':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Award className="text-amber-600"/> Loại huân chương</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-amber-50 border-b text-xs font-bold text-amber-500 uppercase"><tr><th className="px-6 py-3">Mã</th><th className="px-6 py-3">Tên loại khen thưởng</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{medalTypes.map(m => (<tr key={m.id} className="hover:bg-amber-50/30 group transition-all"><td className="px-6 py-4 font-mono text-xs">{m.code}</td><td className="px-6 py-4 text-sm font-semibold text-slate-700">{m.name}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingMt(m); setIsMtFormOpen(true); }} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(m.id, 'medal_type')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;
      case 'merit_types':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Heart className="text-rose-600"/> Loại đối tượng NCC</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-rose-50 border-b text-xs font-bold text-rose-500 uppercase"><tr><th className="px-6 py-3">Mã</th><th className="px-6 py-3">Tên loại đối tượng</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{meritTypes.map(m => (<tr key={m.id} className="hover:bg-rose-50/30 group transition-all"><td className="px-6 py-4 font-mono text-xs">{m.code}</td><td className="px-6 py-4 text-sm font-semibold text-slate-700">{m.name}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingMet(m); setIsMetFormOpen(true); }} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(m.id, 'merit_type')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;
      case 'relationships':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-blue-600"/> Quan hệ chủ hộ</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-slate-50 border-b text-xs font-bold text-slate-400 uppercase"><tr><th className="px-6 py-3">Mã</th><th className="px-6 py-3">Mối quan hệ</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{relationships.map(r => (<tr key={r.id} className="hover:bg-slate-50 group transition-all"><td className="px-6 py-4 font-mono text-xs">{r.code}</td><td className="px-6 py-4 text-sm font-semibold">{r.name}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingRel(r); setIsRelFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(r.id, 'relationship')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;
      case 'general_statuses':
        return <div className="p-6 flex flex-col gap-4 overflow-hidden"><h2 className="text-xl font-bold flex items-center gap-2"><Info className="text-slate-600"/> Tình trạng tướng lĩnh</h2><div className="bg-white border rounded-xl overflow-auto shadow-sm custom-scrollbar"><table className="w-full text-left"><thead className="bg-slate-50 border-b text-xs font-bold text-slate-400 uppercase"><tr><th className="px-6 py-3">Mã</th><th className="px-6 py-3">Tên tình trạng</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y">{generalStatuses.map(s => (<tr key={s.id} className="hover:bg-slate-50 group transition-all"><td className="px-6 py-4 font-mono text-xs">{s.code}</td><td className="px-6 py-4 text-sm font-semibold">{s.name}</td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => { setEditingGs(s); setIsGsFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button><button onClick={() => handleDelete(s.id, 'general_status')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div></div>;

      case 'ward_boundary':
        return <div className="flex-1 p-6 flex flex-col overflow-hidden"><WardBoundaryForm initialData={wardBoundary} onClose={() => setActiveSidebarTab('records')} onSubmit={setWardBoundary} /></div>;
      
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col text-slate-400 shrink-0 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><Home size={20} /></div>
          <span className="font-bold text-lg tracking-tight">SmartHouse GIS</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
          <NavItem icon={<Database size={18} />} label="Hồ sơ số nhà" active={activeSidebarTab === 'records'} onClick={() => setActiveSidebarTab('records')} />
          <NavItem icon={<Landmark size={18} />} label="Quản lý Đất công" active={activeSidebarTab === 'public_land'} onClick={() => setActiveSidebarTab('public_land')} />
          <NavItem icon={<ShieldAlert size={18} />} label="Quản lý Tướng lĩnh" active={activeSidebarTab === 'generals'} onClick={() => setActiveSidebarTab('generals')} />
          <NavItem icon={<Award size={18} />} label="Huân chương KC" active={activeSidebarTab === 'medals'} onClick={() => setActiveSidebarTab('medals')} />
          <NavItem icon={<Heart size={18} />} label="Người có công" active={activeSidebarTab === 'merits'} onClick={() => setActiveSidebarTab('merits')} />
          <NavItem icon={<MapIcon size={18} />} label="Bản đồ" active={activeSidebarTab === 'planning'} onClick={() => setActiveSidebarTab('planning')} />
          <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hệ thống</div>
          <NavItem icon={<Globe size={18} />} label="Ranh giới Phường" active={activeSidebarTab === 'ward_boundary'} onClick={() => setActiveSidebarTab('ward_boundary')} />
          <NavItem icon={<Milestone size={18} />} label="Đường" active={activeSidebarTab === 'streets'} onClick={() => setActiveSidebarTab('streets')} />
          <NavItem icon={<Building2 size={18} />} label="Khu phố" active={activeSidebarTab === 'neighborhoods'} onClick={() => setActiveSidebarTab('neighborhoods')} />
          <NavItem icon={<Award size={18} className="text-amber-400" />} label="Loại huân chương" active={activeSidebarTab === 'medal_types'} onClick={() => setActiveSidebarTab('medal_types')} />
          <NavItem icon={<Heart size={18} className="text-rose-400" />} label="Loại đối tượng NCC" active={activeSidebarTab === 'merit_types'} onClick={() => setActiveSidebarTab('merit_types')} />
          <NavItem icon={<Users size={18} />} label="Quan hệ chủ hộ" active={activeSidebarTab === 'relationships'} onClick={() => setActiveSidebarTab('relationships')} />
          <NavItem icon={<Info size={18} />} label="Tình trạng tướng lĩnh" active={activeSidebarTab === 'general_statuses'} onClick={() => setActiveSidebarTab('general_statuses')} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl w-80 max-md:hidden border border-slate-200">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none outline-none text-sm w-full font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 ml-auto">{renderHeaderButton()}</div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">{renderContent()}</main>
      </div>

      {isFormOpen && <HouseForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddOrEditHouse} initialData={editingRecord} isEditing={!!editingRecord} streets={streets} neighborhoods={neighborhoods} relationshipTypes={relationships} />}
      {isLandFormOpen && <PublicLandForm onClose={() => setIsLandFormOpen(false)} onSubmit={handleAddOrEditLand} initialData={editingLand} isEditing={!!editingLand} houseRecords={records} />}
      {isGeneralFormOpen && <GeneralForm onClose={() => setIsGeneralFormOpen(false)} onSubmit={handleAddOrEditGeneral} initialData={editingGeneral} isEditing={!!editingGeneral} houseRecords={records} relationshipTypes={relationships} generalStatuses={generalStatuses} />}
      {isMedalFormOpen && <MedalForm onClose={() => setIsMedalFormOpen(false)} onSubmit={handleAddOrEditMedal} initialData={editingMedal} isEditing={!!editingMedal} houseRecords={records} relationshipTypes={relationships} medalTypes={medalTypes} />}
      {isMeritFormOpen && <MeritForm onClose={() => setIsMeritFormOpen(false)} onSubmit={handleAddOrEditMerit} initialData={editingMerit} isEditing={!!editingMerit} houseRecords={records} relationshipTypes={relationships} meritTypes={meritTypes} />}
      {isStreetFormOpen && <StreetForm initialData={editingStreet} onClose={() => setIsStreetFormOpen(false)} onSubmit={handleAddOrEditStreet} />}
      {isMtFormOpen && <MedalTypeForm initialData={editingMt} onClose={() => setIsMtFormOpen(false)} onSubmit={handleAddOrEditMt} />}
      {isMetFormOpen && <MeritTypeForm initialData={editingMet} onClose={() => setIsMetFormOpen(false)} onSubmit={handleAddOrEditMet} />}
      {isNbFormOpen && <NeighborhoodForm initialData={editingNb} onClose={() => setIsNbFormOpen(false)} onSubmit={handleAddOrEditNb} />}
      {isRelFormOpen && <RelationshipForm initialData={editingRel} onClose={() => setIsRelFormOpen(false)} onSubmit={handleAddOrEditRel} />}
      {isGsFormOpen && <GeneralStatusForm initialData={editingGs} onClose={() => setIsGsFormOpen(false)} onSubmit={handleAddOrEditGs} />}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl transition-all shrink-0 ${active ? 'bg-blue-600 text-white font-bold shadow-lg' : 'hover:bg-slate-800 hover:text-slate-200'}`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const StatsCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all group">
    <div className="min-w-0"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">{label}</p><p className="text-xl font-black text-slate-900 truncate">{value}</p></div>
    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-blue-50 transition-all">{icon}</div>
  </div>
);

const FilterButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{label}</button>
);

// Helper component cho Layer Toggle trên bản đồ
const LayerToggle: React.FC<{ label: string, active: boolean, color: string, onClick: () => void }> = ({ label, active, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between group"
  >
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className={`text-[11px] font-bold ${active ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    </div>
    {active ? (
      <Eye size={14} className="text-blue-600" />
    ) : (
      <EyeOff size={14} className="text-slate-300" />
    )}
  </button>
);

export default App;
