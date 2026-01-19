var Slop = new Map<String, Boolean>([
	["chatgpt.com", true],
	["chat.deepseek.com", true],
	["gemini.google.com", true],
	["copilot.microsoft.com", true],
	["www.perplexity.ai", true],
	["claude.ai", true],
	["grok.com", true],
]);

export async function LoadVar(key: string): Promise<any> {
	const local_storage = browser.storage.local;
	const result = await local_storage.get(key);
	return result[key];
}

async function storeVar(key: string, value: any) {
	const local_storage = browser.storage.local;
	local_storage.set({ [key]: value });
}

async function main() {
	let count: number = (await LoadVar("count")) ?? 0;
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
		await browser.tabs.remove(currentTab[0].id);
		count += 1;
		await browser.action.setBadgeText({
			text: count.toString(),
		});
		storeVar("count", count);
		return;
	}
}

browser.windows.onCreated.addListener(async () => {
	let count: number = (await LoadVar("count")) ?? 0;

	await browser.action.setBadgeText({
		text: count.toString(),
	});
});

if (
	!browser.tabs.onUpdated.hasListener(async () => {
		await main();
	})
) {
	browser.tabs.onUpdated.addListener(async () => {
		await main();
	});
}
