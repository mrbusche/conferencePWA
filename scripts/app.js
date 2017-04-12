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
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
				var tableHeaderRef = document.getElementById('schedule' + dayCount).getElementsByTagName('thead')[0];
				var headerName = document.createElement("h3");
				var textDate = months[sessionDate.getMonth()] + ' ' + sessionDate.getDate();
				var headerContent = document.createTextNode(days[dayOfSession] + ', ' + textDate);
				headerName.appendChild(headerContent);
				var tableHeaderName = document.getElementsByTagName('body').parentNode;
				tableHeaderRef.insertBefore(headerName, tableHeaderName);
				var newHeaderRow = tableHeaderRef.insertRow(0);
				newHeaderCell = newHeaderRow.insertCell(0);
				newHeaderCell.appendChild(document.createTextNode('Time'));
				var newHeaderCell = newHeaderRow.insertCell(1);
				newHeaderCell.appendChild(document.createTextNode('Title'));
				newHeaderCell = newHeaderRow.insertCell(2);
				newHeaderCell.appendChild(document.createTextNode('Speaker'));
				newHeaderCell = newHeaderRow.insertCell(3);
				newHeaderCell.appendChild(document.createTextNode('Room'));
				tableHeaderRef.insertRow(tableHeaderRef.rows.length);
			}
			var tableRef = document.getElementById('schedule' + dayCount).getElementsByTagName('tbody')[0];
			var newRow = tableRef.insertRow(0);
			newCell = newRow.insertCell(0);
			newCell.appendChild(document.createTextNode(sessionTime));
			var newCell = newRow.insertCell(1);
			newCell.appendChild(document.createTextNode(oneSession.TITLE));
			newCell = newRow.insertCell(2);
			newCell.appendChild(document.createTextNode(oneSession.SPEAKER));
			newCell = newRow.insertCell(3);
			newCell.appendChild(document.createTextNode(oneSession.ROOM));
			tableRef.insertRow(tableRef.rows.length);
		}
		console.log('total time :: ' & new Date() - start);
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