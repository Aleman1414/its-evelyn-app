import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createDress, isDateAvailable, uploadImage, hasMeasurements } from '../services/dressesService';
import { Timestamp } from 'firebase/firestore';
import {
    CalendarPlus,
    Loader2,
    MapPin,
    Camera,
    ImagePlus,
    X,
    AlertCircle
} from 'lucide-react';

export default function ScheduleDress() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMeasurements, setHasMeasurements] = useState(null);

    useEffect(() => {
        const checkMeasurements = async () => {
            if (currentUser) {
                const has = await hasMeasurements(currentUser.uid);
                setHasMeasurements(has);
            }
        };
        checkMeasurements();
    }, [currentUser]);

    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // Minimum date is tomorrow
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateString = minDate.toISOString().split('T')[0];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Validate Date Availability
            const available = await isDateAvailable(date);
            if (!available) {
                setError('Esa fecha ya se encuentra apartada para otra entrega. Por favor, selecciona otro día para poder atenderte como mereces. ✨');
                setLoading(false);
                return;
            }

            // 2. Upload Images (if any)
            const uploadedUrls = [];
            for (const file of images) {
                const url = await uploadImage(file, currentUser.uid);
                if (url) uploadedUrls.push(url);
            }

            // 3. Create document in Firestore
            // Notice we do NOT ask for name/phone, we pull name from auth profile usually, 
            // but we'll use email/display name as generic clientName for now.
            const dressData = {
                clientName: currentUser.displayName || currentUser.email.split('@')[0],
                phone: '',
                deliveryDate: Timestamp.fromDate(new Date(date)),
                status: 'pending',
                notes: notes,
                referenceImages: uploadedUrls,
                finalImage: "",
                measurements: {} // Client does not fill measurements
            };

            await createDress(dressData, currentUser.uid);

            // Go back to client dash
            navigate('/client');

        } catch (err) {
            setError("Ocurrió un error al agendar la cita. Intenta de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="bg-pink-50 p-8 border-b border-pink-100 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-pink-500 rounded-2xl shadow-sm mb-4">
                        <CalendarPlus size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Agendar Nuevo Diseño</h1>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm">
                        Selecciona la fecha en la que te gustaría que se entregue tu vestido.
                        Solo permitimos una entrega diaria para asegurar la mejor calidad.
                    </p>
                </div>

                {hasMeasurements === null ? (
                    <div className="p-8 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                        <p>Cargando...</p>
                    </div>
                ) : hasMeasurements ? (
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start border border-red-100">
                            <AlertCircle className="mr-2 shrink-0 mt-0.5" size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega Deseada *</label>
                        <input
                            required
                            type="date"
                            min={minDateString}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors bg-gray-50 focus:bg-white text-gray-800"
                            value={date}
                            onChange={e => {
                                setDate(e.target.value);
                                setError('');
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1">
                            Las fechas no disponibles o ya ocupadas serán rechazadas al guardar.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center">
                                <Camera size={16} className="mr-2 text-pink-400" />
                                Sube fotos de inspiración (Opcional)
                            </span>
                        </label>

                        <div className="grid grid-cols-3 gap-3">
                            <label className="border-2 border-dashed border-pink-200 rounded-xl flex flex-col items-center justify-center h-24 text-pink-400 hover:bg-pink-50 hover:border-pink-300 transition-colors cursor-pointer relative">
                                <ImagePlus size={24} className="mb-1" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">Agregar</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative h-24 rounded-xl overflow-hidden group border border-gray-200 shadow-sm">
                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuéntanos un poco sobre tu idea (Opcional)</label>
                        <textarea
                            rows="4"
                            placeholder="Ej: Quiero que sea de color azul rey, con escote en V y largo..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors bg-gray-50 focus:bg-white text-gray-800 resize-none"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start text-sm text-blue-800">
                        <MapPin size={20} className="mr-3 text-blue-400 shrink-0 mt-0.5" />
                        <p>Al agendar, revisaremos la disponibilidad y nos pondremos en contacto contigo para apartar tu cita de toma de medidas presencial en el taller.</p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/client')}
                            className="px-6 py-3 rounded-xl font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !date}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-pink-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin mr-2" size={20} /> Verificando y Guardando...</>
                            ) : (
                                'Confirmar Solicitud'
                            )}
                        </button>
                    </div>

                </form>
                ) : (
                    <div className="p-8 text-center">
                        <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Toma de Medidas Requerida</h2>
                        <p className="text-gray-600 mb-4">
                            Para crear tu primer vestido personalizado, necesitamos tomar tus medidas de manera presencial en el taller.
                            Una vez tomadas las medidas, podrás agendar diseños futuros solo con imágenes de referencia.
                        </p>
                        <button
                            onClick={() => navigate('/client')}
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors"
                        >
                            Regresar al Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
