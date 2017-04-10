(function() {
	'use strict';

	var app = {};

	app.getConferenceData = function(key, label) {
		var url = 'http://127.0.0.1:8080/conference.json';
		if ('caches' in window) {
			caches.match(url).then(function(response) {
				if (response) {
					response.json().then(function updateFromCache(json) {
						console.log('from cache');
						app.updateConfSchedule(json);
					});
				}
			});
		}
		// Fetch the latest data.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					console.log('from request');
					console.log(request);
					app.updateConfSchedule(request.response);
				}
			}
		};
		request.open('GET', url);
		request.send();
	};

	app.updateConfSchedule = function(data) {
		console.log('update conf schedule');
		var sessions = data.SESSIONS;
		for (var session in sessions) {
			var oneSession = sessions[session];
			var tableRef = document.getElementById('schedule').getElementsByTagName('tbody')[0];
			var newRow = tableRef.insertRow(0);
			var newCell = newRow.insertCell(0);
			newCell.appendChild(document.createTextNode(oneSession.TITLE));
			newCell = newRow.insertCell(1);
			newCell.appendChild(document.createTextNode(oneSession.SPEAKER));
			newCell = newRow.insertCell(2);
			newCell.appendChild(document.createTextNode(oneSession.STARTTIME));
			newCell = newRow.insertCell(3);
			newCell.appendChild(document.createTextNode(oneSession.ENDTIME));
			tableRef.insertRow(tableRef.rows.length);
		}
	};

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./service-worker.js')
			.then(function() {
				console.log('Service Worker Registered');
			});
	} else {
		console.log('Service Worker Not Supported');
	}

	app.getConferenceData();
})();