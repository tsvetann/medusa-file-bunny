import { FileService } from "medusa-interfaces";
import * as fs from "fs"
const fetch = require('node-fetch');

// create medusajs file service which integrates with bunny cdn
class BunnyFileService extends FileService {

    options = {
        storage: {
            storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
            apiKey: process.env.BUNNY_API_KEY,
            storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
            storagePath: process.env.BUNNY_STORAGE_PATH,
        },
        cdn: {
            pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT,
        },
    }

    constructor({}, pluginOptions) {
        super()
        if (pluginOptions) {
            this.options = pluginOptions
        }
    }

    // upload file to bunny cdn
    // @ts-ignore
    async upload(
        fileData
    ) {
        try {
            const url = `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${this.options.storage.storagePath}/${fileData.originalname}`;
            const readStream = fs.createReadStream(fileData.path);

            const options = {
                method: 'PUT',
                headers: { 'content-type': 'application/octet-stream', AccessKey: this.options.storage.apiKey },
                body: readStream
            };

            await fetch(url, options);
            const uploadedUrl = `${this.options.cdn.pullZoneEndPoint}/${this.options.storage.storagePath}/${fileData.originalname}`
            console.log(uploadedUrl)
            return { url: uploadedUrl };
        } catch (error) {
            throw new Error(error)
        }
    }

    // @ts-ignore
    async delete(
        fileData
    ) {
        try {
            const url = `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${this.options.storage.storagePath}/${fileData.file_key}`
            const options = { method: 'DELETE', headers: { AccessKey: this.options.storage.apiKey } };
            await fetch(url, options);
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default BunnyFileService