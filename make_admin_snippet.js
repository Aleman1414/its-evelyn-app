// Script to promote a user to Admin
// Usage: Run this in your browser console after logging into your app
// Replace 'YOUR_USER_UID' with the UID from Firebase Auth.

/* 
async function makeMeAdmin(uid) {
  const { doc, updateDoc } = await import('firebase/firestore');
  const { db } = await import('./src/config/firebase.js'); // adjust path if running locally from src
  
  await updateDoc(doc(db, 'users', uid), {
    role: 'admin'
  });
  console.log("Success! You are now an Admin. Refresh the page.");
}

makeMeAdmin('YOUR_USER_UID'); 
*/
