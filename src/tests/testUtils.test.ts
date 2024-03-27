import type { Dish } from '$lib/types';
import { DishValidator, DateHandler } from '$lib/utils';
import { Timestamp } from 'firebase/firestore';
import { it, expect, describe } from 'vitest';

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
		const file = { type: 'text/plain' };
		expect(DishValidator.validateImage(file as unknown as File)).toBe(
			DishValidator.INVALID_FILE_TYPE
		);
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

describe('Test DateHandle', () => {
	it('test showDate with date', () => {
		expect(DateHandler.showDate(Timestamp.fromDate(new Date('05.21.2022')))).toBe('Sat 21');
		expect(DateHandler.showDate(Timestamp.fromDate(new Date('04.20.2022')))).toBe('Wed 20');
		expect(DateHandler.showDate(undefined)).toBe('');
		expect(DateHandler.showDate(undefined, 'nothing')).toBe('nothing');
	});

	it('findNextDay', () => {
		expect(DateHandler.getNextDay(new Date('05.21.2022'))).toStrictEqual(new Date('05.22.2022'));
		expect(DateHandler.getNextDay(new Date('12.31.2022'))).toStrictEqual(new Date('01.01.2023'));
	});
	it('GetNextMonday friday', () => {
		expect(DateHandler.getNextMonday(new Date('03.22.2024'))).toStrictEqual(new Date('03.25.2024'));
	});
	it('GetNextMonday Sunday', () => {
		expect(DateHandler.getNextMonday(new Date('03.24.2024'))).toStrictEqual(new Date('03.25.2024'));
	});
	it('GetNextMonday monday', () => {
		expect(DateHandler.getNextMonday(new Date('03.25.2024'))).toStrictEqual(new Date('04.01.2024'));
	});

	it('Get daysndays away', () => {
		const date = new Date('03.22.2024');
		expect(DateHandler.getDayNDaysAway(date, 1)).toStrictEqual(new Date('03.23.2024'));
		expect(DateHandler.getDayNDaysAway(date, 0)).toStrictEqual(date);
		expect(DateHandler.getDayNDaysAway(date, -1)).toStrictEqual(new Date('03.21.2024'));
	});

	it('GetWeek', () => {
		// friday
		expect(DateHandler.getWeek(new Date('03.22.2024'))).toStrictEqual([
			new Date('03.18.2024'),
			new Date('03.24.2024')
		]);
		// sunday
		expect(DateHandler.getWeek(new Date('03.24.2024'))).toStrictEqual([
			new Date('03.18.2024'),
			new Date('03.24.2024')
		]);
		// monday
		expect(DateHandler.getWeek(new Date('03.25.2024'))).toStrictEqual([
			new Date('03.25.2024'),
			new Date('03.31.2024')
		]);
	});
	it('hasdaypassed', () => {
		expect(DateHandler.hasDayPassed(new Date('03.22.2024'))).toBe(true);
		expect(DateHandler.hasDayPassed(new Date('03.21.2124'))).toBe(false);
	});
	it('isTimestampToday', () => {
		expect(DateHandler.isTimestampToday(Timestamp.fromDate(new Date('03.21.2024')))).toBe('before');
		expect(DateHandler.isTimestampToday(Timestamp.fromDate(new Date('03.21.2124')))).toBe('after');
	});
});
