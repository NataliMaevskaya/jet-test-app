import {JetView} from "webix-jet";
// import contactsTemplate from "./contactsData/contactsTemplate";
import contactsList from "./contactsData/contactsList";
// import { contacts } from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const contactsView = {
			cols: [
				contactsList,
				{$subview: true}
				// contactsTemplate
			]
		};
		return contactsView;
	}

	init() {
	}
}
