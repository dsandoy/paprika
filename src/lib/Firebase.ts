import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithRedirect } from 'firebase/auth';

const app = initializeApp({
	apiKey: 'AIzaSyDQkAHO5mLvZm4VnRG84CsA7Jico7ouXGU',
	authDomain: 'paprika-dsa.firebaseapp.com',
	projectId: 'paprika-dsa',
	storageBucket: 'paprika-dsa.appspot.com',
	messagingSenderId: '869704918828',
	appId: '1:869704918828:web:746b120834090afb7a6e89'
});

export const firestore = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
export { googleProvider };

/** Sign in through firebase with Google */
export async function SignInWithGoogle() {
	await signInWithRedirect(auth, googleProvider);
}

export async function SignOut() {
	await auth.signOut();
}
