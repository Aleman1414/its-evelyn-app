import {
    MapPin,
    Phone,
    Clock,
    Scissors,
    Heart,
    Star,
    Instagram,
    MessageCircle
} from 'lucide-react';

export default function WorkshopInfo() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
                            <Scissors size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold">Taller its-evelyn</h1>
                            <p className="text-pink-100 mt-1">Donde cada vestido cuenta una historia ✨</p>
                        </div>
                    </div>
                    <p className="text-pink-100 max-w-lg mt-4 leading-relaxed text-sm md:text-base">
                        Creamos vestidos únicos con amor y detalle. Cada pieza es diseñada especialmente 
                        para ti, cuidando cada costura y cada detalle para que te sientas espectacular.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                        <Phone className="mr-2 text-pink-400" size={20} />
                        Contacto
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-pink-50 rounded-lg text-pink-500 shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Dirección</p>
                                <p className="text-sm text-gray-500 mt-0.5">Calle Principal #123, Colonia Centro.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-pink-50 rounded-lg text-pink-500 shrink-0">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Teléfono / WhatsApp</p>
                                <p className="text-sm text-gray-500 mt-0.5">+504 9999-9999</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-pink-50 rounded-lg text-pink-500 shrink-0">
                                <Instagram size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Instagram</p>
                                <p className="text-sm text-gray-500 mt-0.5">@its.evelyn</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                        <Clock className="mr-2 text-pink-400" size={20} />
                        Horarios de Atención
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-600">Lunes a Viernes</span>
                            <span className="font-medium text-gray-800 bg-pink-50 px-3 py-1 rounded-lg text-sm">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-600">Sábado</span>
                            <span className="font-medium text-gray-800 bg-pink-50 px-3 py-1 rounded-lg text-sm">9:00 AM - 1:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Domingo</span>
                            <span className="font-medium text-gray-400 text-sm">Cerrado</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 bg-amber-50 p-3 rounded-xl border border-amber-100">
                        ⏰ Las citas para toma de medidas se agendan con al menos 24 horas de anticipación.
                    </p>
                </div>

                {/* How it works */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                        <Star className="mr-2 text-pink-400" size={20} />
                        ¿Cómo funciona?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-3 text-xl font-bold">1</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Agenda tu Cita</h3>
                            <p className="text-sm text-gray-500">Selecciona la fecha deseada para la entrega de tu vestido desde la app.</p>
                        </div>
                        <div className="text-center p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-3 text-xl font-bold">2</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Toma de Medidas</h3>
                            <p className="text-sm text-gray-500">Te contactamos para agendar tu cita presencial de toma de medidas.</p>
                        </div>
                        <div className="text-center p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-3 text-xl font-bold">3</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Tu Vestido</h3>
                            <p className="text-sm text-gray-500">Confeccionamos tu vestido y te avisamos cuando esté listo para entrega.</p>
                        </div>
                    </div>
                </div>

                {/* Policies */}
                <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 md:col-span-2">
                    <h2 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                        <Heart className="mr-2 text-pink-400" size={20} />
                        Información Importante
                    </h2>
                    <div className="space-y-3 text-sm text-pink-700">
                        <div className="flex items-start">
                            <MessageCircle size={16} className="mr-2 mt-0.5 shrink-0 text-pink-400" />
                            <p>Tu cita para toma de medidas será confirmada por mensaje de WhatsApp al agendar un nuevo vestido.</p>
                        </div>
                        <div className="flex items-start">
                            <MessageCircle size={16} className="mr-2 mt-0.5 shrink-0 text-pink-400" />
                            <p>Solo manejamos una entrega por día para asegurar la mejor calidad en cada vestido.</p>
                        </div>
                        <div className="flex items-start">
                            <MessageCircle size={16} className="mr-2 mt-0.5 shrink-0 text-pink-400" />
                            <p>Las fechas de entrega deben ser agendadas con al menos 1 día de anticipación.</p>
                        </div>
                        <div className="flex items-start">
                            <MessageCircle size={16} className="mr-2 mt-0.5 shrink-0 text-pink-400" />
                            <p>Para cambios o cancelaciones, comunícate con nosotras al menos 48 horas antes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
