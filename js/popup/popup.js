export function popupInit() {
	const urlSearchParam = new URLSearchParams(window.location.search);
	const tabType = urlSearchParam.get("mode");

	if (tabType === "popup") {
		insertPopupCSS();
	}
}

export function insertPopupCSS() {
	const style = document.createElement("style");
	document.head.appendChild(style);

	style.innerHTML = `
body {
	height: 500px;
	width: 500px;	
}
.links {
	justify-content: space-around;
	gap: 0;
	a {
		display: initial !important;
	}
	.help-menu{
		display: none !important;
	}
}

#settings{
	display: none;
}
.usertask-container {
	height: 500px;
	overflow-y: auto;
	padding: 1rem;
	margin: 0;
}
.usertask {
	width: 85vw;
	header {
		.task-info {
			max-width: 100%;
			.task-createdAt {
				display: none;
			}
			h3 {
				font-size: 0.8rem;
			}
			span {
				font-size: 0.8rem;
			}
			a {
				font-size: 0.8rem;
			}
		}
		.tick-ago{			
			.time-after{
				font-size: 0.8rem;
			}
		}
	}	
}

.tick,
.tick-divider {
	display: none;
}
.daystat-container {
	display: none;
}
.stats-container {
	display: none;
}
.focus-stat{
	display: none !important;
}

`;
}
