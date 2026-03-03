import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createDress, uploadImage } from '../services/dressesService';
import { Timestamp } from 'firebase/firestore';
import {
    Camera,
    X,
    Save,
    Loader2,
    Scissors,
    User,
    Phone,
    Calendar,
    ImagePlus
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

export default function CreateDress() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // Base Form Data
    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        deliveryDate: '',
        notes: '',
        status: 'pending'
    });

    // Measurements Data
    const [measurements, setMeasurements] = useState(
        MEASUREMENTS.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})
    );

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleMeasurementChange = (key, value) => {
        setMeasurements(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images
            const uploadedUrls = [];
            for (const file of images) {
                const url = await uploadImage(file, currentUser.uid);
                if (url) uploadedUrls.push(url);
            }

            // 2. Clean empty measurements to save DB space
            const cleanedMeasurements = Object.fromEntries(
                Object.entries(measurements).filter(([_, v]) => v.trim() !== '')
            );

            // 3. Prepare data and save to Firestore
            const dressData = {
                clientName: formData.clientName,
                phone: formData.phone,
                deliveryDate: Timestamp.fromDate(new Date(formData.deliveryDate)),
                status: formData.status,
                notes: formData.notes,
                referenceImages: uploadedUrls,
                finalImage: "",
                measurements: cleanedMeasurements,
            };

            await createDress(dressData, currentUser.uid);
            navigate('/dresses');

        } catch (error) {
            console.error("Error creando vestido:", error);
            alert("Hubo un error al guardar el vestido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-pink-50 p-6 md:p-8 flex items-center border-b border-pink-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500 mr-4">
                    <Scissors size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Registrar Nuevo Vestido</h1>
                    <p className="text-pink-600 text-sm mt-1">Completa los detalles y medidas del nuevo proyecto.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">

                {/* General Info Section */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="mr-2 text-pink-400" size={20} /> Información General
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Clienta *</label>
                            <input
                                required
                                type="text"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                value={formData.clientName}
                                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                            <input
                                type="tel"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega *</label>
                            <input
                                required
                                type="date"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                                value={formData.deliveryDate}
                                onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors bg-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En Proceso</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                        <textarea
                            rows="3"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </section>

                {/* Pictures Section */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Camera className="mr-2 text-pink-400" size={20} /> Imágenes de Referencia
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Upload Button */}
                        <label className="border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center h-32 text-pink-400 hover:bg-pink-50 hover:border-pink-300 transition-colors cursor-pointer relative">
                            <ImagePlus size={28} className="mb-2" />
                            <span className="text-sm font-medium">Agregar foto</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </label>

                        {/* Preview Images */}
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative h-32 rounded-2xl overflow-hidden group border border-gray-200 shadow-sm">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Measurements Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Scissors className="mr-2 text-pink-400" size={20} /> Medidas
                        </h2>
                        <p className="text-sm text-gray-500">Solo llena las medidas necesarias para este diseño. Las demás puedes dejarlas en blanco.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {MEASUREMENTS.map(measure => (
                            <div key={measure} className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-1 capitalize truncate" title={measure}>
                                    {measure}
                                </label>
                                <input
                                    type="text"
                                    placeholder="cm"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-sm"
                                    value={measurements[measure]}
                                    onChange={e => handleMeasurementChange(measure, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Submit Actions */}
                <div className="flex justify-end pt-6 border-t border-gray-100 space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dresses')}
                        className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200 flex items-center disabled:opacity-70"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin mr-2" size={18} /> Guardando...</>
                        ) : (
                            <><Save className="mr-2" size={18} /> Guardar Vestido</>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
