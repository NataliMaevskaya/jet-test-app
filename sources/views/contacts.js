import {JetView} from "webix-jet";
import contactsTemplate from "./contactsData/contactsTemplate";
import contactsList from "./contactsData/contactsList";

export default class ContactsView extends JetView {
	config() {
		const contactsView = {
			cols: [
				contactsList,
				contactsTemplate
			]
		};
		return contactsView;
	}
}