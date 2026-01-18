var Slop = new Map<String, Boolean>([
	["chatgpt.com", true],
	["chat.deepseek.com", true],
	["gemini.google.com", true],
	["copilot.microsoft.com", true],
	["www.perplexity.ai", true],
	["claude.ai", true],
	["grok.com", true],
]);

//var caughtSlipping = 0;

async function main() {
	const currentTab = await browser.tabs.query({
		active: true,
		currentWindow: true,
	});
	if (currentTab.length < 1) {
		return;
	}

	const url = currentTab[0].url;
	const splits = url.split("/");
	const baseUrl = splits[2];

	if (Slop.get(baseUrl) == true) {
		/*
		await browser.action.setBadgeText({
			text: (caughtSlipping++).toString(),
		});
		*/
		await browser.tabs.remove(currentTab[0].id);
	}
}

browser.tabs.onUpdated.addListener(async () => {
	main();
});
