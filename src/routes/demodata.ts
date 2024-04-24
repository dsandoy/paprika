import type { Dish, PlanEntry } from '$lib/types';
import { DateHandler } from '$lib/utils';
import { Timestamp } from 'firebase/firestore';
import { writable } from 'svelte/store';

class DemoData {
	static dishes: Dish[] = [
		{
			id: '1',
			user: '',
			url: '',
			name: 'Pizza',
			customImage: 'demo/pizza.jpg',
			ingredients: [
				'7dL hvetemel',
				'3dL vann',
				'2SS olje',
				'tomatpure',
				'squash',
				'mais',
				'revet ost',
				'fetaost',
				'paprika'
			]
		},
		{
			id: '2',
			user: '',
			url: '',
			name: 'Fiskegrateng',
			customImage: 'demo/fiskegrateng.jpg',
			ingredients: ['findus fiskegrateng', '3 poteter', '2 gulrøtter', 'smeltet smør']
		},
		{
			user: '',
			id: '3',
			url: 'https://www.tine.no/oppskrifter/middag-og-hovedretter/kjott/hjemmelagde-kj%C3%B8ttkaker',
			name: 'Kjøttkaker i Brun Saus',
			customImage: 'demo/kjøttkaker.webp'
		},
		{
			user: '',
			id: '4',
			url: '',
			name: 'Pasta Carbonara',
			customImage: 'demo/pasta_carbonara.jpg',
			ingredients: ['tofu/kylling', 'spagetti', '2 egg']
		},
		{
			user: '',
			id: '5',
			url: 'https://vegetarentusiast.no/linsepannekaker/',
			name: 'Linsepannekaker',
			ingredients: [
				'1 boks linser',
				'spinat/rødbeter',
				'5dL mel',
				'5dL melk/plantemelk',
				'2 egg',
				'bakepulver',
				'sukker',
				'stekesmør'
			],
			customImage: 'demo/pannekaker.jpg'
		}
	];

	static dishPlans: PlanEntry[] = [
		{
			date: Timestamp.fromDate(DateHandler.getDayNDaysAway(new Date(), -1))
		},
		{
			date: Timestamp.now(),
			dish: '1'
		},
		{
			date: Timestamp.fromDate(DateHandler.getNextDay(new Date()))
		}
	];
}

export const demoDishes = writable<Dish[]>(DemoData.dishes);
export const demoPlans = writable<PlanEntry[]>(DemoData.dishPlans);
