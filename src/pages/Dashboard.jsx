import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDresses } from '../services/dressesService';
import { Link } from 'react-router-dom';
import {
    Scissors,
    Clock,
    CheckCircle2,
    CalendarClock,
    ArrowRight,
    Users
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            if (!currentUser) return;
            try {
                // Modista sees ALL dresses
                const data = await getAllDresses();
                setDresses(data);
            } catch (error) {
                // Handle error
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    const pending = dresses.filter(d => d.status === 'pending');
    const inProgress = dresses.filter(d => d.status === 'in_progress');
    const completed = dresses.filter(d => d.status === 'completed');

    const today = new Date();
    const nextWeek = addDays(today, 7);

    const upcomingDeliveries = dresses
        .filter(d => d.status !== 'completed' && d.deliveryDate)
        .filter(d => {
            const date = d.deliveryDate.toDate();
            return isAfter(date, today) && isBefore(date, nextWeek);
        })
        .sort((a, b) => a.deliveryDate.toMillis() - b.deliveryDate.toMillis())
        .slice(0, 5);

    const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-105 duration-200">
            <div className={`p-4 rounded-xl ${bgColorClass} ${colorClass}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div>
                <h1 className="text-3xl font-serif font-semibold text-gray-800 tracking-tight">
                    Hola, hermosa 👋
                </h1>
                <p className="text-gray-500 mt-2">
                    Aquí está el resumen de tu taller para hoy.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Pendientes"
                    value={pending.length}
                    icon={Clock}
                    colorClass="text-amber-600"
                    bgColorClass="bg-amber-50"
                />
                <StatCard
                    title="En Proceso"
                    value={inProgress.length}
                    icon={Scissors}
                    colorClass="text-pink-600"
                    bgColorClass="bg-pink-50"
                />
                <StatCard
                    title="Finalizados"
                    value={completed.length}
                    icon={CheckCircle2}
                    colorClass="text-emerald-600"
                    bgColorClass="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Upcoming Deliveries Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <CalendarClock className="mr-2 text-pink-400" size={20} />
                            Próximas Entregas (Esta Semana)
                        </h2>
                        <Link to="/calendar" className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center">
                            Ver calendario
                            <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    {upcomingDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p>No hay entregas programadas para los próximos 7 días.</p>
                            <span role="img" aria-label="party" className="text-2xl mt-2 block">🎉</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingDeliveries.map(dress => (
                                <div key={dress.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-pink-50/30 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold uppercase shrink-0">
                                            {dress.clientName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{dress.clientName}</p>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {format(dress.deliveryDate.toDate(), "EEEE d 'de' MMMM", { locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${dress.status === 'in_progress' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {dress.status === 'in_progress' ? 'En proceso' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-8 text-white shadow-md flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-serif font-semibold mb-2">Crear nueva magia</h2>
                            <p className="text-pink-100 mb-8 max-w-sm">
                                ¿Llegó una nueva clienta? Registra su próximo vestido y mantén todo organizado.
                            </p>
                        </div>
                        <Link
                            to="/dresses/new"
                            className="bg-white text-pink-500 font-semibold py-3 px-6 rounded-xl text-center hover:bg-pink-50 transition-colors active:scale-95 shadow-sm"
                        >
                            + Registrar Nuevo Vestido
                        </Link>
                    </div>

                    <Link
                        to="/clients"
                        className="block bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-500 group-hover:bg-purple-100 transition-colors">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Gestionar Clientas</h3>
                                    <p className="text-sm text-gray-500">Ver medidas y registrar nuevas clientas</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
