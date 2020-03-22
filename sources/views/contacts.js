import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

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
													<i class="mdi mdi-36px mdi-account-circle"></i>
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
			let id = this.getParam("id", true);
			if (!id) {
				id = contacts.getFirstId();
			}
			this.contactsList.select(id);
		});
		this.on(this.app, "onContactSelect", (contact) => {
			const id = contact.id;
			this.setParam("id", id, true);
			this.contactsList.select(id);
		});
	}

	addContact() {
		this.contactsList.unselectAll();
		this.show("/top/contacts/contactsData.contactForm");
	}
}
