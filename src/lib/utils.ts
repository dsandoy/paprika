export function showDate(date: Date) {
	const dateStr = date.toDateString();
	// split out weekday and year:
	const weekday,
		month,
		day,
		year = dateStr.split(' ');
	return month + ' ' + day;
}
