const calendar = document.querySelector(".calendar");

for (let day = 1; day <= 31; day++) {
	// Day number on the left
	let dayElement = document.createElement("div");
	dayElement.className = "day";
	dayElement.textContent = day;
	calendar.appendChild(dayElement);

	// 12 boxes for each month
	for (let month = 1; month <= 12; month++) {
		let box = document.createElement("div");
		box.className = "box";
		calendar.appendChild(box);
	}
}
