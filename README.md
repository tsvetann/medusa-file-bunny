# Bunny.net

Store uploaded files to your Medusa backend on bunny.net CDN.

[Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on bunny.net

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Bunny account](https://bunny.net/)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install medusa-file-bunny
```

2\. Set the following environment variables in `.env`:

```bash
BUNNY_API_KEY=<YOUR_BUNNY_API_KEY>
BUNNY_STORAGE_ZONE_NAME=<BUNNY_STORAGE_ZONE_NAME>
BUNNY_STORAGE_PATH=<YOUR_BUNNY_STORAGE_PATH>
BUNNY_STORAGE_UPLOAD_ENDPOINT=<YOUR_BUNNY_STORAGE_UPLOAD_ENDPOINT>
BUNNY_PULLZONE_ENDPOINT=<YOUR_BUNNY_PULLZONE_ENDPOINT>
```

`BUNNY_STORAGE_PATH` is optional since version `0.0.5`. If omitted the media will be uploaded in the root directory

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: "medusa-file-bunny",
    options: {
      storage: {
        apiKey: process.env.BUNNY_API_KEY,
        storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
        storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
        storagePath: process.env.BUNNY_STORAGE_PATH,
      },
      cdn: {
        pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT,
      },
      uniqueFilename: false
    },
  },
]
```

## Configuration overview

The `uniqueFilename` setting is a boolean configuration option that dictates the naming convention of uploaded media files. When enabled, it ensures that each uploaded file is saved with a unique filename, reducing the risk of overwriting existing files and improving file management. The default value is false

---

## Test the Plugin

```bash
yarn install
yarn test
```

## Use the upload functinality in medusa
Upload an image for a product using the admin dashboard or using [the Admin APIs](https://docs.medusajs.com/api/admin#tag/Upload).