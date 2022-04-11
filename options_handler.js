function save() {
	saveLang();
	saveWindowsId();
	saveTabId();
	saveWebSite();
}

function getCurrentValue() {
	getLngSelected();
	getWindowsId();
	getTabId();
	getCurrentWebSite();
}
//-------------------------------------------------------------------------------------
//---------------------------CONSTANT INIT-----------------------------
//-------------------------------------------------------------------------------------
const WEB_SITE_INFO_ID = 'web_site_info';
const WEB_SITE_INPUT_ID = 'web_site';
const LANG_LIST_ID = 'lng_list';
const WINDOWS_ID = 'win_id';
const WINDOWS_DIV_ID = 'win_id_div';
const TAB_ID_DIV = 'tab_id_div';
const TAB_ID = 'tab_id';

//-------------------------------------------------------------------------------------
//---------------------------SAVE TO CHROME STORE FUNCTION-----------------------------
//-------------------------------------------------------------------------------------
function saveWebSite() {
	let web_site = document.getElementById(WEB_SITE_INPUT_ID).value;
	chrome.storage.sync.set(
		{ web_site },
		function () {
			resetUi(WEB_SITE_INFO_ID);
			createUiElement(`Web site ${web_site}`, WEB_SITE_INFO_ID, "span");
		})
}

function saveLang() {
	let langArray = ["En", "De", "Fr", "Es", "It", "Zh", "Ja", "Pt", "Ru"];
	let idplien_lng = [];
	for (let i = 0; i < langArray.length; i++) {
		if (document.getElementById(langArray[i]).checked) {
			idplien_lng.push(langArray[i])
		}
	}
	chrome.storage.sync.set(
		{ idplien_lng, },
		function () {
			resetUi(LANG_LIST_ID);
			for (let i = 0; i < idplien_lng.length; i++) {
				createUiElement(idplien_lng[i], LANG_LIST_ID, "span");
			}
		});
}

function saveWindowsId() {
	let win_id = document.getElementById(WINDOWS_ID).value
	chrome.storage.sync.set(
		{ win_id },
		function () {
			resetUi(WINDOWS_DIV_ID);
			createUiElement(`Current windows id ${win_id}`, WINDOWS_DIV_ID, "span");
		});
}

function saveTabId() {
	let tab_id = document.getElementById(TAB_ID).value
	chrome.storage.sync.set(
		{ tab_id },
		function () {
			resetUi(TAB_ID_DIV);
			createUiElement(`Current tab id ${tab_id}`, TAB_ID_DIV, "span");
		});
}

//-------------------------------------------------------------------------------------
//---------------------------ALL GET FUNCTION------------------------------------------
//-------------------------------------------------------------------------------------
function getLngSelected() {
	chrome.storage.sync.get({
		idplien_lng: '',
	}, function (checkedLng) {
		for (let i = 0; i < checkedLng['idplien_lng'].length; i++) {
			createUiElement(checkedLng['idplien_lng'][i], LANG_LIST_ID, "span");
			document.getElementById(checkedLng['idplien_lng'][i]).checked = true;
		}
	});

	chrome.windows.getAll(wins => {
		for (let i = 0; i < wins.length; i++) {
			if (wins[i].id === 1) {
				continue;
			}
			chrome.tabs.getAllInWindow(wins[i].id, tab => {
				createUiElement("Windows ID: " + wins[i].id, "windows_content", "span");
				for (let i = 0; i < tab.length; i++) {
					createUiElement(i + ". " + tab[i].url, "windows_content", "li");
				}
			})
		}
	})
}

function getWindowsId() {
	chrome.storage.sync.get({
		win_id: '',
	}, function (id) {
		createUiElement(`Current windows id ${id['win_id']}`, WINDOWS_DIV_ID, "span");
		document.getElementById(WINDOWS_ID).value = id['win_id'];
	});

}

function getTabId() {
	chrome.storage.sync.get({
		tab_id: '',
	}, function (id) {
		createUiElement(`Current tab id ${id['tab_id']}`, TAB_ID_DIV, "span");
		document.getElementById(TAB_ID).value = id['tab_id'];
	});
}

function getCurrentWebSite() {
	chrome.storage.sync.get({
		web_site: '',
	}, webSite => {
		createUiElement(`Web site ${webSite['web_site']}`, WEB_SITE_INFO_ID, "span");
		document.getElementById(WEB_SITE_INPUT_ID).value = webSite['web_site'];
	})
}

//-------------------------------------------------------------------------------------
//---------------------------MISC FUNCTION---------------------------------------------
//-------------------------------------------------------------------------------------
function createUiElement(textToShow, elementId, htmlElement) {
	let lng_list = document.getElementById(elementId);
	let tempElement = document.createElement(htmlElement);

	if (htmlElement === "span")
		tempElement.setAttribute("class", "badge bg-warning badgeMargin");

	tempElement.appendChild(document.createTextNode(textToShow));
	lng_list.appendChild(tempElement);
}

function resetUi(elementId) {
	let lng_list = document.getElementById(elementId);
	lng_list.innerHTML = "";
}

document.addEventListener('DOMContentLoaded', getCurrentValue);
document.getElementById('saveUserOption').addEventListener('click', save);
