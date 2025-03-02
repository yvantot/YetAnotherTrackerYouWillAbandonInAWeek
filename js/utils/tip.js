import { getRandom } from "./utils.js";

const elTips = document.getElementById("tips");

export function tipsInit() {
	setInterval(() => {
		elTips.textContent = getTip();
	}, 20000);
	elTips.textContent = getTip();
}

function getTip() {
	// prettier-ignore
	const quoteAndTips = {
		manual: [
			"Tip: YATYA is independent, 100% offline, free, open-source and made by a solo-developer!",
			"Tip: You can put links in description, e.g https://www.google.com/ - simply copy and paste it from your browser!",
			"Tip: Double-click task's title or description to edit.",
			"Tip: You can set a goal for a task by clicking the flag icon in the task toolbar.",			
			"Tip: You can change the order of a task by clicking the arrow icon in the task toolbar.",
			"Tip: You can specify a task in stat-bar by clicking the bar-graph icon in the task toolbar.",			
			"Tip: Click the ➕ button to add a task to track.",						
			"Tip: Never lose your data again! Export/import your data in the settings.",
			"Tip: You can toggle the visibility of the stat-bar in the settings.",
			"Tip: You can change to dark/light mode in the settings.",			
			"Tip: You can click the 'green' boxes in year-stat-bar to analyse it in day-stat-bar.",
			"Tip: You can link local files such as PDFs in description, however, you can only access it by right-clicking, open it as a tab.\nThis is a browser-imposed security."
		],
		quotes: [
			"'We are what we repeatedly do. Excellence, then, is not an act, but a habit.' - Aristotle",
    		"'It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.' - Seneca",
    		"'Well begun is half done.' - Aristotle",
    		"'He who has a why to live can bear almost any how.' - Friedrich Nietzsche",
    		"'Waste no more time arguing what a good man should be. Be one.' - Marcus Aurelius",
    		"'Perseverance, secret of all triumphs.' - Victor Hugo",
    		"'Do what you can, with what you have, where you are.' - Theodore Roosevelt",
    		"'Act as if what you do makes a difference. It does.' - William James",
    		"'The chains of habit are too weak to be felt until they are too strong to be broken.' - Samuel Johnson",
    		"'The journey of a thousand miles begins with a single step.' - Lao Tzu",	

			"'You do not rise to the level of your goals. You fall to the level of your systems'. - James Clear",
			"'Every action you take is a vote for the type of person you wish to become.' - James Clear",
			"'All big things come from small beginnings. The seed of every habit is a single, tiny decision.' - James Clear",
			"'Success is the product of daily habits—not once-in-a-lifetime transformations.' - James Clear",
			"'Never miss twice. If you miss one day, get back on track as quickly as possible.' - James Clear",
			"'The most practical way to change who you are is to change what you do.' - James Clear",
			"'Habits are the compound interest of self-improvement.' - James Clear",
			"'The task of breaking a bad habit is like uprooting a strong oak within us.' - James Clear",
			"'When you choose the wrong habit, time becomes your enemy. When you choose the right habit, time becomes your ally.' - James Clear",
			"'You should be far more concerned with your current trajectory than with your current results.' - James Clear",	
			
			"'Even a broken clock is right eventually if you keep showing up.' - MDickie",
			
			"'One day or day one?'",
			"'No progress is still data. Use it.'",			
		],
		suggestions: [
			"Idea: You can track *anything*—good, bad, weird, or just for fun!",
			"Idea: Track workouts - Did you move today? Even stretching counts!",
			"Idea: Track website visit - you might want to stop visiting 'that' website!",
			"Idea: Track your habits!",
			"Idea: Follow the PACT method, instead of 'Learn programming in 2 weeks', use 'Create 20 simple programs in C over the next 2 weeks'!",
			"Idea: Track no-sugar days - A mini health challenge to try!",
			"Idea: Track meditation time - Even a minute counts!",
			"Idea: Track money spent - Because every dollar has a story!",			
		]
	};

	const types = Object.keys(quoteAndTips);
	const randType = types[getRandom(0, types.length - 1)];
	return quoteAndTips[randType][getRandom(0, quoteAndTips[randType].length - 1)];
}
