import {JetView} from "webix-jet";
import {statuses} from "../../models/statuses";
import {contacts} from "../../models/contacts";
import avatarDefault from "../../images/avatar_default.png";

export default class contactFormView extends JetView {
	config() {
		const headContactForm = {
			localId: "headContactForm",
			template: "<h1 class='mt0'>#selectedAction# contact</h1>",
			height: 40
		};

		const contactLeftForm = {
			paddingX: 10,
			margin: 20,
			rows: [{
				view: "text",
				label: "First Name",
				labelWidth: 150,
				name: "FirstName",
				required: true,
				invalidMessage: "Enter first name"
			},
			{
				view: "text",
				label: "Last Name",
				labelWidth: 150,
				name: "LastName",
				required: true,
				invalidMessage: "Enter last name"
			},
			{
				view: "datepicker",
				value: new Date(),
				label: "Joining date",
				labelWidth: 150,
				name: "StartDate",
				format: webix.i18n.longDateFormatStr,
				required: true,
				invalidMessage: "Select date"
			},
			{
				view: "select",
				label: "Status",
				labelWidth: 150,
				name: "StatusID",
				value: 1,
				options: statuses,
				invalidMessage: "Select status"
			},
			{
				view: "text",
				label: "Job",
				labelWidth: 150,
				name: "Job",
				invalidMessage: "Enter job's name"
			},
			{
				view: "text",
				label: "Company",
				labelWidth: 150,
				name: "Company",
				required: true,
				invalidMessage: "Enter company name"
			},
			{
				view: "text",
				label: "Website",
				labelWidth: 150,
				name: "Website",
				invalidMessage: "Enter website"
			},
			{
				view: "textarea",
				label: "Address",
				labelWidth: 150,
				name: "Address",
				invalidMessage: "Enter address"
			}
			]
		};

		const contactRightForm = {
			paddingX: 10,
			margin: 20,
			rows: [{
				view: "text",
				label: "Email",
				labelWidth: 150,
				name: "Email",
				type: "email",
				invalidMessage: "Enter email"
			},
			{
				view: "text",
				label: "Skype",
				labelWidth: 150,
				name: "Skype",
				invalidMessage: "Enter Skype nickname"
			},
			{
				view: "text",
				label: "Phone",
				labelWidth: 150,
				name: "Phone",
				required: true,
				invalidMessage: "Enter + and some digits"
			},
			{
				view: "datepicker",
				label: "Birthday",
				labelWidth: 150,
				name: "Birthday",
				type: "date",
				format: webix.i18n.longDateFormatStr,
				required: true,
				invalidMessage: "Select date"
			}
			]
		};
		const contactPhotoForm = {
			cols: [
				{
					template: obj => `<img src="${obj.Photo || "sources/images/avatar_default.png"}"/>`,
					name: "Photo",
					labelWidth: 150,
					localId: "contactPhoto",
					height: 150
				},
				{
					margin: 10,
					rows: [
						{
							view: "uploader",
							value: "Change photo",
							localId: "photoUploader",
							link: "contactPhoto",
							accept: "image/jpg, image/jpeg, image/png, image/gif",
							autosend: false,
							multiple: false,
							width: 150,
							on: {
								onBeforeFileAdd: (item) => {
									// debugger
									const fileReader = new FileReader();
									fileReader.readAsDataURL(item.file);
									fileReader.onload = () => this.$$("contactPhoto").setValues({Photo: fileReader.result});
								},
								onFileUploadError: () => {
									webix.message({type: "error", text: "Error during uploading photo!"});
								}
							}
						},
						{
							view: "button",
							value: "Delete photo",
							width: 150,
							click: () => this.deletePhoto()
						}
					]
				}
			]
		};

		const contactFormButtons = {
			cols: [
				{},
				{
					view: "button",
					value: "Cancel",
					width: 150,
					click: () => this.cancelForm()
				},
				{
					view: "button",
					localId: "addSaveButton",
					width: 150,
					click: () => this.addSaveContact()
				}
			]

		};
		return {
			view: "form",
			localId: "contactForm",
			margin: 20,
			elements: [
				headContactForm,
				{
					cols: [
						contactLeftForm,
						{
							rows: [
								contactRightForm,
								contactPhotoForm
							]
						}
					]
				},
				{},
				contactFormButtons
			],
			rules: {
				FirstName: this.webix.rules.isNotEmpty,
				LastName: this.webix.rules.isNotEmpty,
				StartDate: this.webix.rules.isNotEmpty,
				Company: this.webix.rules.isNotEmpty,
				Phone: this.webix.rules.isNotEmpty,
				Birthday: this.webix.rules.isNotEmpty
			}
		};
	}

	init() {
		this.contactForm = this.$$("contactForm");
		this.headContactForm = this.$$("headContactForm");
		this.addSaveButton = this.$$("addSaveButton");
		this.contactPhoto = this.$$("contactPhoto");

		const contactId = this.getParam("id", true);

		const selectedAction = contactId ? "Edit" : "Add";
		this.headContactForm.setValues({selectedAction});

		const addOrSave = contactId ? "Save" : "Add";
		this.addSaveButton.setValue(addOrSave);

		if (contactId && contacts.exists(contactId)) {
			let contactValues;
			contacts.waitData
				.then(() => {
					contactValues = contacts.getItem(contactId);
					this.contactForm.setValues(contactValues);
					this.contactPhoto.setValues({Photo: contactValues.Photo});
				});
			// debugger;
		}
	}

	cancelForm(id) {
		this.contactForm.clear();
		this.contactForm.clearValidation();
		this.setParam("id", id, true);
		// this.contactForm.getParentView().getChildViews()[0];
		this.show(`/top/contacts?id=${id}/contactsData.contactsTemplate`);
	}

	addSaveContact() {
		contacts.waitSave(() => {
			if (this.contactForm.validate()) {
				const values = this.contactForm.getValues();
				if (values && values.id) {
					contacts.updateItem(values.id, values);
				}
				else {
					contacts.add(values, 0);
				}
			}
		})
			.then((id) => {
				this.cancelForm(id);
			});
	}

	deletePhoto() {
		this.contactPhoto.setValues({Photo: avatarDefault});
	}
}
