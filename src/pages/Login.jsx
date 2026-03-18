import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, Mail, Lock } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleEmailLogin(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await loginWithEmail(email, password);
            navigate('/');
        } catch (err) {
            setError('Error al iniciar sesión. Revisa tus credenciales.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Error al iniciar sesión con Google.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header section */}
                <div className="bg-white p-8 text-center border-b border-pink-50">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Its Evelyn" className="h-24 w-auto" />
                    </div>
                    <h1 className="text-3xl font-serif text-gray-800 hidden">Its Evelyn</h1>
                    <p className="text-pink-400 mt-2 text-sm font-medium uppercase tracking-widest">Gestión de Vestidos</p>
                </div>

                {/* Form section */}
                <div className="p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Bienvenida</h2>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-pink-200 focus:border-pink-300 transition-colors bg-gray-50 focus:bg-white text-gray-800"
                                    placeholder="tu@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-pink-200 focus:border-pink-300 transition-colors bg-gray-50 focus:bg-white text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-xl shadow-md shadow-pink-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Iniciando sesión...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <span className="h-px w-full bg-gray-100"></span>
                        <span className="text-xs text-gray-400 uppercase font-medium">o</span>
                        <span className="h-px w-full bg-gray-100"></span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full mt-6 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span>Continuar con Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
