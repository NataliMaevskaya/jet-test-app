import {JetView} from "webix-jet";

export default class ContactsTemplateView extends JetView {
	config() {
		const contactInfo = {
			localId: "contactsTemplate",
			paddingX: 100,
			margin: 20,
			template: obj => `<div class="header_contact">
									<h1>${obj.FirstName || " - "} ${obj.LastName || " - "}</h1>
								</div>
								<div class="info_contact">
									<div class="photo_contact">
										<img src="${obj.Photo || "sources/images/avatar_default.png"}"/>
										<p class="status_contact">${obj.Status || " - "}</p>
									</div>
									<div class="detailed_info_contact">
										<span class="mdi mdi-email mdi_details"> ${obj.Email || " - "}</span>
										<span class="mdi mdi-skype mdi_details"> ${obj.Skype || " - "}</span>
										<span class="mdi mdi-tag mdi_details"> ${obj.Job || " - "}</span>
										<span class="mdi mdi-briefcase mdi_details"> ${obj.Company || " - "}</span>
									</div>
									<div class="detailed_info_contact">
										<span class="mdi mdi-calendar-month mdi_details"> ${obj.Birthday || " - "}</span>
										<span class="mdi mdi-map-marker mdi_details"> ${obj.Address || " - "}</span>
									</div>
								</div>`
		};

		const contactButtons = {
			padding: 20,
			css: "white_bgc",
			rows: [
				{
					cols: [
						{
							view: "button",
							label: "Delete",
							type: "icon",
							icon: "wxi-trash",
							width: 90,
							disabled: true
						},
						{width: 5},
						{
							view: "button",
							label: "Edit",
							type: "icon",
							icon: "mdi mdi-pencil-box-outline",
							width: 90,
							disabled: true
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{
					cols: [
						contactInfo,
						contactButtons
					]
				}
			]
		};
	}

	init() {
		this.contactsTemplate = this.$$("contactsTemplate");
		this.on(this.app, "onChangeUsersListUrl", (item) => {
			this.contactsTemplate.setValues(item);
		});
	}
}
