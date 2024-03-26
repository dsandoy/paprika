import { initializeApp } from 'firebase/app';
import {
	CollectionReference,
	and,
	collection,
	doc,
	getDoc,
	getFirestore,
	query,
	setDoc,
	where
} from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithRedirect, type User } from 'firebase/auth';
import type { Dish, PlanEntry } from './types';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { DateHandler } from './utils';

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
export const storage = getStorage();
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
		let result = -1;
		await setDoc(docRef, dish)
			.then(() => {
				result = 0;
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
				result - 1;
			});
		return result;
	}

	/** Upload the file to the storage and return the url */
	public static async uploadImage(file: File) {
		const randomNumber = Math.floor(Math.random() * 100);
		const storageRef = ref(storage, `dishes/${randomNumber}-${file.name}`);
		await uploadBytes(storageRef, file);
		const url = await getDownloadURL(storageRef);
		return url;
	}

	/** Creates empty plan entries for the week starting on monday */
	public static async createWeekPlans(monday: Date) {
		const docRef = doc(collection(firestore, 'dishplans'));

		let date = monday;
		for (let i = 0; i < 7; i++) {
			const emtpyPlan: PlanEntry = {
				date: date
			};

			let result = -1;
			await setDoc(docRef, emtpyPlan)
				.then(() => (result = 0))
				.catch(() => (result = -1));
			if (result !== 0) {
				console.error('Failed to create planentries..');
				break;
			}
			date = DateHandler.getNextDay(date);
		}
	}
}

export class DishQueries {
	/** Build a query were you fetch all dishes created by the logged in user */
	public static dishes(user: User | null) {
		const dishesRef = collection(firestore, 'dishes') as CollectionReference<Dish>;
		return query<Dish>(dishesRef, where('user', '==', user?.uid));
	}
}

/** Quiery builders for the dishplans */
export class PlanQueries {
	/** Get all plan entries for the provided date range for the user */
	public static getPlans(user: User | null, dateRange: Date[]) {
		const dishesRef = collection(firestore, 'dishplans') as CollectionReference<PlanEntry>;
		return query<PlanEntry>(
			dishesRef,
			where('user', '==', user?.uid),
			where('date', '>=', dateRange[0]),
			where('date', '<=', dateRange[1])
		);
	}
}
