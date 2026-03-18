import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDresses, getAllClients } from '../services/dressesService';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, Loader2 } from 'lucide-react';

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

// Custom styles for the calendar
const calendarStyles = `
  .rbc-calendar { font-family: inherit; height: 100%; }
  .rbc-month-view { 
    border: 1px solid #f3f4f6 !important; 
    border-radius: 1rem; 
    overflow: hidden; 
    background: white;
  }
  .rbc-header { 
    padding: 12px 0; 
    font-weight: 700; 
    color: #4b5563; 
    border-bottom: 2px solid #fce7f3 !important; 
    text-transform: uppercase; 
    font-size: 0.75rem; 
  }
  .rbc-day-bg { border-left: 1px solid #f3f4f6 !important; }
  .rbc-month-row { border-top: 1px solid #f3f4f6 !important; min-height: 100px; }
  .rbc-today { background-color: #fff1f2 !important; }
  .rbc-date-cell { 
    padding: 8px; 
    font-size: 1.1rem; 
    font-weight: 700; 
    color: #374151; 
  }
  .rbc-off-range-bg { background-color: #f9fafb; }
  .rbc-event { background: transparent; padding: 0; border: none !important; }
  .rbc-show-more { color: #db2777; font-weight: 700; font-size: 0.75rem; }
  .rbc-toolbar-label { font-family: serif; font-size: 1.5rem; font-weight: 800; color: #111827; }
  .rbc-btn-group button { 
    border: 1px solid #e5e7eb; 
    background: white; 
    padding: 8px 16px; 
    border-radius: 10px;
    font-weight: 500;
  }
  .rbc-btn-group button.rbc-active { 
    background: #fce7f3; 
    color: #be185d; 
    font-weight: 700;
  }
`;

export default function CalendarView() {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!currentUser) return;
            try {
                const [dressesData, clientsData] = await Promise.all([
                    getAllDresses(),
                    getAllClients()
                ]);

                const clientsMap = clientsData.reduce((acc, client) => {
                    if (client.name) acc[client.name.toLowerCase()] = client.name;
                    return acc;
                }, {});

                const calendarEvents = dressesData
                    .filter(dress => dress.deliveryDate)
                    .map(dress => {
                        const date = dress.deliveryDate.toDate();
                        const syncedName = clientsMap[dress.clientName?.toLowerCase()] || dress.clientName || 'Sin Nombre';
                        return {
                            id: dress.id,
                            title: `${syncedName} - ${dress.status === 'in_progress' ? 'En Proceso' : dress.status === 'completed' ? 'Finalizado' : 'Pendiente'}`,
                            start: date,
                            end: date,
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

    const EventComponent = ({ event }) => {
        const { resource } = event;
        const statusColors = {
            completed: 'bg-emerald-500 text-white',
            in_progress: 'bg-pink-500 text-white',
            pending: 'bg-amber-400 text-amber-900'
        };

        return (
            <div className={`p-1 mt-1 rounded text-[10px] md:text-xs font-bold truncate shadow-sm ${statusColors[resource.status] || statusColors.pending}`}>
                {event.title}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <style>{calendarStyles}</style>
            
            <div className="flex items-center space-x-3">
                <div className="p-3 bg-pink-100 text-pink-500 rounded-2xl">
                    <CalendarDays size={26} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Calendario de Entregas</h1>
                    <p className="text-sm text-gray-500">Gestiona las fechas de entrega de tus vestidos.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 md:p-8">
                {loading ? (
                    <div className="h-[600px] flex items-center justify-center">
                        <Loader2 className="animate-spin text-pink-400" size={40} />
                    </div>
                ) : (
                    <div className="flex flex-col h-[750px]">
                        <div className="flex flex-wrap gap-3 mb-6">
                            {['Pendientes', 'En Proceso', 'Finalizados'].map((label, i) => (
                                <div key={label} className="flex items-center text-xs font-medium text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-pink-500' : 'bg-emerald-500'}`}></span>
                                    {label}
                                </div>
                            ))}
                        </div>

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
                                agenda: "Lista",
                                noEventsInRange: "No hay entregas para este periodo.",
                                showMore: total => `+${total} más`
                            }}
                            components={{
                                event: EventComponent
                            }}
                            views={['month', 'agenda']}
                            defaultView="month"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
