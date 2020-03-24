import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import avatarDefault from "../images/avatar_default.png";

export default class ContactsView extends JetView {
	config() {
		const contactsView = {
			cols: [
				{
					rows: [
						{
							view: "list",
							localId: "contactsList",
							width: 250,
							type: {
								height: "auto"
							},
							template: obj => `
											<div class="contact">
												<div class="contact_avatar">
													<img src="${obj.Photo || avatarDefault}" width="36" height="36">
												</div>
												<div class="contact_details">
													<div class="contact_details_div">
														<b>${obj.FirstName || " - "} ${obj.LastName || " - "}</b>
													</div>
													<small class="contact_details_div">${obj.Company || " - "}</small>
												</div>
											</div>`,
							select: true,
							scroll: "y",
							on: {
								onAfterSelect: (id) => {
									this.setParam("id", id, true);
									this.show("./contactsData.contactsTemplate");
								}
							}
						},
						{
							view: "button",
							localId: "addContactBtn",
							label: "Add contact",
							type: "icon",
							icon: "mdi mdi-plus-box",
							css: "white_bgc",
							click: () => this.addContact()
						}
					]
				},
				{$subview: true}
			]
		};
		return contactsView;
	}

	init() {
		this.contactsList = this.$$("contactsList");
		this.contactsList.sync(contacts);
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			if (contacts.count()) {
				let id = this.getParam("id", true);
				if (!id) {
					id = contacts.getFirstId();
				}
				this.contactsList.select(id);
			}
		});
		this.on(this.app, "onContactSelect", (contact) => {
			this.contactsList.select(contact.id);
		});
	}

	addContact() {
		this.contactsList.unselectAll();
		this.show("/top/contacts/contactsData.contactForm");
	}
}
