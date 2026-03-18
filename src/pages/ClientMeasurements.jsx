import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClientByEmail } from '../services/dressesService';
import { Ruler, Sparkles, Heart } from 'lucide-react';

const MEASUREMENT_GROUPS = {
    'Parte Superior': [
        "escote", "hombro", "busto", "alto de busto", "talle atrás",
        "talle adelante", "contorno de hombro", "largo de blusa"
    ],
    'Cintura y Cadera': [
        "cintura", "cadera", "caderita", "cintura de falda"
    ],
    'Brazos y Mangas': [
        "brazo", "puño", "tirantes", "codo",
        "largo manga corta", "largo manga tres cuartos", "largo manga larga",
        "contorno manga larga"
    ],
    'Parte Inferior': [
        "alto rodilla", "largo de pantalón", "contorno rodilla",
        "tobillo", "largo short", "contorno pierna",
        "largo de falda", "largo sin vuelo", "largo de vuelo", "abierto"
    ]
};

export default function ClientMeasurements() {
    const { currentUser } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMyMeasurements() {
            if (!currentUser?.email) return;
            try {
                const client = await getClientByEmail(currentUser.email);
                setClientData(client);
            } catch (error) {
                console.error("Error loading measurements:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMyMeasurements();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    const measurements = clientData?.measurements || {};
    const hasMeasurements = Object.keys(measurements).length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center mb-3">
                        <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
                            <Ruler size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Mis Medidas</h1>
                            <p className="text-pink-100 text-sm mt-1">Medidas registradas por tu modista</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            </div>

            {!hasMeasurements ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 text-pink-400 rounded-2xl mb-6">
                        <Ruler size={40} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Aún no hay medidas registradas</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Tu modista registrará tus medidas durante tu próxima cita presencial en el taller. 
                        Una vez registradas, podrás verlas aquí en todo momento. ✨
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(MEASUREMENT_GROUPS).map(([groupName, groupMeasures]) => {
                        const groupData = groupMeasures.filter(m => measurements[m]);
                        if (groupData.length === 0) return null;

                        return (
                            <div key={groupName} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 bg-pink-50/30">
                                    <h3 className="font-semibold text-gray-800 flex items-center">
                                        <Sparkles className="mr-2 text-pink-400" size={16} />
                                        {groupName}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {groupData.map(measure => (
                                            <div key={measure} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 capitalize mb-1">{measure}</p>
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {measurements[measure]} <span className="text-xs font-normal text-gray-400">cm</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100 flex items-start text-sm text-pink-700">
                        <Heart size={18} className="mr-3 text-pink-400 shrink-0 mt-0.5" />
                        <p>
                            Estas medidas son actualizadas por tu modista. Si necesitas una actualización, 
                            agenda una cita de toma de medidas en el taller.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
