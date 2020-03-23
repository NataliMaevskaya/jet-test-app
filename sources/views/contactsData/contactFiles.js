import {JetView} from "webix-jet";
import {contactsFiles} from "../../models/contactsFiles";

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
					fillspace: true,
					sort: "date"
				},
				{
					id: "size",
					header: "Size",
					sort: this.sortBySize.bind(this)
				},
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
		this.$$("filesDatatable").sync(contactsFiles);
		this.$$("uploadFile").attachEvent("onBeforeFileAdd", (file) => {
			const id = this.getParam("id", true);
			const fileInfo = {
				ContactID: id,
				name: file.name,
				fileDate: file.file.lastModifiedDate,
				size: file.sizetext,
				sizeInBytes: file.size
			};
			contactsFiles.add(fileInfo);
		});
	}

	urlChange() {
		const id = this.getParam("id", true);
		if (id && contactsFiles) {
			contactsFiles.data.filter(file => file.ContactID.toString() === id.toString());
		}
	}

	sortBySize(firstFile, secondFile) {
		return firstFile.sizeInBytes - secondFile.sizeInBytes;
	}

	deleteFile(id) {
		webix.confirm({
			text: "Record will be deleted permanently! Continue?"
		}).then(() => {
			contactsFiles.remove(id);
		});
	}
}
