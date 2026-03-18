import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllDresses } from '../services/dressesService';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, Scissors, CheckCircle } from 'lucide-react';

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
        async function fetchDresses() {
            if (!currentUser) return;
            try {
                // Modista sees ALL dresses in calendar
                const data = await getAllDresses();

                // Transform dress data to Calendar Events
                const calendarEvents = data
                    .filter(dress => dress.deliveryDate) // Ensure date exists
                    .map(dress => {
                        const date = dress.deliveryDate.toDate();
                        return {
                            id: dress.id,
                            title: `${dress.clientName} - ${dress.status === 'in_progress' ? 'En Proceso' : dress.status === 'completed' ? 'Finalizado' : 'Pendiente'}`,
                            start: date,
                            end: date, // Same day delivery
                            allDay: true,
                            resource: dress
                        };
                    });

                setEvents(calendarEvents);
            } catch (error) {
                // Handle error silently
            } finally {
                setLoading(false);
            }
        }
        fetchDresses();
    }, [currentUser]);

    // Custom Event component
    const EventComponent = ({ event }) => {
        const { resource } = event;
        const isCompleted = resource.status === 'completed';
        const isInProgress = resource.status === 'in_progress';

        return (
            <div className={`p-1 rounded-md text-xs font-semibold flex items-center shadow-sm w-full truncate h-full ${isCompleted ? 'bg-emerald-500 text-white' :
                    isInProgress ? 'bg-pink-500 text-white' :
                        'bg-amber-400 text-amber-900'
                }`}>
                <span className="truncate">{event.title}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-2 shrink-0">
                <div className="p-3 bg-pink-100 text-pink-500 rounded-xl">
                    <CalendarDays size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Calendario de Entregas</h1>
                    <p className="text-sm text-gray-500">Todas las entregas agendadas de tus clientas.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex-1 min-h-[600px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
                    </div>
                ) : (
                    <div className="h-full pb-10">
                        {/* Legend */}
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-3 h-3 rounded-full bg-amber-400 mr-2 shadow-sm"></span> Pendientes
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-3 h-3 rounded-full bg-pink-500 mr-2 shadow-sm"></span> En Proceso
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-sm"></span> Finalizados
                            </div>
                        </div>

                        {/* Calendar */}
                        {/* Custom styles override for react-big-calendar to make it elegant */}
                        <style>{`
              .rbc-calendar { font-family: var(--font-sans); }
              .rbc-header { padding: 8px; font-weight: 600; color: #4b5563; border-bottom: 2px solid #fce7f3 !important; text-transform: capitalize; }
              .rbc-today { border-radius: 12px; background-color: #fdf2f8 !important; }
              .rbc-event { background: transparent; padding: 0; outline: none !important; }
              .rbc-event-content { outline: none; }
              .rbc-day-bg + .rbc-day-bg { border-left: 1px dashed #f3f4f6; }
              .rbc-month-row + .rbc-month-row { border-top: 1px dashed #f3f4f6; }
              .rbc-off-range-bg { background-color: #fafafa; }
              .rbc-btn-group button { color: #4b5563; transition: all 0.2s; border-radius: 8px; margin: 0 4px; padding: 6px 16px; border: 1px solid #e5e7eb; background: white; }
              .rbc-btn-group button.rbc-active { background: #fbcfe8; border-color: #f9a8d4; color: #831843; box-shadow: none; font-weight: 600;}
              .rbc-btn-group button:hover { background: #fce7f3; }
              .rbc-toolbar-label { font-family: serif; font-size: 1.25rem; font-weight: 700; color: #1f2937; text-transform: capitalize; }
            `}</style>

                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            culture="es"
                            messages={{
                                next: "Siguiente",
                                previous: "Anterior",
                                today: "Hoy",
                                month: "Mes",
                                week: "Semana",
                                day: "Día",
                                agenda: "Agenda",
                                date: "Fecha",
                                time: "Hora",
                                event: "Vestido",
                                noEventsInRange: "No hay entregas en este rango de fechas.",
                                showMore: total => `+ Ver ${total} más`
                            }}
                            components={{
                                event: EventComponent
                            }}
                            className="h-full rounded-2xl"
                            views={['month', 'agenda']}
                            defaultView="month"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
