import {JetView} from "webix-jet";
import {activityTypes} from "../models/activityTypes";
import {statuses} from "../models/statuses";
import TableToolbar from "./tabletoolbar";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const segmentedLang = {
			view: "segmented",
			localId: "segmentedLang",
			value: this.app.getService("locale").getLang(),
			inputWidth: 250,
			options: [
				{
					id: "en",
					value: _("English")
				},
				{
					id: "ru",
					value: _("Russian")
				}
			],
			click: () => this.toggleLanguage()
		};
		const segmentedToolbar = {
			view: "segmented",
			localId: "actTypesOrContactStatuses",
			value: "actTypes",
			options: [
				{
					id: "actTypes",
					value: _("Types of activity")

				},
				{
					id: "contactStatuses",
					value: _("Statuses of contact")

				}
			],
			on: {
				onChange: segment => this.$$(segment).show()
			}
		};
		const toolbarCells = {
			animate: false,
			cells: [
				{
					localId: "actTypes",
					rows: [new TableToolbar(this.app, "", activityTypes)]
				},
				{
					localId: "contactStatuses",
					rows: [new TableToolbar(this.app, "", statuses)]
				},
				{}
			]
		};
		const settingsView = {
			fitBiggest: true,
			rows: [
				segmentedLang,
				segmentedToolbar,
				toolbarCells
			]
		};
		return settingsView;
	}

	init() {
		this.language = this.$$("segmentedLang");
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.language.getValue();
		langs.setLang(value);
	}
}
