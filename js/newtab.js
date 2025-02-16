const local = chrome.storage.local;
const date = new DateUtil(new Date());
let timers = [];
let yearChanger = 0;

function popupInit() {
	const urlSearchParam = new URLSearchParams(window.location.search);
	const tabType = urlSearchParam.get("mode");

	if (tabType === "popup") {
		insertPopupCSS();
	}
}

chrome.storage.onChanged.addListener(async () => {
	const userData = await local.get(null);
	console.log(userData.tasks);

	timers = [];
	generateTasks(userData);
	generateStats(userData, date.currentYear);
});

async function init() {
	const userData = await local.get(null);
	generateTasks(userData);
	generateStats(userData, date.currentYear);

	popupInit();
	initListeners();
	initDisplay();
}

init();
