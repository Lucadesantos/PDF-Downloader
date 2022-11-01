document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get(['key'], function(result) {
  		document.getElementById('togglePopup').checked = result.key;
  		if (result.key){
  			chrome.runtime.sendMessage({ msg: "checked" });
  		} else {
  			chrome.runtime.sendMessage({ msg: "unchecked" });
  		}
	});	

	chrome.runtime.sendMessage({msg: "getStatus"})


	var checkPageButton = document.getElementById('button');
		checkPageButton.addEventListener('click', function() {
			chrome.runtime.sendMessage({ msg: "download" });

		}, false);
	document.getElementById('togglePopup').addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
			chrome.runtime.sendMessage({ msg: "checked" });
			checked = true;
		} else {
			chrome.runtime.sendMessage({ msg: "unchecked" });
			checked = false;
		}
		chrome.storage.sync.set({key: checked}, function() {
			console.log('Value is set to ' + checked);
		});
	})
}, false);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
    	var pdfFound = request.pdfFound
    	var name = request.name
    	console.log("PDF found " + pdfFound)
    	if (pdfFound){
      		document.getElementById('button').style.display = '';
      		document.getElementById('text1').style.display = 'none';
      		document.getElementById('text2').style.display = '';
      		document.getElementById('text2').textContent = name;
    	} else {
    		document.getElementById('button').style.display = 'none';
      		document.getElementById('text1').style.display = '';
      		document.getElementById('text1').textContent = "No PDF found";
      		document.getElementById('text2').style.display = 'none';

    	}
   	}
)