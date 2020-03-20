import {JetView} from "webix-jet";
import contactsList from "./contactsData/contactsList";

export default class ContactsView extends JetView {
	config() {
		const contactsView = {
			cols: [
				contactsList,
				{$subview: true}
			]
		};
		return contactsView;
	}
}
