import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {contactsFiles} from "../../models/contactsFiles";

import contactActivities from "./contactActivities";
import contactFiles from "./contactFiles";

export default class ContactsTemplateView extends JetView {
	config() {
		const contactInfo = {
			paddindY: 1,
			localId: "contactsTemplate",
			paddingX: 100,
			margin: 20,
			template: obj => `<div class="header_contact">
									<h1>${obj.FirstName || " - "} ${obj.LastName || " - "}</h1>
								</div>
								<div class="info_contact">
									<div class="photo_contact">
										<img src="${obj.Photo || "sources/images/avatar_default.png"}"/>
										<p class="status_contact">${obj.Status || " - "}</p>
									</div>
									<div class="detailed_info_contact">
										<span class="mdi mdi-email mdi_details"> ${obj.Email || " - "}</span>
										<span class="mdi mdi-skype mdi_details"> ${obj.Skype || " - "}</span>
										<span class="mdi mdi-tag mdi_details"> ${obj.Job || " - "}</span>
										<span class="mdi mdi-briefcase mdi_details"> ${obj.Company || " - "}</span>
									</div>
									<div class="detailed_info_contact">
										<span class="mdi mdi-calendar-month mdi_details"> ${webix.i18n.longDateFormatStr(obj.Birthday) || " - "}</span>
										<span class="mdi mdi-map-marker mdi_details"> ${obj.Address || " - "}</span>
									</div>
								</div>`
		};

		const contactButtons = {
			padding: 20,
			css: "white_bgc",
			margin: 5,
			rows: [
				{
					cols: [
						{
							view: "button",
							label: "Delete",
							type: "icon",
							icon: "wxi-trash",
							width: 90,
							click: () => this.deleteContact()
						},
						{
							view: "button",
							label: "Edit",
							type: "icon",
							icon: "mdi mdi-pencil-box-outline",
							width: 90,
							click: () => this.editContact()
						}
					]
				},
				{}
			]
		};

		const segmentedActivitiesFiles = {
			view: "segmented",
			localId: "segmentedActivitiesFiles",
			value: "segmentedActivities",
			options: [
				{
					id: "segmentedActivities",
					value: "Activities"
				},
				{
					id: "segmentedFiles",
					value: "Files"
				}
			],
			on: {
				onChange: (value) => {
					this.$$(value).show();
				}
			}
		};

		const segmentedCells = {
			animate: false,
			cells: [
				{
					localId: "segmentedActivities",
					rows: [contactActivities]
				},
				{
					localId: "segmentedFiles",
					rows: [contactFiles]
				},
				{}
			]
		};

		return {
			css: "white_bgc",
			rows: [
				{
					cols: [
						contactInfo,
						contactButtons
					]
				},
				segmentedActivitiesFiles,
				segmentedCells
			]
		};
	}

	init() {
		this.contactsTemplate = this.$$("contactsTemplate");
		this.on(this.app, "onContactSelect", (contact) => {
			this.contactsTemplate.setValues(contact);
		});
	}

	editContact() {
		this.show("./contactsData.contactForm");
	}

	deleteContact() {
		webix.confirm({
			text: "Contact's info and all related activities will be deleted permanently! Continue?"
		}).then(() => {
			const contactId = this.getParam("id", true);
			let actsToDelete;
			let filesToDelete;
			if (this.isNumber(contactId)) {
				actsToDelete = activities.find(act => +act.ContactID === contactId);
				filesToDelete = contactsFiles.find(file => +file.ContactID === contactId);
			}
			else if (this.isString(contactId)) {
				actsToDelete = activities.find(act => act.ContactID.toString() === contactId);
				filesToDelete = contactsFiles.find(file => file.ContactID.toString() === contactId);
			}

			contacts.waitSave(() => {
				if (actsToDelete) {
					activities.waitSave(() => {
						actsToDelete.forEach((activity) => {
							activities.remove(activity.id);
						});
					});
				}
				if (filesToDelete) {
					filesToDelete.forEach((file) => {
						contactsFiles.remove(file.id);
					});
				}
				contacts.remove(contactId);
			})
				.then(() => {
					webix.message("All info of the contact is deleted");
					const firstId = contacts.getFirstId();
					this.app.callEvent("onContactSelect", [{id: firstId}]);
					this.show(`/top/contacts?id=${firstId}/contactsData.contactsTemplate`);
				});
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activityTypes.waitData
		]).then(() => {
			const contactId = this.getParam("id", true);

			if (contactId && contacts.exists(contactId)) {
				let contactInfo = webix.copy(contacts.getItem(contactId));
				const contactStatusId = contactInfo.StatusID;
				const item = statuses.getItem(contactStatusId);
				if (contactStatusId && item) {
					contactInfo.Status = statuses.getItem(contactStatusId).Value;
				}
				this.contactsTemplate.setValues(contactInfo);

				if (this.isNumber(contactId)) {
					activities.data.filter(activity => +activity.ContactID === contactId);
					contactsFiles.data.filter(data => +data.ContactID === contactId);
				}
				else if (this.isString(contactId)) {
					activities.data.filter(activity => activity.ContactID.toString() === contactId);
					contactsFiles.data.filter(data => data.ContactID.toString() === contactId);
				}
			}
		});
	}

	isString(o) {
		const condition = typeof o === "object" && o.constructor === String;
		return typeof o === "string" || condition;
	}

	isNumber(o) {
		const condition = typeof o === "object" && o.constructor === Number;
		return typeof o === "number" || condition;
	}
}
