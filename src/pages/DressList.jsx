import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDresses, updateDress, deleteDress } from '../services/dressesService';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle,
    Clock,
    Scissors
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DressList() {
    const { currentUser } = useAuth();
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchDresses = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getUserDresses(currentUser.uid);
            setDresses(data);
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDresses();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás segura de que quieres eliminar este vestido? Esta acción no se puede deshacer.')) {
            await deleteDress(id);
            fetchDresses();
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        await updateDress(id, { status: newStatus });
        fetchDresses();
    }

    const filteredDresses = dresses.filter(dress => {
        const matchesSearch = dress.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || dress.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="flex items-center text-xs font-medium px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full"><CheckCircle size={12} className="mr-1" /> Finalizado</span>;
            case 'in_progress':
                return <span className="flex items-center text-xs font-medium px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full"><Scissors size={12} className="mr-1" /> En proceso</span>;
            default:
                return <span className="flex items-center text-xs font-medium px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full"><Clock size={12} className="mr-1" /> Pendiente</span>;
        }
    };

    return (
        <div className="space-y-6">

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Listado de Vestidos</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra todos los pedidos de tus clientas.</p>
                </div>
                <Link
                    to="/dresses/new"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-pink-200 transition-colors flex items-center shrink-0"
                >
                    <Plus size={18} className="mr-2" /> Nuevo Vestido
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de clienta..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 outline-none text-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="in_progress">En proceso</option>
                        <option value="completed">Finalizados</option>
                    </select>
                </div>
            </div>

            {/* Table/Cards Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                    </div>
                ) : filteredDresses.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No se encontraron vestidos con los filtros actuales.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-pink-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold">Clienta</th>
                                    <th className="px-6 py-4 font-semibold">Fecha de Entrega</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold">Imágenes</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                {filteredDresses.map(dress => (
                                    <tr key={dress.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{dress.clientName}</div>
                                            {dress.phone && <div className="text-gray-400 text-xs mt-0.5">{dress.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {dress.deliveryDate ? format(dress.deliveryDate.toDate(), "d MMM yyyy", { locale: es }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(dress.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {dress.referenceImages?.slice(0, 3).map((img, i) => (
                                                    <img key={i} src={img} alt="Ref" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                                                ))}
                                                {dress.referenceImages?.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                                        +{dress.referenceImages.length - 3}
                                                    </div>
                                                )}
                                                {!dress.referenceImages?.length && <span className="text-gray-400 text-xs italic">Sin fotos</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                {/* Status Quick Toggle */}
                                                {dress.status !== 'completed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(dress.id, dress.status === 'pending' ? 'in_progress' : 'completed')}
                                                        className="p-1.5 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                                                        title="Avanzar estado"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(dress.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
