import {JetView} from "webix-jet";
import {statuses} from "../../models/statuses";
import {contacts} from "../../models/contacts";

export default class contactFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const headContactForm = {
			localId: "headContactForm",
			template: `<h1 class='mt0'>#selectedAction# ${_("contact")}</h1>`,
			height: 40
		};

		const contactLeftForm = {
			paddingX: 10,
			margin: 20,
			rows: [{
				view: "text",
				label: _("First Name"),
				labelWidth: 150,
				name: "FirstName",
				required: true,
				invalidMessage: _("Enter first name")
			},
			{
				view: "text",
				label: _("Last Name"),
				labelWidth: 150,
				name: "LastName",
				required: true,
				invalidMessage: _("Enter last name")
			},
			{
				view: "datepicker",
				value: new Date(),
				label: _("Joining date"),
				labelWidth: 150,
				name: "StartDate",
				format: webix.i18n.longDateFormatStr,
				required: true,
				invalidMessage: _("Select date")
			},
			{
				view: "select",
				label: _("Status"),
				labelWidth: 150,
				name: "StatusID",
				value: 1,
				options: statuses,
				invalidMessage: _("Select status")
			},
			{
				view: "text",
				label: _("Job"),
				labelWidth: 150,
				name: "Job",
				invalidMessage: _("Enter job's name")
			},
			{
				view: "text",
				label: _("Company"),
				labelWidth: 150,
				name: "Company",
				required: true,
				invalidMessage: _("Enter company name")
			},
			{
				view: "text",
				label: _("Website"),
				labelWidth: 150,
				name: "Website",
				invalidMessage: _("Enter website")
			},
			{
				view: "textarea",
				label: _("Address"),
				labelWidth: 150,
				name: "Address",
				invalidMessage: _("Enter address")
			}
			]
		};

		const contactRightForm = {
			paddingX: 10,
			margin: 20,
			rows: [{
				view: "text",
				label: _("Email"),
				labelWidth: 150,
				name: "Email",
				type: "email",
				invalidMessage: _("Enter email")
			},
			{
				view: "text",
				label: _("Skype"),
				labelWidth: 150,
				name: "Skype",
				invalidMessage: _("Enter Skype nickname")
			},
			{
				view: "text",
				label: _("Phone"),
				labelWidth: 150,
				name: "Phone",
				required: true,
				pattern: {mask: "+### (##) ### ## ##", allow: /[0-9]/g},
				invalidMessage: "Enter ### ## ### ## ##"
			},
			{
				view: "datepicker",
				label: _("Birthday"),
				labelWidth: 150,
				name: "Birthday",
				type: "date",
				format: webix.i18n.longDateFormatStr,
				required: true,
				invalidMessage: _("Select date")
			}
			]
		};
		const contactPhotoForm = {
			cols: [
				{
					template: obj => `<img class="contact_img" src="${obj.Photo || "sources/images/avatar_default.png"}"/>`,
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
							value: _("Change photo"),
							localId: "photoUploader",
							link: "contactPhoto",
							accept: "image/jpg, image/jpeg, image/png, image/gif",
							autosend: false,
							multiple: false,
							width: 150,
							on: {
								onBeforeFileAdd: (item) => {
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
							value: _("Delete photo"),
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
					value: _("Cancel"),
					width: 150,
					click: () => this.cancelOrCloseForm()
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
			]
		};
	}

	init() {
		this.contactForm = this.$$("contactForm");
		this.headContactForm = this.$$("headContactForm");
		this.addSaveButton = this.$$("addSaveButton");
		this.contactPhoto = this.$$("contactPhoto");
	}

	cancelOrCloseForm(id) {
		this.contactForm.clear();
		this.contactForm.clearValidation();

		this.app.callEvent("onSelectAddedOrUpdatedOrFirstContact", [{id}]);
	}

	addSaveContact() {
		contacts.waitSave(() => {
			if (this.contactForm.validate()) {
				const values = this.contactForm.getValues();
				values.Photo = this.contactPhoto.getValues().Photo;
				if (values && values.id) {
					contacts.updateItem(values.id, values);
				}
				else {
					contacts.add(values, 0);
				}
			}
		})
			.then((res) => {
				if (res.length === 0) {
					return;
				}
				this.cancelOrCloseForm(res.id);
			});
	}

	deletePhoto() {
		this.contactPhoto.setValues({Photo: ""});
	}

	urlChange() {
		const _ = this.app.getService("locale")._;
		const contactId = this.getParam("id", true);

		const selectedAction = contactId ? _("Edit") : _("Add");
		this.headContactForm.setValues({selectedAction});

		const addOrSave = contactId ? _("Save") : _("Add");
		this.addSaveButton.setValue(addOrSave);

		this.contactForm.clearValidation();
		this.contactForm.clear();

		if (contactId && contacts.exists(contactId)) {
			let contactValues;
			contacts.waitData
				.then(() => {
					contactValues = contacts.getItem(contactId);
					this.contactForm.setValues(contactValues);
					this.contactPhoto.setValues({Photo: contactValues.Photo});
				});
		}
	}
}
