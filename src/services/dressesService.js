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
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const DRESSES_COLLECTION = 'dresses';
const USERS_COLLECTION = 'users';

// --- USER MANAGEMENT ---

export const createUserProfile = async (userId, email, name, role = 'client') => {
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
};

export const getUserProfile = async (userId) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};


// --- DRESS MANAGEMENT ---

// Function to upload an image to Firebase Storage
export const uploadImage = async (file, userId) => {
    if (!file) return null;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    // Store all reference images loosely by user who uploaded it
    const storageRef = ref(storage, `uploads/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// Create a new dress (Admin only logic usually, but here is generic)
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

// Get ALL dresses (For Admin)
export const getAllDresses = async () => {
    console.log("Fetching all dresses (Admin)");
    try {
        const dressesRef = collection(db, DRESSES_COLLECTION);
        const q = query(
            dressesRef,
            orderBy("deliveryDate", "asc")
        );

        const snapshot = await getDocs(q);
        console.log(`Fetched ${snapshot.docs.length} dresses`);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error in getAllDresses:", error.code, error.message);
        throw error;
    }
};

// Get all dresses for a specific user (For Client)
export const getUserDresses = async (userId) => {
    console.log("Fetching dresses for user:", userId);
    if (!userId) {
        console.warn("getUserDresses called without userId");
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
        console.log(`Fetched ${snapshot.docs.length} dresses for user ${userId}`);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error in getUserDresses:", error.code, error.message);
        if (error.message.includes("index")) {
            console.error("MISSING INDEX: Follow the link in the error above to create it.");
        }
        throw error;
    }
};

// Check if a specific date is already taken
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
