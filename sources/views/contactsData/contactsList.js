import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class ContactsListView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "list",
					localId: "contactsList",
					width: 100,
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
							// debugger;
							this.setParam("id", id, true);
							this.show("./contactsData.contactsTemplate");
							// this.show(`/top/contacts?id=${id}/contactsData.contactsTemplate`);
							// this.app.callEvent("onContactSelect", [id]);
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
					// width: 250,
					// align: "center",
					click: () => this.addContact()
				}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			// debugger;
			let id = this.getParam("id", true);
			if (!id) {
				id = contacts.getFirstId();
			}
			// this.show("./contactsData.contactsTemplate");
			console.log(id);
			// debugger
			this.list.select(id);
			// this.show(`./contacts?id=${id}/contactsData.contactsTemplate`); бесконечный цикл//
		});
	}

	addContact() {
		// debugger
		this.list.unselectAll();
		this.show("/top/contacts/contactsData.contactForm");
	}
}
