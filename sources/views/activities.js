import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";
import bodyActivityWindow from "./activityWindow";

export default class ActivitiesView extends JetView {
	config() {
		const addActivityBtn = {
			css: "white_bgc",
			cols: [
				{},
				{
					view: "button",
					width: 150,
					type: "icon",
					icon: "mdi mdi-plus-box",
					label: "Add activity",
					click: () => this.showActivityAddWindow()
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
					"Activity Type", {
						content: "selectFilter"
					}
				],
				options: activityTypes,
				sort: "text",
				width: 150
			},
			{
				id: "DueDate",
				header: ["Due date", {
					content: "datepickerFilter",
					compare(value, filter) {
						value = webix.i18n.dateFormatStr(value);
						filter = webix.i18n.dateFormatStr(filter);
						return value === filter;
					}
				}],
				format: webix.i18n.longDateFormatStr,
				sort: "date",
				width: 160
			},
			{
				id: "Details",
				header: [
					"Details", {
						content: "textFilter"
					}
				],
				sort: "string",
				fillspace: true
			},
			{
				id: "ContactID",
				header: [
					"Contact", {
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
		const activitiesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scroll: "y",
			sort: "multi",
			columns: tableColumns,
			onClick: {
				"mdi-pencil-box-outline": (e, id) => this.showActivityEditWindow(id),
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
				addActivityBtn,
				activitiesTable
			]
		};
	}

	init() {
		this.activitiesTable = this.$$("activitiesTable");
		this.activityWindow = this.ui(bodyActivityWindow);
		this.activitiesTable.sync(activities);
	}

	showActivityEditWindow(id) {
		if (id) {
			this.activityWindow.showWindow(id);
		}
	}

	showActivityAddWindow() {
		this.activityWindow.showWindow(false);
	}
}
