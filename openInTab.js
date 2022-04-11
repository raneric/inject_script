(async () => {
	let allLanguage = await getAllLanguage();
	let inputId = buildInputId(getProductId(), allLanguage);
	let allUrl = getAllUrl(inputId);
	updateStore(allUrl);
})()

function updateStore(productUrl) {
	chrome.storage.sync.set({ productUrl });
}

function getAllUrl(inputId) {
	let allUrl = [];
	for (let i = 0; i < inputId.length; i++) {
		let inputUrl = document.getElementById(inputId[i]).value;
		allUrl.push(inputUrl);
	}
	return allUrl;
}

/**
 * Get avalaible language from chrome store
 */
async function getAllLanguage() {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get(
			{ idplien_lng: '', }, resolver)
	}).then(idplien_lng => {
		return idplien_lng['idplien_lng'];
	})
}

/**
 * Get product ID from DOM
 */
function getProductId() {
	let productIdTh = document.getElementsByClassName('productText')[0];
	productIdTh = productIdTh.childNodes[1].childNodes[0].childNodes[1].innerHTML
	let productId = productIdTh.substr(productIdTh.indexOf('= ') + 2);
	productId = productId.replace(/\n/g, "");
	productId = productId.replace(/\s/g, "");
	return productId;
}

function buildInputId(productId, allLanguage) {
	let inputId = [];

	for (let i = 0; i < allLanguage.length; i++) {
		inputId.push(`idp_${productId}_${allLanguage[i]}`);
	}
	return inputId;
}