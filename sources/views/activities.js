import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";
import bodyActivityWindow from "./activityWindow";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const addActivityBtn = {
			css: "white_bgc",
			cols: [
				{},
				{
					view: "button",
					width: 200,
					type: "icon",
					icon: "mdi mdi-plus-box",
					label: _("Add activity"),
					click: () => this.showActivityEditOrAddWindow()
				}
			]
		};
		const tableColumns = [
			{
				id: "State",
				template: "{common.checkbox()}",
				uncheckValue: "Open",
				checkValue: "Close",
				header: "",
				width: 40
			},
			{
				id: "TypeID",
				header: [
					_("Activity type"), {
						content: "selectFilter"
					}
				],
				options: activityTypes,
				sort: "text",
				width: 150
			},
			{
				id: "DueDate",
				header: [
					_("Due date"),
					{
						content: "datepickerFilter",
						compare(value, filter) {
							value = webix.i18n.dateFormatStr(value);
							filter = webix.i18n.dateFormatStr(filter);
							return value === filter;
						}
					}
				],
				format: webix.i18n.longDateFormatStr,
				sort: "date",
				width: 160
			},
			{
				id: "Details",
				header: [
					_("Details"), {
						content: "textFilter"
					}
				],
				sort: "string",
				fillspace: true
			},
			{
				id: "ContactID",
				header: [
					_("Contact"), {
						content: "selectFilter"
					}
				],
				options: contacts,
				sort: "text",
				width: 200
			},
			{
				id: "editIcon",
				header: "",
				template: "<span class='mdi mdi-pencil-box-outline'></span>",
				width: 40
			},
			{
				id: "trashIcon",
				header: "",
				template: "<span class='webix_icon wxi-trash'></span>",
				width: 40
			}
		];
		const tabbar = {
			view: "tabbar",
			localId: "activitiesFilter",
			value: "all",
			options: [
				{
					id: "all",
					value: _("All")},
				{
					id: "overdue",
					value: _("Overdue")},
				{
					id: "completed",
					value: _("Completed")},
				{
					id: "today",
					value: _("Today")},
				{
					id: "tomorrow",
					value: _("Tomorrow")},
				{
					id: "week",
					value: _("This week")},
				{
					id: "month",
					value: _("This month")}
			],
			on: {
				onChange: () => {
					this.$$("activitiesTable").filterByAll();
				}
			}
		};
		const activitiesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scroll: "y",
			sort: "multi",
			columns: tableColumns,
			onClick: {
				"mdi-pencil-box-outline": (e, id) => this.showActivityEditOrAddWindow(id),
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: "Record will be deleted permanently! Continue?"
					}).then(() => {
						activities.remove(id);
					});
				}
			}
		};

		return {
			rows: [
				tabbar,
				addActivityBtn,
				activitiesTable
			]
		};
	}

	init() {
		this.activitiesTable = this.$$("activitiesTable");
		this.activityWindow = this.ui(bodyActivityWindow);
		this.activitiesTable.sync(activities);

		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activityTypes.waitData
		]).then(() => {
			activities.data.filter();
		});
		this.activitiesTable.registerFilter(
			this.$$("activitiesFilter"), {
				columnId: "State",
				compare: (state, filter, activity) => this.filterActivities(state, filter, activity)
			},
			{
				getValue: view => view.getValue(),
				setValue: (view, value) => view.setValue(value)
			}
		);
	}

	showActivityEditOrAddWindow(activityId) {
		this.activityWindow.showWindow(activityId);
	}

	filterActivities(state, filter, activity) {
		const currentDate = new Date();
		const todayDate = webix.Date.datePart(currentDate);
		const tomorrowDate = webix.Date.add(currentDate, 1, "day", true);
		const currentWeekStart = webix.Date.weekStart(currentDate);
		const currentWeekEnd = webix.Date.add(currentWeekStart, 7, "day", true);
		const currentMonthStart = webix.Date.monthStart(currentDate);
		const currentMonthEnd = webix.Date.add(currentMonthStart, 1, "month", true);

		switch (filter) {
			case "overdue":
				return state === "Open" && todayDate > activity.DueDate;
			case "completed":
				return state === "Close";
			case "today":
				return webix.Date.equal(webix.Date.datePart(activity.DueDate), todayDate);
			case "tomorrow":
				return webix.Date.equal(webix.Date.datePart(activity.DueDate), tomorrowDate);
			case "week":
				return activity.DueDate >= currentWeekStart && activity.DueDate <= currentWeekEnd;
			case "month":
				return activity.DueDate >= currentMonthStart && activity.DueDate <= currentMonthEnd;
			default:
				return true;
		}
	}
}
