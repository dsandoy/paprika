import { initializeApp } from 'firebase/app';
import {
	CollectionReference,
	Query,
	Timestamp,
	collection,
	doc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, type User } from 'firebase/auth';
import type { Dish, PlanEntry, ShoppingList, ShoppingListEntry } from './types';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { DateHandler } from './utils';
import { NoDocumentError, ValueError } from './errors';

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

export const DISHES_DOC = 'dishes';
export const DISHPLANS_DOC = 'dishplans';
export const LIST_DOC = 'shoppingList';

/** Handle the create and update of database elements */
export class DBService {
	/** Create a dish at the database.. Returns its id if successfull and "" else
	 *  @param dish The dish to create
	 */
	public static async createDish(dish: Dish) {
		const docRef = doc(collection(firestore, DISHES_DOC));
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

	/** Upload the file to the storage and return the url
	 *  @param file The file to upload
	 */
	public static async uploadImage(file: File) {
		const randomNumber = Math.floor(Math.random() * 10000);
		const storageRef = ref(storage, `dishes/${randomNumber}-${file.name}`);
		try {
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			return url;
		} catch (error) {
			console.error('Error uploading image: ', error);
		}
	}

	/** Creates empty plan entries for the week starting on monday
	 *  @param monday The first day of the week to create
	 *  @param user The logged in user
	 */
	public static async createWeekPlans(monday: Date, user: User | null) {
		let date = monday;
		for (let i = 0; i < 7; i++) {
			const docRef = doc(collection(firestore, DISHPLANS_DOC));
			const emtpyPlan: PlanEntry = {
				date: Timestamp.fromDate(date),
				user: user?.uid
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

	/** Retrieves the provided data requested by the query
	 *  @param query The query to fetch
	 */
	public static async getResources(query: Query | undefined) {
		if (!query) {
			return;
		}
		const snapshot = await getDocs(query);
		const docs: Dish[] | { id?: string }[] = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			const docEntry = { id: doc.id, ...data } as unknown as Dish;
			docs.push(docEntry);
		});
		if (snapshot.docs.length > 1) return docs;
		else {
			try {
				const doc = docs[0];
				return doc;
			} catch {
				console.error('Failed to access the first doc element');
				return;
			}
		}
	}

	/** Update the dish in the provided planEntry */
	public static async updatePlanEntry(planEntry: PlanEntry) {
		const docRef = doc(collection(firestore, DISHPLANS_DOC), planEntry.id);
		await updateDoc(docRef, {
			dish: planEntry.dish
		})
			.then(() => console.log('Updated planEntry'))
			.catch((error) => console.error('Failed to update planEntry: ', error));
	}

	public static async updateDish(dish: Dish) {
		const docRef = doc(collection(firestore, DISHES_DOC), dish.id);
		await updateDoc(docRef, {
			name: dish.name,
			url: dish.url,
			customImage: dish?.customImage || '',
			ingredients: dish.ingredients
		})
			.then(() => console.log('Updated dish in DB'))
			.catch(() => console.error('Failed to update dish'));
	}
}

export class DishQueries {
	/** Build a query were you fetch all dishes created by the logged in user
	 *  @param user The logged in user
	 */
	public static dishes(user: User | null) {
		if (!user) {
			return;
		}
		const dishesRef = collection(firestore, DISHES_DOC) as CollectionReference<Dish>;
		return query<Dish>(dishesRef, where('user', '==', user?.uid));
	}

	/** A query that fetches a single dish, based on its name and the logged in user
	 * @param user The logged in user
	 * @param name the dishname */
	public static dish(user: User | null, name: string) {
		if (!user) {
			return;
		}
		const dishesRef = collection(firestore, DISHES_DOC) as CollectionReference<Dish>;
		return query<Dish>(dishesRef, where('user', '==', user?.uid), where('name', '==', name));
	}
}

/** Quiery builders for the dishplans */
export class PlanQueries {
	/** Get all plan entries for the provided date range for the user
	 *  @param dateRange The dates to fetch, assumed to be sorted and 2 entries
	 *  @param user The logged in user
	 */
	public static getPlans(user: User | null, dateRange: Date[]) {
		if (!user) {
			return;
		}
		const dishesRef = collection(firestore, DISHPLANS_DOC) as CollectionReference<PlanEntry>;
		return query<PlanEntry>(
			dishesRef,
			where('user', '==', user?.uid),
			where('date', '>=', dateRange[0]),
			where('date', '<=', dateRange[1])
		);
	}
}

/** Queries for shoppingList */
export class ListQueries {
	/** @param user the logged in user */
	public static get(user: User | null): Query<ShoppingList> {
		if (!user) {
			throw new ValueError("No user provided to query, can't get shoppinglist...");
		}
		const listRef = collection(firestore, LIST_DOC) as CollectionReference<ShoppingList>;
		return query<ShoppingList>(listRef, where('user', '==', user?.uid));
	}
}

/** database handler for shoppingList */
export class DBShoppingList {
	/**
	 * @param query The query to fetch
	 * @throws ValueError if query is invalid,
	 * @throws Error  database call fails or if more than one document is found
	 * @throws NoDocumentError if no document is found */
	public static async get(query: Query<ShoppingList>) {
		if (!query) {
			throw new ValueError('No query provided');
		}
		const snapshot = await getDocs(query);
		const docs: ShoppingList[] = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			const docEntry = { id: doc.id, ...data } as unknown as ShoppingList;
			docs.push(docEntry);
		});
		if (snapshot.docs.length == 0) {
			throw new NoDocumentError('No document found');
		}
		if (snapshot.docs.length == 1) return docs[0];
		throw new Error('More than one document found');
	}

	/** @param list the shopping list to update...
	 * @throws ValueError if list doesn't have an id
	 */
	public static async update(list: ShoppingList) {
		if (!list.id) {
			throw new ValueError("List doesn't have an id, can't update list");
		}
		const docRef = doc(collection(firestore, LIST_DOC), list.id);
		await updateDoc(docRef, {
			list: list.list
		})
			.then(() => console.log('Updated shoppinglist'))
			.catch((error) => console.error('Failed to update shoppinglist: ', error));
	}

	/** Create a new shopping list
	 *  @param user The logged in user
	 *  @throw ValueError if no user is provided
	 */
	public static async create(user: User | null) {
		if (!user) throw new ValueError('No user provided or logged in');
		const newList: ShoppingList = {
			list: [] as ShoppingListEntry[],
			user: user.uid
		};
		await setDoc(doc(collection(firestore, LIST_DOC)), newList);
	}
}
