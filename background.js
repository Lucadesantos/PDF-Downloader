
var autoDownload = false;

if (typeof browser === "undefined") {
    var browser = chrome;
}
var title;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	title = tab.title.replaceAll("/", "-").replaceAll(" ", "_").replaceAll(".","").replaceAll(",","");
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

chrome.webRequest.onHeadersReceived.addListener(
	function callback(details) {
		if (isPdfFile(details)) {
			console.log('PDF file detected: ' + details.url);
			var res = confirm("A PDF has been found, download it?");
			if (res==true){
				download(details.url);
			}
			
			
		
		}
	},
	{urls: ['<all_urls>'], types: ["xmlhttprequest", "image", "media"]},
	['responseHeaders']
);
