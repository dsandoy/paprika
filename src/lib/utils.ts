/** Display the date in the date number and month only. Ex: 12. feb,
 * if no datevalue, return emptyMessage, else return empty string
 */
export function showDate(date: Date | null, emptyMessage = '') {
	if (date === null) {
		if (emptyMessage) {
			return emptyMessage;
		}
		return '';
	}
	const dateStr = date.toDateString();
	// remove weekday and year:
	const dateArr = dateStr.split(' ');
	return dateArr[0] + ' ' + dateArr[2];
}
