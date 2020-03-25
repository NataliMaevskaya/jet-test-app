const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");
export const contacts = new webix.DataCollection(
	{
		url: "http://localhost:8096/api/v1/contacts/",
		save: "rest->http://localhost:8096/api/v1/contacts/",
		scheme: {
			$init: (obj) => {
				obj.value = `${obj.FirstName}  ${obj.LastName}`;
				obj.StartDate = webix.i18n.parseFormatDate(obj.StartDate);
				obj.Birthday = webix.i18n.parseFormatDate(obj.Birthday);
			},
			$save: (obj) => {
				obj.StartDate = dateToStr(obj.StartDate);
				obj.Birthday = dateToStr(obj.Birthday);
			}
		}
	}
);
