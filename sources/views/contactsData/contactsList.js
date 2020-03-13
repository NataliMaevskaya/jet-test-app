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
						height: 40
					},
					template: obj => `
									<div class="contact">
										<div class="contact_avatar">
											<i class="mdi mdi-36px mdi-account-circle"></i>
										</div>
										<div class="contact_details">
											<div class="contact_details_div">
												<b>${obj.FirstName || "No name"} ${obj.LastName || "No surname"}</b>
											</div>
											<small class="contact_details_div">${obj.Company}</small>
										</div>
									</div>`,
					select: true,
					scroll: "y",
					on: {
						onAfterSelect: (id) => {
							this.setParamToUrl(id);
							this.app.callEvent("onChangeUsersListUrl", [contacts.getItem(id)]);
						}
					}
				}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			this.list.sync(contacts);
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) {
				id = contacts.getFirstId();
			}
			this.list.select(id);
		});
	}

	setParamToUrl(id) {
		this.setParam("id", id, true);
	}

	urlChange(view, url) {
		const urlId = url[0].params.id;

		if (urlId && this.list.exists(urlId)) {
			this.list.select(urlId);
		}
	}
}
