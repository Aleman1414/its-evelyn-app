import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDresses, getAllClients } from '../services/dressesService';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, Scissors, CheckCircle, Loader2 } from 'lucide-react';

// Setup localizer
const locales = {
    'es': es,
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
    getDay,
    locales,
})

export default function CalendarView() {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!currentUser) return;
            try {
                // Fetch dresses and clients in parallel
                const [dressesData, clientsData] = await Promise.all([
                    getAllDresses(),
                    getAllClients()
                ]);

                // Map client data for easy lookup
                const clientsMap = clientsData.reduce((acc, client) => {
                    if (client.name) acc[client.name.toLowerCase()] = client.name;
                    return acc;
                }, {});

                // Transform dress data to Calendar Events
                const calendarEvents = dressesData
                    .filter(dress => dress.deliveryDate) // Ensure date exists
                    .map(dress => {
                        const date = dress.deliveryDate.toDate();
                        
                        // Sync client name: if a client exists in the clients collection 
                        // with the same name (case-insensitive), use the official name from the collection.
                        const syncedName = clientsMap[dress.clientName?.toLowerCase()] || dress.clientName || 'Sin Nombre';

                        return {
                            id: dress.id,
                            title: `${syncedName} - ${dress.status === 'in_progress' ? 'En Proceso' : dress.status === 'completed' ? 'Finalizado' : 'Pendiente'}`,
                            start: date,
                            end: date, // Same day delivery
                            allDay: true,
                            resource: dress
                        };
                    });

                setEvents(calendarEvents);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [currentUser]);

    // Custom Event component
    const EventComponent = ({ event }) => {
        const { resource } = event;
        const isCompleted = resource.status === 'completed';
        const isInProgress = resource.status === 'in_progress';

        return (
            <div className={`p-1.5 rounded-lg text-[10px] md:text-xs font-bold flex items-center shadow-sm w-full truncate h-full leading-tight border border-white/20 ${isCompleted ? 'bg-emerald-500 text-white' :
                    isInProgress ? 'bg-pink-500 text-white' :
                        'bg-amber-400 text-amber-900'
                }`}>
                <span className="truncate">{event.title}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-pink-100 text-pink-500 rounded-2xl shadow-sm">
                        <CalendarDays size={26} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-800">Calendario de Entregas</h1>
                        <p className="text-sm text-gray-500">Visualiza y gestiona las fechas de entrega.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 md:p-8 flex-1 min-h-[700px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-pink-400 mb-4" size={40} />
                            <p className="text-gray-500 font-medium">Cargando calendario...</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <div className="flex items-center text-xs font-medium text-gray-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2"></span> Pendientes
                            </div>
                            <div className="flex items-center text-xs font-medium text-gray-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
                                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-2"></span> En Proceso
                            </div>
                            <div className="flex items-center text-xs font-medium text-gray-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span> Finalizados
                            </div>
                        </div>

                        {/* Calendar */}
                        <style>{`
                            .rbc-calendar { font-family: inherit; border: none; }
                            .rbc-header { padding: 12px 8px; font-weight: 700; color: #374151; border-bottom: 2px solid #f3f4f6 !important; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
                            .rbc-month-view { border: none !important; }
                            .rbc-day-bg { transition: background-color 0.2s; }
                            .rbc-today { background-color: #fff1f2 !important; }
                            .rbc-today .rbc-date-cell { color: #be185d; font-weight: 800; }
                            .rbc-date-cell { 
                                padding: 8px 12px; 
                                font-size: 1.1rem; 
                                font-weight: 600; 
                                color: #4b5563; 
                                text-align: right; 
                            }
                            .rbc-off-range-bg { background-color: #f9fafb; opacity: 0.5; }
                            .rbc-event { background: transparent; padding: 0; border: none !important; }
                            .rbc-event-content { padding: 0; }
                            .rbc-show-more { color: #db2777; font-weight: 700; font-size: 0.75rem; padding-left: 8px; }
                            .rbc-toolbar { margin-bottom: 24px; }
                            .rbc-toolbar-label { font-family: serif; font-size: 1.5rem; font-weight: 800; color: #111827; }
                            .rbc-btn-group button { 
                                border: 1px solid #e5e7eb; 
                                background: white; 
                                color: #4b5563; 
                                padding: 8px 16px; 
                                font-size: 0.875rem; 
                                font-weight: 500;
                                transition: all 0.2s;
                                border-radius: 10px;
                                margin: 0 2px;
                            }
                            .rbc-btn-group button:hover { background: #f9fafb; border-color: #d1d5db; }
                            .rbc-btn-group button.rbc-active { 
                                background: #fce7f3; 
                                border-color: #f9a8d4; 
                                color: #be185d; 
                                font-weight: 700;
                                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                            }
                            .rbc-month-row { border-top: 1px solid #f3f4f6 !important; }
                            .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f3f4f6 !important; }
                        `}</style>

                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            culture="es"
                            messages={{
                                next: ">",
                                previous: "<",
                                today: "Hoy",
                                month: "Mes",
                                week: "Semana",
                                day: "Día",
                                agenda: "Lista",
                                noEventsInRange: "No hay entregas programadas.",
                                showMore: total => `+ ${total} vestidos`
                            }}
                            components={{
                                event: EventComponent
                            }}
                            className="flex-1"
                            views={['month', 'agenda']}
                            defaultView="month"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
