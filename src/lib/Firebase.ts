import { initializeApp } from 'firebase/app';
import {
	CollectionReference,
	Query,
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
import type { ShoppingList, ShoppingListEntry } from './types';
import { getStorage } from 'firebase/storage';
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
