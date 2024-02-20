export function showDate(date: Date | null) {
	if (date === null)
	{
		return "";
	}
	const dateStr = date.toDateString();
	// split out weekday and year:
	const dateArr = dateStr.split(" ");
	return dateArr[0]+ ' ' + dateArr[2];
}
