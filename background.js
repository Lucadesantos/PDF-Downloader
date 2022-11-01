
var autoDownload = false;
var title = "";
var doc = "";
var found = false;
var newTab = false;
if (typeof browser === "undefined") {
    var browser = chrome;
}

chrome.storage.sync.get(['key'], function(result) {
	autoDownload = result.key;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log("new tab loaded " + tab.title);
	title = tab.title;
	if (title){
		title = title.replaceAll(" ", "_").replace(/[^a-zA-Z0-9éàèÉê()_]/g, "");
		console.log(title);
	}
 	found = false
 	sendInfo()
 	if (changeInfo.status == 'complete'){
 		newTab = true;
 	}
 }); 

function getHeaderFromHeaders(headers, headerName) {
	for (var i = 0; i < headers.length; ++i) {
		var header = headers[i];
		if (header.name.toLowerCase() === headerName) {
			return header;
		}
	}
}

function isPdfFile(details) {
	var header = getHeaderFromHeaders(details.responseHeaders, 'content-type');
	if (header) {
		var headerValue = header.value.toLowerCase().split(';', 1)[0].trim();
		return (headerValue === 'application/pdf' ||
				headerValue === 'application/octet-stream' &&
				details.url.toLowerCase().indexOf('.pdf') > 0);
	}
}
function download(url){
	browser.downloads.download({
		url: url,
		filename: title + ".pdf"
	});
}

function sendInfo(){
	shortName=title.slice(0,24) + ".pdf";
	chrome.runtime.sendMessage({pdfFound: found, name:shortName});
}

chrome.webRequest.onHeadersReceived.addListener(
	function callback(details) {
		if (isPdfFile(details)) {
			console.log('PDF file detected: ' + details.url);
			doc = details.url;
			found = true;
			sendInfo();
			if (autoDownload==true && newTab==true){
				download(doc);
				newTab = false;
			}	
		}
	},
	{urls: ['<all_urls>'], types: ["xmlhttprequest", "image", "media"]},
	['responseHeaders']
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
    	if (request.msg == "download"){
    		console.log("download");
    		download(doc);
		}
	});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
    	console.log(request.msg);
    	if (request.msg=="getStatus"){
			sendInfo();
    	}
    	if (request.msg == "checked"){
    		autoDownload = true
    	}
    	if (request.msg == "unchecked"){
    		autoDownload = false
    	}
    }
)