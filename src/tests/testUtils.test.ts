import { showDate, validateURL, validateName, NAME_EMPTY, NAME_ALREADY_IN_USE } from '$lib/utils';
import { it, expect } from 'vitest';

it('test showDate with date', () => {
	expect(showDate(new Date('05.21.2022'))).toBe('Sat 21');
	expect(showDate(new Date('04.20.2022'))).toBe('Wed 20');
});

it('validateURL false', () => {
	const url = 'nonsense';
	expect(validateURL(url)).toBe(false);
});

it('validateURL http', () => {
	const url = 'http://google.com';
	expect(validateURL(url)).toBe(true);
});

it('validateURL https', () => {
	const url = 'https://google.com';
	expect(validateURL(url)).toBe(true);
});

it('validateName empty', () => {
	expect(validateName('')).toBe(NAME_EMPTY);
});

it('validateName already in use', () => {
	expect(validateName('test', ['test', 'test2'])).toBe(NAME_ALREADY_IN_USE);
});

it('validateName valid', () => {
	expect(validateName('test')).toBe(0);
	expect(validateName('test2', ['test'])).toBe(0);
});
