// Run this snippet in your browser's DevTools console while logged in
// to the Firebase project to promote a user to 'modista' role.
//
// Replace YOUR_USER_ID with the user's Firebase Auth UID.
//
// firebase.firestore().collection('users').doc('YOUR_USER_ID').update({ role: 'modista' })
//
// Or via the Firebase Console:
// 1. Go to Firestore Database
// 2. Navigate to the 'users' collection
// 3. Find the document with the user's UID
// 4. Change the 'role' field from 'clienta' to 'modista'
//
// Example using the Admin SDK (Node.js):
// const admin = require('firebase-admin');
// admin.initializeApp();
// const db = admin.firestore();
// db.collection('users').doc('YOUR_USER_ID').update({ role: 'modista' });
