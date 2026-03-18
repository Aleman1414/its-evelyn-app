import {
    collection,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const DRESSES_COLLECTION = 'dresses';
const USERS_COLLECTION = 'users';
const CLIENTS_COLLECTION = 'clients';

// --- USER MANAGEMENT ---

export const createUserProfile = async (userId, email, name, role = 'clienta') => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email,
                name,
                role,
                createdAt: serverTimestamp()
            });
            return { email, name, role };
        }
        return userSnap.data();
    } catch (error) {
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
        throw error;
    }
};

// --- CLIENT MANAGEMENT (Modista manages clients) ---

export const getAllClients = async () => {
    try {
        const clientsRef = collection(db, CLIENTS_COLLECTION);
        const q = query(clientsRef, orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error in getAllClients:", error);
        throw error;
    }
};

export const getClientById = async (clientId) => {
    try {
        const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
        const clientSnap = await getDoc(clientRef);
        return clientSnap.exists() ? { id: clientSnap.id, ...clientSnap.data() } : null;
    } catch (error) {
        console.error("Error in getClientById:", error);
        throw error;
    }
};

export const createClient = async (clientData) => {
    try {
        const newClient = {
            ...clientData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), newClient);
        return docRef.id;
    } catch (error) {
        console.error("Error in createClient:", error);
        throw error;
    }
};

export const updateClient = async (clientId, updatedData) => {
    try {
        const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
        await updateDoc(clientRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error in updateClient:", error);
        throw error;
    }
};

export const deleteClient = async (clientId) => {
    try {
        const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
        await deleteDoc(clientRef);
    } catch (error) {
        console.error("Error in deleteClient:", error);
        throw error;
    }
};

// Get client profile linked by email (for authenticated clienta users)
export const getClientByEmail = async (email) => {
    try {
        const clientsRef = collection(db, CLIENTS_COLLECTION);
        const q = query(clientsRef, where("email", "==", email));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
        console.error("Error in getClientByEmail:", error);
        throw error;
    }
};

// --- DRESS MANAGEMENT ---

// Function to upload an image to Firebase Storage
export const uploadImage = async (file, userId) => {
    if (!file) return null;

    // Validation: Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido. Solo imágenes JPEG, PNG, GIF o WebP.');
    }

    // Validation: Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `uploads/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// Create a new dress
export const createDress = async (dressData, adminUid) => {
    const newDress = {
        ...dressData,
        createdBy: adminUid,
        createdAt: serverTimestamp(),
        completedAt: null
    };

    const docRef = await addDoc(collection(db, DRESSES_COLLECTION), newDress);
    return docRef.id;
};

// Update an existing dress
export const updateDress = async (id, updatedData) => {
    const dressRef = doc(db, DRESSES_COLLECTION, id);
    await updateDoc(dressRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
    });
};

// Delete a dress
export const deleteDress = async (id) => {
    const dressRef = doc(db, DRESSES_COLLECTION, id);
    await deleteDoc(dressRef);
};

// --- QUERIES ---

// Get ALL dresses (For Modista)
export const getAllDresses = async () => {
    try {
        const dressesRef = collection(db, DRESSES_COLLECTION);
        const q = query(
            dressesRef,
            orderBy("deliveryDate", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

// Get all dresses for a specific user (For Clienta)
export const getUserDresses = async (userId) => {
    if (!userId) {
        return [];
    }
    try {
        const dressesRef = collection(db, DRESSES_COLLECTION);
        const q = query(
            dressesRef,
            where("userId", "==", userId),
            orderBy("deliveryDate", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

// Check if user has measurements (has at least one completed dress)
export const hasMeasurements = async (userId) => {
    try {
        const dressesRef = collection(db, DRESSES_COLLECTION);
        const q = query(
            dressesRef,
            where("userId", "==", userId),
            where("status", "==", "completed"),
            limit(1)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        return false;
    }
};

// Check if a date is available for delivery (only one dress per day)
export const isDateAvailable = async (date) => {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dressesRef = collection(db, DRESSES_COLLECTION);
    const q = query(
        dressesRef,
        where("deliveryDate", ">=", startOfDay),
        where("deliveryDate", "<=", endOfDay)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty; // True if no events on that day
};
