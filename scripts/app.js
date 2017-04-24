(function() {
	'use strict';

	var app = {
		isLoading: true,
		spinner: document.querySelector('.spinner')
	};

	app.getConferenceData = function(key, label) {
		var url = 'http://127.0.0.1:8080/conference.json';
		if ('caches' in window) {
			caches.match(url).then(function(response) {
				if (response) {
					response.json().then(function updateFromCache(json) {
						console.log('from cache');
						console.log(json.LASTUPDATE);
						document.getElementById('lastUpdate').innerHTML = json.LASTUPDATE;
						app.updateConfSchedule(json);
					});
				}
			});
		}
		// Fetch the latest data.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE && request.response) {
				var response = JSON.parse(request.response);
				//if the timestamps are the same, no need to update
				if (document.getElementById('lastUpdate').innerHTML !== response.LASTUPDATE) {
					app.updateConfSchedule(response);
				}
			}
		};
		request.open('GET', url);
		request.send();
	};

	app.updateConfSchedule = function(data) {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		console.log('update conf schedule');
		var sessions = data.SESSIONS;
		var start = new Date();
		var currentDayOfSession = '';
		var dayCount = 0;
		for (var session in sessions) {
			var oneSession = sessions[session];
			var sessionDate = new Date(oneSession.STARTTIME);
			var AMPM = sessionDate.getHours() >= 12 ? 'PM' : 'AM';
			var hours = sessionDate.getHours() > 12 ? sessionDate.getHours() - 12 : sessionDate.getHours();
			var sessionTime = hours + ':' + (sessionDate.getMinutes() < 10 ? '0' : '') + sessionDate.getMinutes() + AMPM;
			var dayOfSession = sessionDate.getDay();
			if (currentDayOfSession !== dayOfSession) {
				dayCount++;
				currentDayOfSession = dayOfSession;
				var textDate = months[sessionDate.getMonth()] + ' ' + sessionDate.getDate();
				var headerContent = document.createTextNode(days[dayOfSession] + ', ' + textDate);
				var headerName = document.createElement("h3");
				headerName.appendChild(headerContent);
				var tableRef = document.getElementById('schedule' + dayCount);
				tableRef.parentNode.insertBefore(headerName, tableRef);
				var tableHeaderRef = document.getElementById('schedule' + dayCount).getElementsByTagName('thead')[0];
				var newHeaderRow = tableHeaderRef.insertRow(0);
				var newHeaderCell = newHeaderRow.insertCell(0);
				newHeaderCell.appendChild(document.createTextNode('Time'));
				newHeaderCell = newHeaderRow.insertCell(1);
				newHeaderCell.appendChild(document.createTextNode('Title'));
				newHeaderCell = newHeaderRow.insertCell(2);
				newHeaderCell.appendChild(document.createTextNode('Speaker'));
				newHeaderCell = newHeaderRow.insertCell(3);
				newHeaderCell.appendChild(document.createTextNode('Room'));
				tableHeaderRef.insertRow(tableHeaderRef.rows.length);
			}
			var tableBodyRef = document.getElementById('schedule' + dayCount).getElementsByTagName('tbody')[0];
			var newRow = tableBodyRef.insertRow(0);
			newCell = newRow.insertCell(0);
			newCell.appendChild(document.createTextNode(sessionTime));
			var newCell = newRow.insertCell(1);
			newCell.appendChild(document.createTextNode(oneSession.TITLE));
			newCell = newRow.insertCell(2);
			newCell.appendChild(document.createTextNode(oneSession.SPEAKER));
			newCell = newRow.insertCell(3);
			newCell.appendChild(document.createTextNode(oneSession.ROOM));
			tableBodyRef.insertRow(tableBodyRef.rows.length);
		}
		console.log('total time :: ');
		console.log(new Date() - start);

		if (app.isLoading) {
			app.spinner.setAttribute('hidden', true);
			app.isLoading = false;
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