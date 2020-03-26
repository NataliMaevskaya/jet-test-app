import {JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const segmentedButton = {
			view: "segmented",
			localId: "settings:lang",
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
		const settingsView = {
			type: "clean",
			rows: [
				segmentedButton,
				{}
			]
		};
		return settingsView;
	}

	init() {
		this.language = this.$$("settings:lang");
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.language.getValue();
		langs.setLang(value);
	}
}
