import {JetView} from "webix-jet";
import {icons} from "../models/icons";

export default class TableToolbar extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._gridData = data;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const datatable = {
			view: "datatable",
			localId: "settings:datatable",
			scroll: "y",
			select: true,
			editable: true,
			columns: [
				{
					id: "value",
					header: _("Value"),
					editor: "text",
					fillspace: 2
				},
				{},
				{
					view: "richselect",
					id: "icon",
					header: _("Icon"),
					template: obj => `<span class="mdi mdi-${obj.Icon}"></span> ${obj.Icon}`,
					editor: "richselect",
					options: icons,
					fillspace: 1
				}
			]
		};

		const toolbar = {
			localId: "tabletoolbar:toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "button",
					localId: "settings:addButton",
					value: _("Add"),
					click: () => this.addItem()
				},
				{
					view: "button",
					localId: "settings:deleteButton",
					value: _("Delete"),
					click: () => this.deleteItem()
				}
			]
		};
		const tabletoolbar = {
			rows: [
				datatable,
				toolbar
			]
		};
		return tabletoolbar;
	}

	init() {
		this.datatable = this.$$("settings:datatable");
		this._gridData.waitData
			.then(() => {
				this.datatable.sync(this._gridData);
			});
	}

	addItem() {
		this._gridData.waitSave(() => {
			this._gridData.add({}, 0);
		}).then((res) => {
			this.datatable.edit({
				row: res.id,
				column: "Value"
			});
		});
	}

	deleteItem() {
		const selectedId = this.datatable.getSelectedId();
		if (selectedId) {
			webix.confirm({
				text: "Record will be deleted permanently! Continue?"
			}).then(() => {
				this._gridData.remove(selectedId);
			});
		}
	}
}
