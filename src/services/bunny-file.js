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
  // Add a property for storing the unique filename
  lastUniqueFilename = null;

  constructor({ }, pluginOptions) {
    super()
    const config = {
      storage: {
        storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
        apiKey: process.env.BUNNY_API_KEY,
        storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
        storagePath: process.env.BUNNY_STORAGE_PATH,
      },
      cdn: {
        pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT,
      },
      uniqueFilename: false,
    };
    this.options = { ...config, ...pluginOptions };
  }

  // upload file to bunny cdn
  // In summary, a correctly formatted upload URL should resemble: https://{region}.bunnycdn.com/{storageZoneName}/{path}/{fileName}
  // @ts-ignore
  async upload(
    fileData
  ) {
    try {
      const fileName = this.getUniqueFilename(fileData.originalname);
      const url = this.constructFileUrl(fileName);
      const readStream = fs.createReadStream(fileData.path);

      const response = await this.fetchWithStream(url, readStream, 'PUT');
      this.handleFetchResponse(response);

      const uploadedUrl = this.constructCdnUrl(fileName);
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
      const url = this.constructFileUrl(fileData.file_key);
      const response = await fetch(url, this.createFetchOptions('DELETE'));
      this.handleFetchResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async getUploadStreamDescriptor({
    name,
    ext,
  }
  ) {
    const fileName = `${name}.${ext}`;
    const filePath = this.constructFileUrl(fileName);
    const downloadFilePath = this.constructCdnUrl(fileName);
    const pass = new stream.PassThrough();

    return {
      writeStream: pass,
      promise: fetch(filePath, this.createFetchOptions('PUT', pass)),
      url: downloadFilePath,
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
    const filePath = this.constructFileUrl(fileData.originalname);
    const readStream = fs.createReadStream(fileData.path);

    await fetch(filePath, this.createFetchOptions('PUT', readStream));
    const uploadedUrl = this.constructCdnUrl(fileData.originalname);
    return {
      url: `${uploadedUrl}`,
      key: `${uploadedUrl}`,
    }
  }

  async getDownloadStream({
    fileKey,
  }
  ) {
    const readStream = await getReadStreamFromCDN(fileKey)
    return readStream
  }

  // Helper methods
  constructFileUrl(fileName) {
    // Check if storagePath is defined and not empty
    const storagePath = this.options.storage.storagePath
      ? `${this.options.storage.storagePath}/`
      : '';

    return `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${storagePath}${fileName}`;
  }

  constructCdnUrl(fileName) {
    // Check if storagePath is defined and not empty
    const storagePath = this.options.storage.storagePath
      ? `${this.options.storage.storagePath}/`
      : '';

    return `${this.options.cdn.pullZoneEndPoint}/${storagePath}${fileName}`;
  }

  createFetchOptions(method, body = null) {
    return {
      method: method,
      headers: {
        'content-type': 'application/octet-stream',
        AccessKey: this.options.storage.apiKey,
      },
      body,
    };
  }

  async fetchWithStream(url, stream, method) {
    const options = this.createFetchOptions(method, stream);
    return fetch(url, options);
  }

  handleFetchResponse(response) {
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }
    return response;
  }

  getUniqueFilename(fileName) {
    if (this.options.uniqueFilename) {
      this.uniqueFilename = `${Date.now()}-${fileName}`;
      return this.uniqueFilename;
    }
    return fileName;
  }
}

export default BunnyFileService