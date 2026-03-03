import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Scissors,
    ListTodo,
    CalendarDays,
    LogOut,
    Menu,
    X
} from 'lucide-react';

export default function Layout() {
    const { logout, currentUser } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const adminNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Vestidos', href: '/dresses', icon: ListTodo },
        { name: 'Nuevo Vestido', href: '/dresses/new', icon: Scissors },
        { name: 'Calendario', href: '/calendar', icon: CalendarDays },
    ];

    const clientNavigation = [
        { name: 'Mis Diseños', href: '/client', icon: ListTodo },
        { name: 'Agendar Vestido', href: '/client/schedule', icon: CalendarDays },
    ];

    const { userRole } = useAuth();
    const navigation = userRole === 'admin' ? adminNavigation : clientNavigation;

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
            >
                <div className="h-16 flex items-center px-6 border-b border-pink-50 bg-pink-50/30">
                    <Scissors className="text-pink-400 mr-2" size={24} />
                    <h1 className="font-serif text-xl font-semibold text-gray-800 tracking-wide">its-evelyn</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href) && (item.href !== '/dresses' || location.pathname === '/dresses');
                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-pink-50 text-pink-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon size={20} className={isActive ? 'text-pink-500' : 'text-gray-400'} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium uppercase">
                            {currentUser?.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-700 truncate">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                    >
                        <LogOut size={20} className="text-gray-400 group-hover:text-red-500" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
                    <div className="flex items-center">
                        <Scissors className="text-pink-400 mr-2" size={24} />
                        <h1 className="font-serif text-lg font-semibold text-gray-800">its-evelyn</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Dynamic View Content */}
                <main className="flex-1 overflow-auto bg-[var(--color-background)]">
                    <div className="mx-auto max-w-6xl p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}
