// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDXksKWsgN4iUl86F3sl9c6IIgtUh5oxgA',
	authDomain: 'pedilo-box.firebaseapp.com',
	projectId: 'pedilo-box',
	storageBucket: 'pedilo-box.appspot.com',
	messagingSenderId: '332235951994',
	appId: '1:332235951994:web:af42c33f44fd03109650c3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
