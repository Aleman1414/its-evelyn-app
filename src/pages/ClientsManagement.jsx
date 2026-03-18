import { useState, useEffect } from 'react';
import {
    getAllClients,
    createClient,
    updateClient,
    deleteClient
} from '../services/dressesService';
import {
    Users,
    Plus,
    Search,
    ChevronDown,
    ChevronUp,
    Edit3,
    Trash2,
    Save,
    X,
    Loader2,
    Phone,
    Mail,
    Ruler,
    UserPlus
} from 'lucide-react';

const MEASUREMENTS = [
    "escote", "hombro", "busto", "talle atrás", "talle adelante",
    "cintura", "cadera", "caderita", "alto de busto", "largo de blusa",
    "contorno de hombro", "puño", "tirantes", "codo",
    "largo manga tres cuartos", "largo manga corta", "largo manga larga",
    "contorno manga larga", "brazo", "alto rodilla", "largo de pantalón",
    "contorno rodilla", "tobillo", "largo short", "contorno pierna",
    "largo de falda", "cintura de falda", "largo sin vuelo", "largo de vuelo", "abierto"
];

export default function ClientsManagement() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClient, setExpandedClient] = useState(null);
    const [editingClient, setEditingClient] = useState(null);
    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // New client form state
    const [newClient, setNewClient] = useState({
        name: '',
        phone: '',
        email: '',
        notes: '',
        measurements: MEASUREMENTS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
    });

    // Edit measurements state
    const [editMeasurements, setEditMeasurements] = useState({});

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await getAllClients();
            setClients(data);
        } catch (error) {
            console.error("Error loading clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Clean empty measurements
            const cleanedMeasurements = Object.fromEntries(
                Object.entries(newClient.measurements).filter(([_, v]) => v.trim() !== '')
            );
            await createClient({
                name: newClient.name,
                phone: newClient.phone,
                email: newClient.email,
                notes: newClient.notes,
                measurements: cleanedMeasurements
            });
            setNewClient({
                name: '',
                phone: '',
                email: '',
                notes: '',
                measurements: MEASUREMENTS.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
            });
            setShowNewClientForm(false);
            await fetchClients();
        } catch (error) {
            console.error("Error creating client:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleStartEdit = (client) => {
        setEditingClient(client.id);
        // Fill measurements state with existing data
        const filled = MEASUREMENTS.reduce((acc, m) => ({
            ...acc,
            [m]: client.measurements?.[m] || ''
        }), {});
        setEditMeasurements(filled);
    };

    const handleSaveMeasurements = async (clientId) => {
        setSaving(true);
        try {
            const cleanedMeasurements = Object.fromEntries(
                Object.entries(editMeasurements).filter(([_, v]) => v.trim() !== '')
            );
            await updateClient(clientId, { measurements: cleanedMeasurements });
            setEditingClient(null);
            await fetchClients();
        } catch (error) {
            console.error("Error updating measurements:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('¿Estás segura de eliminar esta clienta? Esta acción no se puede deshacer.')) {
            try {
                await deleteClient(clientId);
                setExpandedClient(null);
                await fetchClients();
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const MeasurementsGrid = ({ measurements, editable = false, onChange }) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {MEASUREMENTS.map(measure => (
                <div key={measure} className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1 capitalize truncate" title={measure}>
                        {measure}
                    </label>
                    {editable ? (
                        <input
                            type="text"
                            placeholder="cm"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-sm bg-white"
                            value={measurements[measure] || ''}
                            onChange={e => onChange(measure, e.target.value)}
                        />
                    ) : (
                        <span className={`text-sm px-3 py-1.5 rounded-lg ${measurements[measure] ? 'bg-white border border-gray-200 text-gray-800 font-medium' : 'text-gray-400 italic'}`}>
                            {measurements[measure] || '—'}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800 flex items-center">
                        <Users className="mr-3 text-pink-400" size={28} />
                        Mis Clientas
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona las clientas y sus medidas registradas.
                    </p>
                </div>
                <button
                    onClick={() => setShowNewClientForm(!showNewClientForm)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-pink-200 transition-colors flex items-center shrink-0"
                >
                    {showNewClientForm ? (
                        <><X size={18} className="mr-2" /> Cancelar</>
                    ) : (
                        <><UserPlus size={18} className="mr-2" /> Nueva Clienta</>
                    )}
                </button>
            </div>

            {/* New Client Form */}
            {showNewClientForm && (
                <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
                    <div className="bg-pink-50 p-5 border-b border-pink-100">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <UserPlus className="mr-2 text-pink-400" size={20} />
                            Registrar Nueva Clienta
                        </h2>
                    </div>
                    <form onSubmit={handleCreateClient} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Nombre completo"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="+504 9999-9999"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                    value={newClient.phone}
                                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="clienta@email.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                    value={newClient.email}
                                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                            <textarea
                                rows="2"
                                placeholder="Notas sobre la clienta..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors resize-none"
                                value={newClient.notes}
                                onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
                            />
                        </div>

                        {/* Measurements for new client */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Ruler size={16} className="mr-2 text-pink-400" />
                                Medidas (Opcional — puedes agregarlas después)
                            </h3>
                            <MeasurementsGrid
                                measurements={newClient.measurements}
                                editable={true}
                                onChange={(measure, value) => setNewClient({
                                    ...newClient,
                                    measurements: { ...newClient.measurements, [measure]: value }
                                })}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowNewClientForm(false)}
                                className="px-6 py-2.5 rounded-xl font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm shadow-pink-200 transition-colors flex items-center disabled:opacity-70"
                            >
                                {saving ? (
                                    <><Loader2 className="animate-spin mr-2" size={18} /> Guardando...</>
                                ) : (
                                    <><Save className="mr-2" size={18} /> Guardar Clienta</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Clients List */}
            <div className="space-y-4">
                {filteredClients.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500">
                            {searchTerm ? 'No se encontraron clientas con ese criterio.' : 'Aún no tienes clientas registradas.'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowNewClientForm(true)}
                                className="mt-4 text-pink-500 font-medium hover:underline"
                            >
                                ¡Registra tu primera clienta!
                            </button>
                        )}
                    </div>
                ) : (
                    filteredClients.map(client => {
                        const isExpanded = expandedClient === client.id;
                        const isEditing = editingClient === client.id;
                        const measurementCount = client.measurements ? Object.keys(client.measurements).length : 0;

                        return (
                            <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
                                {/* Client Header Row */}
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer"
                                    onClick={() => {
                                        setExpandedClient(isExpanded ? null : client.id);
                                        if (isEditing) setEditingClient(null);
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-600 font-bold uppercase text-lg shrink-0">
                                            {client.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{client.name}</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                {client.phone && (
                                                    <span className="flex items-center text-xs text-gray-500">
                                                        <Phone size={12} className="mr-1" /> {client.phone}
                                                    </span>
                                                )}
                                                {client.email && (
                                                    <span className="flex items-center text-xs text-gray-500">
                                                        <Mail size={12} className="mr-1" /> {client.email}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="hidden sm:inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-pink-50 text-pink-600">
                                            <Ruler size={12} className="mr-1" /> {measurementCount} medidas
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="text-gray-400" size={20} />
                                        ) : (
                                            <ChevronDown className="text-gray-400" size={20} />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                                        {/* Notes */}
                                        {client.notes && (
                                            <div className="mb-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                                                💬 {client.notes}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveMeasurements(client.id)}
                                                        disabled={saving}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors disabled:opacity-70"
                                                    >
                                                        {saving ? (
                                                            <><Loader2 className="animate-spin mr-1.5" size={14} /> Guardando...</>
                                                        ) : (
                                                            <><Save size={14} className="mr-1.5" /> Guardar Medidas</>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingClient(null)}
                                                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl text-sm font-medium flex items-center transition-colors"
                                                    >
                                                        <X size={14} className="mr-1" /> Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStartEdit(client); }}
                                                        className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors"
                                                    >
                                                        <Edit3 size={14} className="mr-1.5" /> Editar Medidas
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm transition-colors flex items-center"
                                                    >
                                                        <Trash2 size={14} className="mr-1" /> Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Measurements */}
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <Ruler size={16} className="mr-2 text-pink-400" />
                                            Medidas Registradas
                                        </h3>
                                        {isEditing ? (
                                            <MeasurementsGrid
                                                measurements={editMeasurements}
                                                editable={true}
                                                onChange={(measure, value) => setEditMeasurements(prev => ({ ...prev, [measure]: value }))}
                                            />
                                        ) : (
                                            measurementCount > 0 ? (
                                                <MeasurementsGrid
                                                    measurements={client.measurements}
                                                    editable={false}
                                                />
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                    <Ruler className="mx-auto text-gray-300 mb-2" size={32} />
                                                    <p className="text-gray-500 text-sm">Sin medidas registradas aún.</p>
                                                    <button
                                                        onClick={() => handleStartEdit(client)}
                                                        className="mt-2 text-pink-500 text-sm font-medium hover:underline"
                                                    >
                                                        Agregar medidas
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
