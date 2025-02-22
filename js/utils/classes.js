export default class DateUtil {
	constructor(date) {
		this.date = date;
		this.currentYear = date.getFullYear();
		this.currentMonth = date.getMonth();
		this.currentDay = date.getDate();
	}
	getDaysOfMonths() {
		const days = [];
		for (let i = 1; i <= 12; i++) {
			days.push(new Date(this.date.getFullYear(), i, 0).getDate());
		}
		return days;
	}
	// For Month representation
	getMonth(date, isAbbrev = false, isNum = false) {
		if (date < 1 || date > 12) return;
		switch (date) {
			case 1:
				if (isAbbrev) return "Jan";
				if (isNum) return 1;
				return "January";
			case 2:
				if (isAbbrev) return "Feb";
				if (isNum) return 2;
				return "February";
			case 3:
				if (isAbbrev) return "Mar";
				if (isNum) return 3;
				return "March";
			case 4:
				if (isAbbrev) return "Apr";
				if (isNum) return 4;
				return "April";
			case 5:
				if (isNum) return 5;
				return "May";
			case 6:
				if (isNum) return 6;
				return "June";
			case 7:
				if (isNum) return 7;
				return "July";
			case 8:
				if (isAbbrev) return "Aug";
				if (isNum) return 8;
				return "August";
			case 9:
				if (isAbbrev) return "Sep";
				if (isNum) return 9;
				return "September";
			case 10:
				if (isAbbrev) return "Oct";
				if (isNum) return 10;
				return "October";
			case 11:
				if (isAbbrev) return "Nov";
				if (isNum) return 11;
				return "November";
			case 12:
				if (isAbbrev) return "Dec";
				if (isNum) return 12;
				return "December";
			default:
				throw new Error("Unexpected value");
		}
	}
}
