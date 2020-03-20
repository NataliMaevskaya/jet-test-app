import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";

export default class ActivityWindowView extends JetView {
	config() {
		return {
			view: "window",
			localId: "activityWindow",
			height: 500,
			position: "center",
			modal: true,
			move: true,
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
						id: "contactId",
						value: "",
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
								name: "DueTime",
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
		this.contactId = this.$$("contactId");
	}

	showWindow(activityId, contactId) {
		this.head = this.$$("headActivityWindow");
		this.addSaveButton = this.$$("addSaveButton");

		const selectedAction = activityId ? "Edit" : "Add";
		this.head.setValues({selectedAction});

		const addOrSave = activityId ? "Save" : "Add";
		this.addSaveButton.setValue(addOrSave);

		if (activityId && activities.exists(activityId)) {
			const item = activities.getItem(activityId);
			item.DueTime = item.DueDate;
			this.bodyActivityWindow.setValues(item);
		}
		if (contactId && contacts.exists(contactId)) {
			this.contactId.setValue(contactId);
			this.contactId.disable();
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
				values.DueDate.setHours(values.DueTime.getHours(), values.DueTime.getMinutes());

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
