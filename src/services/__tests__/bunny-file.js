const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');
import BunnyFileService from '../bunny-file';
const { Readable } = require('stream');

let pluginOptions = {
  storage: {
    storageUploadEndPoint: 'https://storage.bunnycdn.com',
    apiKey: 'access_key',
    storageZoneName: 'storageZoneName',
    storagePath: 'storagePath',
  },
  cdn: {
    pullZoneEndPoint: 'https://pullZoneEndPoint.net',
  },
};

// Mocking the dependencies
jest.mock('node-fetch', () => jest.fn());
jest.mock('fs')
const spy = jest.spyOn(fs, 'readFileSync').mockImplementation();
jest.mock('https', () => ({
  get: jest.fn((url, callback) => {
    callback({
      statusCode: 200,
      on: jest.fn(),
    });
    return { on: jest.fn() };
  }),
}));

describe('BunnyFileService', () => {
  let fileService;
  const mockFileData = {
    path: 'path/to/file',
    originalname: 'testfile.jpg',
    file_key: 'file_key',
  };

  beforeEach(() => {
    // Set up your file service with necessary options or mocks here
    fileService = new BunnyFileService({}, pluginOptions);
  });

  describe('upload', () => {
    it('should upload a file and return the URL', async () => {
      fetch.mockResolvedValueOnce({ ok: true });
      const result = await fileService.upload(mockFileData);
      expect(result.url).toBe(`https://pullZoneEndPoint.net/storagePath/testfile.jpg`);
    });

    it('should throw an error if the upload fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Upload failed'));
      await expect(fileService.upload(mockFileData)).rejects.toThrow('Upload failed');
    });
  });

  describe('delete', () => {
    it('should call fetch with the DELETE method', async () => {
      fetch.mockResolvedValueOnce({ ok: true });
      await fileService.delete(mockFileData);
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('should throw an error if the delete operation fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(fileService.delete(mockFileData)).rejects.toThrow('Delete failed');
    });
  });

  describe('getUploadStreamDescriptor', () => {
    it('should return a writeStream and promise', async () => {
      const descriptor = await fileService.getUploadStreamDescriptor({
        name: 'file',
        ext: 'jpg',
      });

      expect(descriptor).toHaveProperty('writeStream');
      expect(descriptor).toHaveProperty('promise');
      expect(descriptor).toHaveProperty('url');
      expect(descriptor).toHaveProperty('fileKey');
    });
  });

  describe('getPresignedDownloadUrl', () => {
    it('should return a file URL', async () => {
      const url = await fileService.getPresignedDownloadUrl({ fileKey: 'fileKey' });
      expect(url).toContain('fileKey');
    });
  });

  describe('getDownloadStream', () => {
    it('should return a readStream for the given fileKey', async () => {
      // Create a mock readable stream
      const mockStream = new Readable({
        read() { }
      });
      mockStream.statusCode = 200;

      // Mock https.get to simulate a successful response
      https.get.mockImplementation((url, callback) => {
        process.nextTick(() => callback(mockStream)); // Simulate async operation
        return { on: jest.fn() };
      });

      const stream = await fileService.getDownloadStream({ fileKey: 'fileKey' });
      expect(stream).toBeDefined();
      expect(https.get).toHaveBeenCalled();
      expect(stream).toBeInstanceOf(Readable);
    });

    it('should throw an error if the CDN stream retrieval fails', async () => {
      https.get.mockImplementationOnce((url, callback) => {
        callback({ statusCode: 404, on: jest.fn() });
        return { on: jest.fn((event, handler) => handler(new Error('Stream failed'))) };
      });
      await expect(fileService.getDownloadStream({ fileKey: 'fileKey' })).rejects.toThrow();
    });
  });
})
