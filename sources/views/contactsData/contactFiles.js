import {JetView} from "webix-jet";
// import {activities} from "../models/activities";
// import {activityTypes} from "../models/activityTypes";
// import {contacts} from "../../models/contacts";
import {contactFiles} from "../../models/contactFiles";
// import bodyActivityWindow from "./activityWindow";

export default class ContactFilesView extends JetView {
	config() {
		const uploadButton = {
			cols: [
				{},
				{
					view: "uploader",
					localId: "uploadFile",
					value: "Upload file",
					type: "icon",
					icon: "mdi mdi-cloud-upload",
					autosend: false,
					width: 150,
					borderless: true
				}
			]
		};
		const filesDatatable = {
			view: "datatable",
			localId: "filesDatatable",
			type: "uploader",
			scroll: "y",
			sort: "multi",
			columns: [
				{
					id: "name",
					header: "Name",
					fillspace: true,
					sort: "string"
				},
				{
					id: "fileDate",
					header: "Change date",
					value: new Date(),
					format: webix.i18n.longDateFormatStr,
					sort: "date"
				},
				{id: "size", header: "Size", sort: this.sortBySize},
				{
					id: "deleteIcon",
					header: "",
					template: "<span class='webix_icon wxi-trash'></span>",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": (e, id) => this.deleteFile(id)
			}
		};
		return {
			rows: [
				filesDatatable,
				uploadButton

			]
		};
	}

	init() {
		this.$$("filesDatatable").sync(contactFiles);
		this.$$("uploadFile").attachEvent("onBeforeFileAdd", (file) => {
			const id = this.getParam("id", true);
			const fileInfo = {
				ContactID: id,
				name: file.name,
				fileDate: file.file.lastModifiedDate,
				size: file.sizetext
			};
			contactFiles.add(fileInfo);
		});
	}

	urlChange() {
		const id = this.getParam("id", true);
		if (id && contactFiles) {
			contactFiles.data.filter(file => file.ContactID.toString() === id.toString());
		}
	}

	sortBySize(firstFile, secondFile) {
		return parseFloat(firstFile.size) - parseFloat(secondFile.size);
	}

	deleteFile(id) {
		webix.confirm({
			text: "Record will be deleted permanently! Continue?"
		}).then(() => {
			contactFiles.remove(id);
		});
	}
}
