(function() {
	'use strict';

	var app = {};

	app.getConferenceData = function(key, label) {
		var url = 'http://127.0.0.1:8080/conference.json';
		// Fetch the latest data.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					//LASTUPDATE (new Date()).toJSON()
					var response = JSON.parse(request.response);
					console.log(response);
					console.log(response.LASTUPDATE);
					var sessions = response.SESSIONS;
					console.log(sessions);
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

						// console.log(oneSession);
						// console.log(oneSession.STARTTIME);
						// console.log(oneSession.ENDTIME);
						// console.log(oneSession.TITLE);
						// console.log(oneSession.SPEAKER);
						// console.log(oneSession.DESCRIPTION);
					}
					console.log(tableRef.rows.length);
					//app.updateConfSchedule(SESSIONS);
				}
			}
		};
		request.open('GET', url);
		request.send();
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