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
					width: 300,
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
							let contactInfo = webix.copy(contacts.getItem(id));
							const contactStatusId = contactInfo.StatusID;
							const item = statuses.getItem(contactStatusId);
							if (contactStatusId && item) {
								contactInfo.Status = statuses.getItem(contactStatusId).Value;
							}
							this.app.callEvent("onContactSelect", [contactInfo]);
						}
					}
				}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			if (!id) {
				id = contacts.getFirstId();
			}
			this.list.select(id);
		});
	}
}
