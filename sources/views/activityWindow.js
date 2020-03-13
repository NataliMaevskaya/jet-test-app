import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class ActivityWindowView extends JetView {
	config() {
		return {
			view: "window",
			localId: "activityWindow",
			width: 1000,
			height: 500,
			position: "center",
			head: {
				localId: "headActivityWindow",
				template: "#selectedAction# activity"
			},
			body: {
				view: "form",
				localId: "bodyActivityWindow",
				modal: true,
				elements: [
					{
						view: "textarea",
						label: "Details",
						name: "Details",
						width: 500,
						height: 200,
						invalidMessage: "Enter details"
					},
					{
						view: "select",
						label: "Type",
						name: "TypeID",
						required: true,
						options: activityTypes,
						invalidMessage: "Select type of activity"
					},
					{
						view: "select",
						label: "Contact",
						name: "ContactID",
						required: true,
						options: contacts,
						invalidMessage: "Select type of activity"
					},
					{
						cols: [
							{
								view: "datepicker",
								label: "Date",
								name: "DueDate",
								format: webix.i18n.longDateFormatStr,
								invalidMessage: "Select date"
							},
							{
								view: "datepicker",
								label: "Time",
								name: "Time",
								type: "time",
								format: webix.i18n.timeFormat,
								invalidMessage: "Select time"
							}
						]
					},
					{
						view: "checkbox",
						id: "State",
						label: "Completed",
						uncheckValue: "Open",
						checkValue: "Close"
					},
					{
						cols: [
							{},
							{
								view: "button",
								localId: "addSaveButton",
								click: () => this.addSaveItem()
							},
							{
								view: "button",
								label: "Cancel",
								click: () => this.hideWindow()
							}
						]
					}
				],
				rules: {
					$all: webix.rules.isNotEmpty
				}
			}
		};
	}

	init() {
		this.bodyActivityWindow = this.$$("bodyActivityWindow");
	}

	showWindow(id) {
		this.head = this.$$("headActivityWindow");
		this.addSaveButton = this.$$("addSaveButton");

		const selectedAction = id ? "Edit" : "Add";
		this.head.setValues({selectedAction});

		const addOrSave = id ? "Save" : "Add";
		this.addSaveButton.setValue(addOrSave);

		if (id && activities.exists(id)) {
			const item = activities.getItem(id);

			this.bodyActivityWindow.setValues(item);
		}
		this.getRoot().show();
	}

	hideWindow() {
		this.bodyActivityWindow.clear();
		this.bodyActivityWindow.clearValidation();

		this.getRoot().hide();
	}

	addSaveItem() {
		activities.waitSave(() => {
			if (this.bodyActivityWindow.validate()) {
				const values = this.bodyActivityWindow.getValues();
				if (values && values.id) {
					activities.updateItem(values.id, values);
				}
				else {
					activities.add(values, 0);
				}
				this.hideWindow();
			}
		});
	}
}
