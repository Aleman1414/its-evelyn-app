import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { getUserProfile, createUserProfile } from '../services/dressesService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch or create profile logic
                let profile = await getUserProfile(user.uid);

                // If no profile exists, create a default 'client' profile
                if (!profile) {
                    profile = await createUserProfile(
                        user.uid,
                        user.email,
                        user.displayName || user.email.split('@')[0],
                        'client'
                    );
                }
                setUserRole(profile.role);
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const registerWithEmail = async (email, password, name) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Explicitly create user profile as client
        await createUserProfile(res.user.uid, email, name, 'client');
        return res;
    };

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userRole,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
