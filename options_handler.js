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
//---------------------------SAVE TO CHROME STORE FUNCTION-----------------------------
//-------------------------------------------------------------------------------------
function saveWebSite() {
	let web_site = document.getElementById('web_site').value;
	chrome.storage.sync.set(
		{ web_site },
		function () {
			resetUi("web_site_info");
			createUiElement(`Web site ${web_site}`, "web_site_info", "span");
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
			resetUi("lng_list");
			for (let i = 0; i < idplien_lng.length; i++) {
				createUiElement(idplien_lng[i], "lng_list", "span");
			}
		});
}

function saveWindowsId() {
	let win_id = document.getElementById('win_id').value
	chrome.storage.sync.set(
		{ win_id },
		function () {
			resetUi("win_id_div");
			createUiElement(`Current windows id ${win_id}`, "win_id_div", "span");
		});
}

function saveTabId() {
	let tab_id = document.getElementById('tab_id').value
	chrome.storage.sync.set(
		{ tab_id },
		function () {
			resetUi("tab_id_div");
			createUiElement(`Current tab id ${tab_id}`, "tab_id_div", "span");
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
			createUiElement(checkedLng['idplien_lng'][i], "lng_list", "span");
			document.getElementById(checkedLng['idplien_lng'][i]).checked = true;
		}
	});

	chrome.windows.getAll(wins => {
		for (let i = 0; i < wins.length; i++) {
			if (wins[i].id === 1) {
				continue;
			}
			chrome.tabs.getAllInWindow(wins[i].id, tab => {
				createUiElement("Windows ID: " + wins[i].id, "tabId", "span");
				for (let i = 0; i < tab.length; i++) {
					createUiElement(i + ". " + tab[i].url, "url_list", "li");
				}
			})
		}
	})
}

function getWindowsId() {
	chrome.storage.sync.get({
		win_id: '',
	}, function (id) {
		createUiElement(`Current windows id ${id['win_id']}`, "win_id_div", "span");
		document.getElementById("win_id").value = id['win_id'];
	});

}

function getTabId() {
	chrome.storage.sync.get({
		tab_id: '',
	}, function (id) {
		createUiElement(`Current tab id ${id['tab_id']}`, "tab_id_div", "span");
		document.getElementById("tab_id").value = id['tab_id'];
	});
}

function getCurrentWebSite() {
	chrome.storage.sync.get({
		web_site: '',
	}, webSite => {
		createUiElement(`Web site ${webSite['web_site']}`, "web_site_info", "span");
		document.getElementById("web_site").value = webSite['web_site'];
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
