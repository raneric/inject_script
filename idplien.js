chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case "fill_link":
			fillData();
			break;
		case "open_link":
			openLink();
			break;

	}
});


//-------------------------- CONTEXT MENU INIT ------------------------------------------------
/*chrome.contextMenus.create({"title": "Add url", 
							"contexts":["selection"],
							"onclick": data => {fillDataFromContextMenu(data.selectionText)}});	*/

chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (Object.keys(changes)[0] === 'productUrl') {
		refreshTab(changes.productUrl.newValue);
	}
});

async function refreshTab(allUrl) {
	let windowsId = await getWindowsId();
	chrome.tabs.getAllInWindow(windowsId, async tab => {
		let tabId = await getTabId();
		let tabkToSkip = [];
		for (let i = 0; i < allUrl.length; i++) {
			if (tabkToSkip.indexOf(i) !== -1) {
				tabId++;
				continue;
			}
			//continue if IDPLien is empty
			if (allUrl[i] === "") { //temp update
				tabId++;
				continue;
			}
			if (tab[tabId] === undefined) {
				chrome.tabs.create({
					url: allUrl[i],//temp update
					windowId: windowsId
				});
			} else {
				chrome.tabs.update(tab[tabId].id, { url: allUrl[i] }); //temp update
			}
			tabId++;
		}
	});
}

function fillDataFromContextMenu(data) {
	setPidFromContextMenu(data, true);
}

async function savePoductId(data) {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.set({ p_id: data, }, resolver)
	}).then(res => {
		fillData();
	})
}

async function setPidFromContextMenu(data, state) {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.set({ from_cm: state, }, resolver)
	}).then(res => {
		savePoductId(data);
	})
}

function openLink() {
	chrome.tabs.getSelected(null, (tab) => {
		chrome.tabs.executeScript(tab.id, { file: 'openInTab.js' });
	})
}

function injectScript() {
	chrome.tabs.getSelected(null, (tab) => {
		chrome.tabs.executeScript(tab.id, { file: 'fill.js' });
	})
}

async function fillData() {
	let url = [];
	let windowsId = await getWindowsId();
	let tabIndex = await getTabId();
	let ckeckedLng = await getAllCheckedLng();
	chrome.tabs.getAllInWindow(windowsId, tab => {
		let inc = tabIndex + ckeckedLng.length;
		for (let i = tabIndex; i < inc; i++) {
			url.push(tab[i].url);
		}
		saveUrlToStorage(url);
	})
}

async function getWindowsId() {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get({ win_id: '', }, resolver)
	}).then(win_id => {
		return parseInt(win_id['win_id']);
	})
}

async function getTabId() {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get({ tab_id: '' }, resolver)
	}).then(tab_id => {
		return parseInt(tab_id['tab_id']);
	})
}

async function getAllCheckedLng() {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get({ idplien_lng: '' }, resolver)
	}).then(idplien_lng => {
		return idplien_lng['idplien_lng'];
	})
}

function getLngSelected() {
	let lng;
	chrome.storage.sync.get({
		idplien_lng: '',
	}, checkedLng => {
		lng = checkedLng['idplien_lng']
	});
	console.log(lng);
	return lng;
}

function saveUrlToStorage(idp_lien) {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.set({ idp_lien, }, resolver)
	}).then(res => {
		injectScript();
	})
}
