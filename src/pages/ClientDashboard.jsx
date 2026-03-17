import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDresses } from '../services/dressesService';
import { Link } from 'react-router-dom';
import { Clock, CalendarPlus, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ClientDashboard() {
    const { currentUser } = useAuth();
    const [dresses, setDresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMyDresses() {
            if (!currentUser) return;
            try {
                const data = await getUserDresses(currentUser.uid);
                setDresses(data);
            } catch (error) {
                // Error handled silently or show user message
            } finally {
                setLoading(false);
            }
        }
        fetchMyDresses();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    const upcomingDresses = dresses.filter(d => d.status !== 'completed');
    const pastDresses = dresses.filter(d => d.status === 'completed');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Panel */}
            <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif font-bold mb-2">Mi clóset virtual</h1>
                    <p className="text-pink-100 max-w-md">
                        Lleva el seguimiento de los diseños que estamos creando para ti y agenda tu próxima visita.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/client/schedule"
                            className="bg-white text-pink-600 font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-pink-50 transition-colors flex items-center"
                        >
                            <CalendarPlus className="mr-2" size={20} />
                            Agendar Nuevo Vestido
                        </Link>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* My Current Orders Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <Clock className="mr-2 text-pink-400" size={24} />
                        Proyectos en Curso
                    </h2>

                    {upcomingDresses.length === 0 ? (
                        <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">Aún no tienes vestidos en proceso.</p>
                            <Link to="/client/schedule" className="text-pink-500 font-medium hover:underline">
                                ¡Comienza a crear magia!
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingDresses.map(dress => (
                                <div key={dress.id} className="border border-pink-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${dress.status === 'in_progress' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {dress.status === 'in_progress' ? 'En Taller (Confección)' : 'Agendado y Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 flex items-center mb-1">
                                        <CalendarPlus size={14} className="mr-1.5" />
                                        Entrega esperada: <strong className="ml-1 text-gray-700">{dress.deliveryDate ? format(dress.deliveryDate.toDate(), "dd 'de' MMMM", { locale: es }) : 'Por definir'}</strong>
                                    </p>

                                    {dress.referenceImages?.length > 0 && (
                                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                            {dress.referenceImages.map((img, i) => (
                                                <img key={i} src={img} alt="Ref" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info & Past Dresses Section */}
                <div className="space-y-8">

                    {/* Contact / Taller Info */}
                    <div className="bg-pink-50 rounded-3xl p-6 border border-pink-100">
                        <h3 className="font-semibold text-pink-800 mb-4">Información del Taller</h3>
                        <div className="space-y-3">
                            <p className="flex items-center text-pink-700 text-sm">
                                <MapPin size={16} className="mr-2" />
                                Calle Principal #123, Colonia Centro.
                            </p>
                            <p className="flex items-center text-pink-700 text-sm">
                                <Phone size={16} className="mr-2" />
                                +52 (55) 1234-5678
                            </p>
                            <p className="text-xs text-pink-600 mt-4 leading-relaxed bg-white/50 p-3 rounded-xl border border-pink-100/50">
                                Recuerda: Tu cita para toma de medidas será confirmada por mensaje al agendar un nuevo vestido.
                            </p>
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Diseños</h3>
                        {pastDresses.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No tienes vestidos entregados aún.</p>
                        ) : (
                            <div className="space-y-3">
                                {pastDresses.map(dress => (
                                    <div key={dress.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm text-gray-600 font-medium">Vestido de {format(dress.deliveryDate.toDate(), "MMMM yyyy", { locale: es })}</span>
                                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">Entregado</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
