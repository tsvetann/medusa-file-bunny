import { FileService } from "medusa-interfaces";
import * as fs from "fs"
const fetch = require('node-fetch');
import stream from "stream"
const https = require('https');

function getReadStreamFromCDN(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get file from CDN. Status Code: ${response.statusCode}`));
        return;
      }

      resolve(response);
    }).on('error', (err) => {
      reject(err);
    });
  });
}

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

  constructor({ }, pluginOptions) {
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

  async getUploadStreamDescriptor({
    name,
    ext,
    isPrivate = true,
  }
  ) {
    const filePath = `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${this.options.storage.storagePath}/${name}.${ext}`;
    const downloadFilePath = `${this.options.cdn.pullZoneEndPoint}/${this.options.storage.storagePath}/${name}.${ext}`;
    const pass = new stream.PassThrough();

    const options = {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream', AccessKey: this.options.storage.apiKey },
      body: pass
    };

    return {
      writeStream: pass,
      promise: fetch(filePath, options),
      url: `${downloadFilePath}`,
      fileKey: downloadFilePath,
    }
  }

  async getPresignedDownloadUrl({
    fileKey,
  }
  ) {
    return `${fileKey}`
  }

  async uploadProtected(
    fileData
  ) {
    // const filePath = `${this.protectedPath}/${fileData.originalname}`
    const filePath = `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${this.options.storage.storagePath}/${fileData.originalname}`;
    const readStream = fs.createReadStream(fileData.path);

    const options = {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream', AccessKey: this.options.storage.apiKey },
      body: readStream
    };

    await fetch(filePath, options);
    const uploadedUrl = `${this.options.cdn.pullZoneEndPoint}/${this.options.storage.storagePath}/${fileData.originalname}`
    return {
      url: `${uploadedUrl}`,
      key: `${uploadedUrl}`,
    }
  }

  async getDownloadStream({
    fileKey,
    isPrivate = true,
  }
  ) {
    const readStream = await getReadStreamFromCDN(fileKey)
    return readStream
  }
}

export default BunnyFileService