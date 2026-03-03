import {
    collection,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const DRESSES_COLLECTION = 'dresses';

// Function to upload an image to Firebase Storage
export const uploadImage = async (file, userId) => {
    if (!file) return null;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `users/${userId}/dresses/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
};

// Create a new dress
export const createDress = async (dressData, userId) => {
    const newDress = {
        ...dressData,
        userId,
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

// Get all dresses for a specific user
export const getUserDresses = async (userId) => {
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
};
