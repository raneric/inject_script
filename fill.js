(async () => {
	refreshStorage()
	let productId = getProductId();
	let allLanguage = await getAllLanguage();
	let inputId = buildInputId(allLanguage, productId);
	refreshStorage();
	let allUrl = await getAllWebSite()
	fillIdp(inputId, allUrl);
	//openIdpText(productId);
})();

//-------------------------------------------------------------------------------------
//---------------------------ALL GET FUNCTION------------------------------------------
//-------------------------------------------------------------------------------------
/**
 * Get product ID from DOM
 */
function getProductId() {
	let productIdTh = document.getElementsByClassName('productText')[0];
	productIdTh = productIdTh.childNodes[1].childNodes[0].childNodes[1].innerHTML
	let productId = productIdTh.substr(productIdTh.indexOf('= ') + 2);
	productId = productId.replace(/\n/g,"");
	productId = productId.replace(/\s/g,"");
	return productId;
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
*
*/
async function getPductIdFromS(){
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get(
			{ idplien_lng: '', }, resolver)
	}).then(idplien_lng => {
		return idplien_lng['idplien_lng'];
	})
}

/**
 * Get avalaible language from chrome store
 */
async function getFromCmState() {
	return new Promise((resolver, reject) => {
		chrome.storage.sync.get(
			{ from_cm: '', }, resolver)
	}).then(from_cm => {
		return from_cm['from_cm'];
	})
}

async function getAllWebSite() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(
			{ idp_lien: '' }, resolve)
	}).then(idp_lien => {
		return idp_lien['idp_lien'];
	})
}

//-------------------------------------------------------------------------------------
//---------------------------UI INTERACTION FUNCTION-----------------------------------
//-------------------------------------------------------------------------------------
/**
 * 
 * @param {Array} inpuId : array of IDPLien input ID
 * @param {Array} productUrl : array Customer web site URL
 */
async function fillIdp(inpuId, productUrl) {
	let tempEvent = new Event('change');
	//let tempParam= ['?lang=en','?lang=fr','?lang=es','?lang=it','?lang=pt'];
	for (let i = 0; i < inpuId.length; i++) {
		let urlTest = await checkUrl(productUrl[i]);
		if (urlTest) {
			let idp = document.getElementById(inpuId[i]);
			idp.value = decodeURI(productUrl[i]);
			idp.dispatchEvent(tempEvent);
		} else {
			alert(`Url "${productUrl[i]}" doesn't match`);
		}

	}
}

/**
 * 
 * @param {String} productId 
 */
function openIdpText(productId) {
	let idpTestId = `img_txt_${productId}_En`;
	let tempEvent = new Event('click');
	let idpText = document.getElementById(idpTestId);
	idpText.dispatchEvent(tempEvent);
}

//-------------------------------------------------------------------------------------
//---------------------------MISC FUNCTION---------------------------------------------
//-------------------------------------------------------------------------------------
/**
 * Refresh chrome storage before interaction
 */
function refreshStorage() {
	chrome.storage.sync.get(
		{ idplien_lng: ''},
		() => { })
}

/**
 * Check tab url if it match customer web site
 * @param {String} url 
 */
async function checkUrl(url) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get({ web_site: '' }, resolve)
	}).then(res => {
		let regex = new RegExp('(' + res['web_site'] + ')')
		return (regex.test(url)) ? true : false;
	});

}

/**
 *
 * @param {Array lngArray : array of available language
	* @param {String} productId
	*/
function buildInputId(lngArray, productId) {
	let inputId = [];
	lngArray.forEach(lng => {
		let tempId = `idp_${productId}_${lng}`;
		inputId.push(tempId);
	})
	return inputId;
}
