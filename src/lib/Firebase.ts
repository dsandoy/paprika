import { initializeApp } from 'firebase/app';
import {
	CollectionReference,
	collection,
	doc,
	getFirestore,
	query,
	setDoc,
	where
} from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithRedirect, type User } from 'firebase/auth';
import type { Dish } from './types';

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

/** Handle the create and update of database elements */
export class DBService {
	/** Create a dish at the database.. Returns its id if successfull and "" else */
	public static async createDish(dish: Dish) {
		const docRef = doc(collection(firestore, 'dishes'));
		await setDoc(docRef, dish)
			.then(() => {
				return 0;
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				return -1;
			});
	}
}

export class DishQueries {
	/** Build a query were you fetch all dishes created by the logged in user */
	public static dishes(user: User | null) {
		const dishesRef = collection(firestore, 'dishes') as CollectionReference<Dish>;
		return query<Dish>(dishesRef, where('user', '==', user?.uid));
	}
}
