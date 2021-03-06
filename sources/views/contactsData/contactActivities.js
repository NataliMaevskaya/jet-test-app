import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
import bodyActivityWindow from "../activityWindow";

export default class ContactActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const addActivityBtn = {
			css: "white_bgc",
			cols: [
				{},
				{
					view: "button",
					autowidth: true,
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
				template: (obj) => {
					const activityTypeItem = activityTypes.getItem(obj.TypeID);
					return `<span class="mdi mdi-${activityTypeItem.Icon}"></span> ${activityTypeItem.Value} `;
				},
				options: activityTypes,
				sort: "text",
				width: 150,
				required: true
			},
			{
				id: "DueDate",
				header: [_("Due date"), {
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
					_("Details"), {
						content: "textFilter"
					}
				],
				sort: "string",
				fillspace: true
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
		const activitiesContactTable = {
			view: "datatable",
			localId: "activitiesContactTable",
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
				activitiesContactTable,
				addActivityBtn
			]
		};
	}

	init() {
		this.activitiesContactTable = this.$$("activitiesContactTable");
		this.activityWindow = this.ui(bodyActivityWindow);
		this.activitiesContactTable.sync(activities);
	}

	showActivityEditOrAddWindow(activityId) {
		const contactId = this.getParam("id", true);
		this.activityWindow.showWindow(activityId, contactId);
	}
}
