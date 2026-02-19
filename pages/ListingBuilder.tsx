
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../App';
import { db } from '../store';
import { Property, PropertyType } from '../types';
import {
    ArrowLeft, ArrowRight, Check, X, Plus, Minus, Trash2, Home, BedDouble, Bath,
    Ruler, MapPin, IndianRupee, ImagePlus, Sparkles, Eye, Send, Tag, Upload, Camera
} from 'lucide-react';

declare const L: any;

const AMENITY_PRESETS = [
    'Gym', 'Pool', 'Parking', 'Garden', 'Beach Access', 'Elevator', 'Security',
    'Wi-Fi', 'AC', 'Balcony', 'Terrace', 'Power Backup', 'CCTV', 'Clubhouse',
    'Play Area', 'Laundry', 'Pet Friendly', 'Furnished', 'Modular Kitchen', 'Gated Community'
];

const STEP_LABELS = ['Basic Info', 'Details & Map', 'Media & Amenities', 'Review'];

interface FormErrors {
    title?: string;
    description?: string;
    price?: string;
    location?: string;
    bedrooms?: string;
    bathrooms?: string;
    area?: string;
    images?: string;
}

// ─── Stepper Input Component ───
function StepperInput({
    label, icon: Icon, value, onChange, min = 0, max = 99, suffix = '', color = 'indigo'
}: {
    label: string; icon: any; value: number; onChange: (v: number) => void;
    min?: number; max?: number; suffix?: string; color?: string;
}) {
    return (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 text-${color}-500`} />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - (suffix === 'sqft' ? 50 : 1)))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 flex items-center justify-center font-bold transition-all active:scale-90"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                    <span className="text-3xl font-black text-slate-900">{value.toLocaleString()}</span>
                    {suffix && <span className="text-xs font-bold text-slate-400 ml-1">{suffix}</span>}
                </div>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + (suffix === 'sqft' ? 50 : 1)))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-500 text-slate-500 flex items-center justify-center font-bold transition-all active:scale-90"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Interactive Map Component ───
function MapPicker({
    location, onLocationChange, onCoordsChange
}: {
    location: string;
    onLocationChange: (loc: string) => void;
    onCoordsChange: (coords: { lat: number; lng: number }) => void;
}) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [searchQuery, setSearchQuery] = useState(location);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;
        if (typeof L === 'undefined') return;

        const map = L.map(mapRef.current).setView([19.076, 72.8777], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = L.marker([19.076, 72.8777], { draggable: true }).addTo(map);
        marker.on('dragend', async () => {
            const pos = marker.getLatLng();
            onCoordsChange({ lat: pos.lat, lng: pos.lng });
            // Reverse geocode
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`);
                const data = await res.json();
                if (data.display_name) {
                    const short = data.display_name.split(',').slice(0, 3).join(',');
                    onLocationChange(short);
                    setSearchQuery(short);
                }
            } catch { }
        });

        map.on('click', async (e: any) => {
            marker.setLatLng(e.latlng);
            onCoordsChange({ lat: e.latlng.lat, lng: e.latlng.lng });
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                const data = await res.json();
                if (data.display_name) {
                    const short = data.display_name.split(',').slice(0, 3).join(',');
                    onLocationChange(short);
                    setSearchQuery(short);
                }
            } catch { }
        });

        mapInstance.current = map;
        markerRef.current = marker;

        // Fix tiles not loading fully
        setTimeout(() => map.invalidateSize(), 300);

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            const data = await res.json();
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const latN = parseFloat(lat);
                const lngN = parseFloat(lon);
                mapInstance.current?.setView([latN, lngN], 15);
                markerRef.current?.setLatLng([latN, lngN]);
                onCoordsChange({ lat: latN, lng: lngN });
                const short = display_name.split(',').slice(0, 3).join(',');
                onLocationChange(short);
                setSearchQuery(short);
            }
        } catch { }
        setSearching(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="relative flex-grow">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search location or click on map..."
                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none text-sm font-medium placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex-shrink-0"
                >
                    {searching ? '...' : 'Search'}
                </button>
            </div>
            <div
                ref={mapRef}
                className="w-full h-[300px] rounded-2xl border-2 border-slate-200 overflow-hidden z-0"
                style={{ position: 'relative' }}
            />
            <p className="text-xs text-slate-400 font-medium text-center">
                📍 Click on the map or drag the marker to set the exact location
            </p>
        </div>
    );
}


export default function ListingBuilder() {
    const { user, setCurrentPage, setProperties, editPropertyId, setEditPropertyId } = useApp();
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [transitioning, setTransitioning] = useState(false);
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.ROOM_PG);
    const [price, setPrice] = useState('');
    const [bedrooms, setBedrooms] = useState(2);
    const [bathrooms, setBathrooms] = useState(1);
    const [area, setArea] = useState(800);
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });
    const [images, setImages] = useState<string[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [customAmenity, setCustomAmenity] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Load edit data
    useEffect(() => {
        if (editPropertyId) {
            const prop = db.getProperties().find(p => p.id === editPropertyId);
            if (prop) {
                setTitle(prop.title);
                setDescription(prop.description);
                setPropertyType(prop.type);
                setPrice(String(prop.price));
                setBedrooms(prop.bedrooms);
                setBathrooms(prop.bathrooms);
                setArea(prop.area);
                setLocation(prop.location);
                if (prop.coordinates) setCoordinates(prop.coordinates);
                setImages([...prop.images]);
                setAmenities([...prop.amenities]);
            }
        }
    }, [editPropertyId]);

    useEffect(() => {
        if (!user) setCurrentPage('auth');
        return () => setEditPropertyId(null);
    }, []);

    // ─── Image file handling ───
    const processFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        fileArray.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImages(prev => [...prev, result]);
                setErrors(prev => ({ ...prev, images: undefined }));
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const toggleAmenity = (a: string) => {
        setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    };

    const addCustomAmenity = () => {
        const a = customAmenity.trim();
        if (a && !amenities.includes(a)) {
            setAmenities(prev => [...prev, a]);
            setCustomAmenity('');
        }
    };

    const validateStep = (s: number): boolean => {
        const e: FormErrors = {};
        if (s === 0) {
            if (!title.trim()) e.title = 'Title is required';
            else if (title.trim().length < 5) e.title = 'Title must be at least 5 characters';
            if (!description.trim()) e.description = 'Description is required';
            else if (description.trim().length < 10) e.description = 'Description must be at least 10 characters';
            if (!price || Number(price) <= 0) e.price = 'Enter a valid price';
        }
        if (s === 1) {
            if (bedrooms < 0) e.bedrooms = 'Invalid';
            if (bathrooms < 0) e.bathrooms = 'Invalid';
            if (area <= 0) e.area = 'Invalid area';
            if (!location.trim()) e.location = 'Pick a location on the map or search';
        }
        if (s === 2) {
            if (images.length === 0) e.images = 'Add at least one image';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const goNext = () => {
        if (!validateStep(step)) return;
        setSlideDir('right');
        setTransitioning(true);
        setTimeout(() => { setStep(s => s + 1); setTransitioning(false); }, 200);
    };

    const goPrev = () => {
        setSlideDir('left');
        setTransitioning(true);
        setTimeout(() => { setStep(s => s - 1); setTransitioning(false); }, 200);
    };

    const handleSubmit = () => {
        if (!user) return;
        const prop: Property = {
            id: editPropertyId || `p_${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            type: propertyType,
            price: Number(price),
            location: location.trim(),
            coordinates,
            bedrooms,
            bathrooms,
            area,
            images,
            ownerId: user.id,
            createdAt: editPropertyId
                ? db.getProperties().find(p => p.id === editPropertyId)?.createdAt || new Date().toISOString()
                : new Date().toISOString(),
            amenities,
        };
        if (editPropertyId) db.updateProperty(editPropertyId, prop);
        else db.addProperty(prop);
        setProperties(db.getProperties());
        setEditPropertyId(null);
        setCurrentPage('dashboard');
    };

    const handleCancel = () => { setEditPropertyId(null); setCurrentPage('dashboard'); };

    // Preview
    const preview: Partial<Property> = {
        title: title || 'Untitled Property', description: description || 'No description yet',
        type: propertyType, price: Number(price) || 0, location: location || 'Location not set',
        bedrooms, bathrooms, area, amenities,
        images: images.length > 0 ? images : ['https://picsum.photos/seed/placeholder/800/600'],
    };

    if (!user) return null;

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 bg-white border-2 rounded-2xl outline-none transition-all text-sm font-medium placeholder:text-slate-300
    ${err ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`;

    const labelCls = 'block text-xs font-black text-slate-500 uppercase tracking-widest mb-2';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={handleCancel} className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                {editPropertyId ? 'Edit Listing' : 'Create New Listing'}
                            </h1>
                            <p className="text-slate-400 text-sm font-medium mt-0.5">
                                {editPropertyId ? 'Update your listing details' : 'Fill in the details to publish your room or flat'}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleCancel} className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {STEP_LABELS.map((label, i) => (
                            <React.Fragment key={label}>
                                {i > 0 && (
                                    <div className="flex-grow h-1 mx-2 rounded-full overflow-hidden bg-slate-200">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: step >= i ? '100%' : '0%' }} />
                                    </div>
                                )}
                                <button
                                    onClick={() => { if (i < step) setStep(i); }}
                                    className="flex flex-col items-center gap-2 group"
                                    style={{ cursor: i < step ? 'pointer' : 'default' }}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300
                    ${step === i ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 scale-110'
                                            : step > i ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                                                : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {step > i ? <Check className="w-5 h-5" /> : i + 1}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${step >= i ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {label}
                                    </span>
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Content: Form + Preview */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Panel */}
                    <div className="flex-grow lg:max-w-2xl">
                        <div className={`bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10 transition-all duration-200
              ${transitioning ? (slideDir === 'right' ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8') : 'opacity-100 translate-x-0'}`}
                        >

                            {/* ═══ Step 1: Basic Info ═══ */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 bg-indigo-100 rounded-2xl"><Home className="w-5 h-5 text-indigo-600" /></div>
                                        <h2 className="text-xl font-black text-slate-900">General Information</h2>
                                    </div>

                                    <div>
                                        <label className={labelCls}>Listing Title</label>
                                        <input type="text" value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: undefined })); }}
                                            placeholder="e.g. Luxury Apartment in Downtown" className={inputCls(errors.title)} />
                                        {errors.title && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className={labelCls}>Description</label>
                                        <textarea value={description} onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })); }}
                                            placeholder="Describe the room or flat in detail..." rows={4} className={inputCls(errors.description) + ' resize-none'} />
                                        <div className="flex justify-between mt-1.5 ml-1">
                                            {errors.description && <p className="text-red-500 text-xs font-bold">{errors.description}</p>}
                                            <p className="text-slate-300 text-xs font-bold ml-auto">{description.length} chars</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelCls}>Listing Type</label>
                                            <div className="flex gap-3">
                                                {[PropertyType.ROOM_PG, PropertyType.FLAT].map(t => (
                                                    <button key={t} onClick={() => setPropertyType(t)} type="button"
                                                        className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all border-2
                            ${propertyType === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                                                    >
                                                        {t === PropertyType.ROOM_PG ? '🏠 Room / PG' : '🏢 Rented Flat'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>
                                                <IndianRupee className="w-3 h-3 inline mr-1" />
                                                Price (per month)
                                            </label>
                                            <div className={`flex items-center gap-0 border-2 rounded-2xl overflow-hidden transition-all ${errors.price ? 'border-red-300' : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'}`}>
                                                <button type="button"
                                                    onClick={() => {
                                                        const step = 500;
                                                        const cur = Number(price) || 0;
                                                        const next = Math.max(0, cur - step);
                                                        setPrice(String(next));
                                                        setErrors(p => ({ ...p, price: undefined }));
                                                    }}
                                                    className="px-4 py-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all border-r border-slate-200 active:scale-90 flex-shrink-0"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <div className="flex-grow flex items-center px-3">
                                                    <span className="text-slate-400 font-bold text-sm mr-1">₹</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={price ? Number(price).toLocaleString('en-IN') : ''}
                                                        onChange={e => {
                                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                                            setPrice(raw);
                                                            setErrors(p => ({ ...p, price: undefined }));
                                                        }}
                                                        placeholder={'5,000'}
                                                        className="w-full py-3 bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <button type="button"
                                                    onClick={() => {
                                                        const step = 500;
                                                        const cur = Number(price) || 0;
                                                        setPrice(String(cur + step));
                                                        setErrors(p => ({ ...p, price: undefined }));
                                                    }}
                                                    className="px-4 py-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-500 text-slate-400 transition-all border-l border-slate-200 active:scale-90 flex-shrink-0"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-slate-300 text-[10px] font-bold mt-1.5 ml-1">
                                                Use +/− buttons (₹500 steps) or type directly
                                            </p>
                                            {errors.price && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.price}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ Step 2: Details & Map ═══ */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 bg-violet-100 rounded-2xl"><Ruler className="w-5 h-5 text-violet-600" /></div>
                                        <h2 className="text-xl font-black text-slate-900">Listing Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <StepperInput label="Bedrooms" icon={BedDouble} value={bedrooms} onChange={setBedrooms} min={0} max={20} color="indigo" />
                                        <StepperInput label="Bathrooms" icon={Bath} value={bathrooms} onChange={setBathrooms} min={0} max={20} color="violet" />
                                        <StepperInput label="Area" icon={Ruler} value={area} onChange={setArea} min={50} max={50000} suffix="sqft" color="amber" />
                                    </div>

                                    <div>
                                        <label className={labelCls}>
                                            <MapPin className="w-3 h-3 inline mr-1" /> Listing Location
                                        </label>
                                        <MapPicker
                                            location={location}
                                            onLocationChange={(loc) => { setLocation(loc); setErrors(p => ({ ...p, location: undefined })); }}
                                            onCoordsChange={setCoordinates}
                                        />
                                        {location && (
                                            <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                                                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="text-sm font-bold text-emerald-700 truncate">{location}</span>
                                            </div>
                                        )}
                                        {errors.location && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{errors.location}</p>}
                                    </div>
                                </div>
                            )}

                            {/* ═══ Step 3: Media & Amenities ═══ */}
                            {step === 2 && (
                                <div className="space-y-8">
                                    {/* Image Upload */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-amber-100 rounded-2xl"><Camera className="w-5 h-5 text-amber-600" /></div>
                                            <h2 className="text-xl font-black text-slate-900">Listing Images</h2>
                                        </div>

                                        {/* Hidden file input */}
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

                                        {/* Drag & Drop Zone */}
                                        <div
                                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all
                        ${isDragging
                                                    ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
                                                    : errors.images
                                                        ? 'border-red-300 bg-red-50/30 hover:border-red-400'
                                                        : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30'
                                                }`}
                                        >
                                            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                                <Upload className={`w-7 h-7 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
                                            </div>
                                            <p className="font-bold text-slate-700 mb-1">
                                                {isDragging ? 'Drop your images here!' : 'Click to upload or drag & drop'}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                PNG, JPG, WEBP • Multiple files supported
                                            </p>
                                        </div>
                                        {errors.images && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.images}</p>}

                                        {/* Image Grid */}
                                        {images.length > 0 && (
                                            <div className="mt-5">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                                    {images.length} image{images.length !== 1 ? 's' : ''} added
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {images.map((img, i) => (
                                                        <div key={i} className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                                                            <img src={img} className="w-full h-full object-cover" alt={`Property ${i + 1}`} />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }} type="button"
                                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            {i === 0 && (
                                                                <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">
                                                                    Cover
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {/* Add more button */}
                                                    <button onClick={() => fileInputRef.current?.click()} type="button"
                                                        className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                                                        <Plus className="w-8 h-8 mb-1" />
                                                        <span className="text-xs font-bold">Add More</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-emerald-100 rounded-2xl"><Sparkles className="w-5 h-5 text-emerald-600" /></div>
                                            <h2 className="text-xl font-black text-slate-900">Amenities</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {AMENITY_PRESETS.map(a => (
                                                <button key={a} onClick={() => toggleAmenity(a)} type="button"
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border-2
                          ${amenities.includes(a) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500'}`}
                                                >
                                                    {amenities.includes(a) && <Check className="w-3 h-3 inline mr-1" />}{a}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            <input type="text" value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addCustomAmenity()}
                                                placeholder="Add custom amenity..." className={inputCls() + ' flex-grow'} />
                                            <button onClick={addCustomAmenity} type="button"
                                                className="px-5 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-100 flex-shrink-0">
                                                <Tag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ Step 4: Review ═══ */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 bg-emerald-100 rounded-2xl"><Eye className="w-5 h-5 text-emerald-600" /></div>
                                        <h2 className="text-xl font-black text-slate-900">Review & Publish</h2>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Review your listing details below. If everything looks good, click <strong>Publish</strong> to make it live!
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Type', value: propertyType === PropertyType.ROOM_PG ? 'Room / PG' : 'Rented Flat' },
                                            { label: 'Price', value: `₹${Number(price).toLocaleString()}` },
                                            { label: 'Bedrooms', value: String(bedrooms) },
                                            { label: 'Area', value: `${area} sqft` },
                                        ].map(s => (
                                            <div key={s.label} className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                                                <p className="text-lg font-black text-slate-900">{s.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                        <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</p><p className="font-bold text-slate-900">{title}</p></div>
                                        <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</p><p className="text-sm text-slate-600 leading-relaxed">{description}</p></div>
                                        <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p><p className="text-sm text-slate-600 font-medium">{location}</p></div>
                                    </div>

                                    {amenities.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Amenities</p>
                                            <div className="flex flex-wrap gap-2">
                                                {amenities.map(a => <span key={a} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl text-xs font-bold">{a}</span>)}
                                            </div>
                                        </div>
                                    )}

                                    {images.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Images ({images.length})</p>
                                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                                {images.map((img, i) => <img key={i} src={img} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border-2 border-slate-100" />)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
                                {step > 0 ? (
                                    <button onClick={goPrev} type="button" className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                ) : (
                                    <button onClick={handleCancel} type="button" className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95">
                                        Cancel
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button onClick={goNext} type="button" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-indigo-200">
                                        Next <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} type="button" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-200">
                                        <Send className="w-4 h-4" /> {editPropertyId ? 'Update Listing' : 'Publish Listing'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Sidebar */}
                    <div className="hidden lg:block w-96 flex-shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-4 h-4 text-indigo-500" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Preview</span>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                    <img src={preview.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-2 ${preview.type === PropertyType.ROOM_PG ? 'bg-sky-500 text-white' : 'bg-indigo-500 text-white'}`}>
                                            {preview.type === PropertyType.ROOM_PG ? 'Room / PG' : 'Rented Flat'}
                                        </span>
                                        <h3 className="text-white font-black text-lg leading-tight line-clamp-2">{preview.title}</h3>
                                    </div>
                                    {/* Image count badge */}
                                    {images.length > 1 && (
                                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                                            📸 {images.length}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 space-y-4">
                                    <p className="text-2xl font-black text-indigo-600">
                                        ₹{(preview.price || 0).toLocaleString()}
                                        <span className="text-xs text-slate-400 font-bold">/mo</span>
                                    </p>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                        <MapPin className="w-3.5 h-3.5" /><span className="font-medium">{preview.location}</span>
                                    </div>
                                    <div className="flex gap-4 py-3 border-t border-b border-slate-100">
                                        {[
                                            { icon: BedDouble, value: preview.bedrooms, label: 'Beds' },
                                            { icon: Bath, value: preview.bathrooms, label: 'Baths' },
                                            { icon: Ruler, value: preview.area, label: 'sqft' },
                                        ].map(d => (
                                            <div key={d.label} className="flex items-center gap-1.5 text-sm">
                                                <d.icon className="w-4 h-4 text-indigo-400" />
                                                <span className="font-bold text-slate-700">{d.value}</span>
                                                <span className="text-slate-400 text-xs">{d.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{preview.description}</p>
                                    {preview.amenities && preview.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {preview.amenities.slice(0, 5).map(a => <span key={a} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">{a}</span>)}
                                            {preview.amenities.length > 5 && <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">+{preview.amenities.length - 5} more</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
