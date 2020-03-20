import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let topHeader = {
			type: "header",
			id: "topHeader",
			template: "#menuItem#",
			css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 100,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "mdi mdi-account-multiple"},
				{value: "Activities", id: "activities", icon: "wxi-calendar"},
				{value: "Settings", id: "settings", icon: "mdi mdi-cogs"}
			]
		};

		let ui = {
			paddingX: 5,
			css: "app_layout",
			rows: [
				topHeader,
				{
					cols: [
						{
							paddingY: 1,
							rows: [{css: "webix_shadow_medium", rows: [menu]}]
						},
						{
							type: "wide",
							paddingY: 1,
							paddingX: 1,
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.topMenu = this.$$("top:menu");
		this.use(plugins.Menu, "top:menu");

		this.topMenu.attachEvent("onAfterSelect", (id) => {
			if (id) {
				const menuItem = this.topMenu.getItem(id).value;
				this.$$("topHeader").setValues({menuItem});
			}
		});
	}
}
