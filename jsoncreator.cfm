<cfscript>
	today = getDate();
	conference = {
		lastUpdate: '',
		sessions: [
			{
				speaker: 'Matt Busche',
				title: 'PWAs for Life',
				startTime: createDateTime(2017, 8, 6, 12, 0, 0),
				endTime: createDateTime(2017, 8, 6, 12, 50, 0)
			},
			{
				speaker: 'Taryn Busche',
				title: 'All the Things',
				startTime: createDateTime(2017, 8, 6, 13, 0, 0),
				endTime: createDateTime(2017, 8, 6, 13, 50, 0)
			},
		]
	}
	writeDump(serializeJSON(today));
</cfscript>