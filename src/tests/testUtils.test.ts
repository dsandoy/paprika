import type { Dish } from '$lib/types';
import { showDate, DishValidator } from '$lib/utils';
import { it, expect, describe } from 'vitest';

it('test showDate with date', () => {
	expect(showDate(new Date('05.21.2022'))).toBe('Sat 21');
	expect(showDate(new Date('04.20.2022'))).toBe('Wed 20');
});

describe('Test the DishValidator', () => {
	const dishes: Dish[] = [
		{
			name: 'test',
			url: 'test',
			user: 'test',
			ingredients: ['test']
		},
		{
			name: 'test2',
			url: 'test2',
			user: 'test2',
			ingredients: ['test2', 'test1']
		}
	];
	const newDishValid: Dish = {
		name: 'test4',
		url: 'https://google.com',
		user: 'test4'
	};
	const dishMissingName: Dish = {
		name: '',
		url: 'https://google.com',
		user: 'test4',
		ingredients: ['test', 'test2']
	};
	const dishbadUrl: Dish = {
		name: 'test5',
		url: 'nonsense',
		user: 'test4'
	};
	it('validateURL false', () => {
		const url = 'nonsense';
		expect(DishValidator.validateURL(url)).toBe(DishValidator.INVALID_URL);
	});

	it('validateURL http', () => {
		const url = 'http://google.com';
		expect(DishValidator.validateURL(url)).toBe(DishValidator.VALID);
	});

	it('validateURL https', () => {
		const url = 'https://google.com';
		expect(DishValidator.validateURL(url)).toBe(DishValidator.VALID);
	});

	it('validateName empty', () => {
		expect(DishValidator.validateName('', dishes)).toBe(DishValidator.EMPTY);
	});

	it('validateName in use', () => {
		expect(DishValidator.validateName('test', dishes)).toBe(DishValidator.IN_USE);
	});

	it('validateName valid', () => {
		expect(DishValidator.validateName('test4', dishes)).toBe(DishValidator.VALID);
	});
	it('validateIngredients in use', () => {
		expect(DishValidator.validateIngredients('test', ['test', 'test2'])).toBe(DishValidator.IN_USE);
	});
	it('validateIngredients valid', () => {
		expect(DishValidator.validateIngredients('test2', ['test1'])).toBe(DishValidator.VALID);
		// empty is also valid..
		expect(DishValidator.validateIngredients('', ['test1', 'test2'])).toBe(DishValidator.VALID);
	});

	const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
	imageTypes.forEach((type) => {
		it(`validateImage valid ${type}`, () => {
			const mockFile = { type: type };
			expect(DishValidator.validateImage(mockFile as unknown as File)).toBe(DishValidator.VALID);
		});
	});
	it('validateImage invalid', () => {
		const blob = new Blob(['not an image'], { type: 'text/plain' });
		const file = new File([blob], 'not-an-image.txt');
		expect(DishValidator.validateImage(file)).toBe(DishValidator.INVALID_FILE_TYPE);
	});

	it('validateAll all valid', () => {
		expect(DishValidator.validateAll(newDishValid, dishes)).toBe(DishValidator.VALID);
	});

	it('validateAll name invalid', () => {
		expect(DishValidator.validateAll(dishMissingName, dishes)).toBe(DishValidator.EMPTY);
	});

	it('validateAll url invalid', () => {
		expect(DishValidator.validateAll(dishbadUrl, dishes)).toBe(DishValidator.INVALID_URL);
	});
});
