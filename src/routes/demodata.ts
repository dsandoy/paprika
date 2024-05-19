import type { DemoDish, DemoPlan } from '$lib/types';
import { DateHandler } from '$lib/utils';
import { writable } from 'svelte/store';

export class DemoData {
	static dishes: DemoDish[] = [
		{
			id: 1,
			url: '',
			name: 'Pizza',
			image: 'demo/pizza.jpg',
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
			id: 2,
			url: '',
			name: 'Fiskegrateng',
			image: 'demo/fiskegrateng.jpg',
			ingredients: ['findus fiskegrateng', '3 poteter', '2 gulrøtter', 'smeltet smør']
		},
		{
			id: 3,
			url: 'https://www.tine.no/oppskrifter/middag-og-hovedretter/kjott/hjemmelagde-kj%C3%B8ttkaker',
			name: 'Kjøttkaker i Brun Saus',
			image: 'demo/kjøttkaker.webp'
		},
		{
			id: 4,
			url: '',
			name: 'Pasta Carbonara',
			image: 'demo/pasta_carbonara.jpg',
			ingredients: ['tofu/kylling', 'spagetti', '2 egg']
		},
		{
			id: 5,
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
			image: 'demo/pannekaker.jpg'
		}
	];

	static dishPlans: DemoPlan[] = [
		{
			date: DateHandler.getDayNDaysAway(new Date(), -1)
		},
		{
			date: new Date(),
			dish: DemoData.dishes[0]
		},
		{
			date: DateHandler.getNextDay(new Date())
		}
	];
}

export const demoDishes = writable<DemoDish[]>(DemoData.dishes);
export const demoPlans = writable<DemoPlan[]>(DemoData.dishPlans);
// export const demoShopping = writable<ShoppingList>(DemoData.shoppingList);
