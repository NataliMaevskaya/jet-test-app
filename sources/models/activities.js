export const activities = new webix.DataCollection(
	{
		url: "http://localhost:8096/api/v1/activities/",
		save: "rest->http://localhost:8096/api/v1/activities/"
	}
);
