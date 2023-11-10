"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _medusaInterfaces = require("medusa-interfaces");
var fs = _interopRequireWildcard(require("fs"));
var _stream = _interopRequireDefault(require("stream"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var fetch = require('node-fetch');
var https = require('https');
function getReadStreamFromCDN(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (response) {
      if (response.statusCode !== 200) {
        reject(new Error("Failed to get file from CDN. Status Code: ".concat(response.statusCode)));
        return;
      }
      resolve(response);
    }).on('error', function (err) {
      reject(err);
    });
  });
}

// create medusajs file service which integrates with bunny cdn
var BunnyFileService = /*#__PURE__*/function (_FileService) {
  (0, _inherits2["default"])(BunnyFileService, _FileService);
  var _super = _createSuper(BunnyFileService);
  function BunnyFileService(_ref, pluginOptions) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, BunnyFileService);
    _this = _super.call(this);
    var config = {
      storage: {
        storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
        apiKey: process.env.BUNNY_API_KEY,
        storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
        storagePath: process.env.BUNNY_STORAGE_PATH
      },
      cdn: {
        pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT
      }
    };
    _this.options = _objectSpread(_objectSpread({}, config), pluginOptions);
    return _this;
  }

  // upload file to bunny cdn
  // In summary, a correctly formatted upload URL should resemble: https://{region}.bunnycdn.com/{storageZoneName}/{path}/{fileName}
  // @ts-ignore
  (0, _createClass2["default"])(BunnyFileService, [{
    key: "upload",
    value: function () {
      var _upload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileData) {
        var url, readStream, response, uploadedUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              url = this.constructFileUrl(fileData.originalname);
              readStream = fs.createReadStream(fileData.path);
              _context.next = 5;
              return this.fetchWithStream(url, readStream, 'PUT');
            case 5:
              response = _context.sent;
              this.handleFetchResponse(response);
              uploadedUrl = this.constructCdnUrl(fileData.originalname);
              return _context.abrupt("return", {
                url: uploadedUrl
              });
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              throw new Error(_context.t0);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 11]]);
      }));
      function upload(_x) {
        return _upload.apply(this, arguments);
      }
      return upload;
    }() // @ts-ignore
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileData) {
        var url, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              url = this.constructFileUrl(fileData.file_key);
              _context2.next = 4;
              return fetch(url, this.createFetchOptions('DELETE'));
            case 4:
              response = _context2.sent;
              this.handleFetchResponse(response);
              _context2.next = 11;
              break;
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              throw _context2.t0;
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 8]]);
      }));
      function _delete(_x2) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getUploadStreamDescriptor",
    value: function () {
      var _getUploadStreamDescriptor = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref2) {
        var name, ext, fileName, filePath, downloadFilePath, pass;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              name = _ref2.name, ext = _ref2.ext;
              fileName = "".concat(name, ".").concat(ext);
              filePath = this.constructFileUrl(fileName);
              downloadFilePath = this.constructCdnUrl(fileName);
              pass = new _stream["default"].PassThrough();
              return _context3.abrupt("return", {
                writeStream: pass,
                promise: fetch(filePath, this.createFetchOptions('PUT', pass)),
                url: downloadFilePath,
                fileKey: downloadFilePath
              });
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getUploadStreamDescriptor(_x3) {
        return _getUploadStreamDescriptor.apply(this, arguments);
      }
      return getUploadStreamDescriptor;
    }()
  }, {
    key: "getPresignedDownloadUrl",
    value: function () {
      var _getPresignedDownloadUrl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref3) {
        var fileKey;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              fileKey = _ref3.fileKey;
              return _context4.abrupt("return", "".concat(fileKey));
            case 2:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getPresignedDownloadUrl(_x4) {
        return _getPresignedDownloadUrl.apply(this, arguments);
      }
      return getPresignedDownloadUrl;
    }()
  }, {
    key: "uploadProtected",
    value: function () {
      var _uploadProtected = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(fileData) {
        var filePath, readStream, uploadedUrl;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              filePath = this.constructFileUrl(fileData.originalname);
              readStream = fs.createReadStream(fileData.path);
              _context5.next = 4;
              return fetch(filePath, this.createFetchOptions('PUT', readStream));
            case 4:
              uploadedUrl = this.constructCdnUrl(fileData.originalname);
              return _context5.abrupt("return", {
                url: "".concat(uploadedUrl),
                key: "".concat(uploadedUrl)
              });
            case 6:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function uploadProtected(_x5) {
        return _uploadProtected.apply(this, arguments);
      }
      return uploadProtected;
    }()
  }, {
    key: "getDownloadStream",
    value: function () {
      var _getDownloadStream = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref4) {
        var fileKey, readStream;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              fileKey = _ref4.fileKey;
              _context6.next = 3;
              return getReadStreamFromCDN(fileKey);
            case 3:
              readStream = _context6.sent;
              return _context6.abrupt("return", readStream);
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getDownloadStream(_x6) {
        return _getDownloadStream.apply(this, arguments);
      }
      return getDownloadStream;
    }() // Helper methods
    // constructFileUrl(fileName) {
    //   return `${this.options.storage.storageUploadEndPoint}/${this.options.storage.storageZoneName}/${this.options.storage.storagePath}/${fileName}`;
    // }
  }, {
    key: "constructFileUrl",
    value: function constructFileUrl(fileName) {
      // Check if storagePath is defined and not empty
      var storagePath = this.options.storage.storagePath ? "".concat(this.options.storage.storagePath, "/") : '';
      return "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(storagePath).concat(fileName);
    }

    // constructCdnUrl(fileName) {
    //   return `${this.options.cdn.pullZoneEndPoint}/${this.options.storage.storagePath}/${fileName}`;
    // }
  }, {
    key: "constructCdnUrl",
    value: function constructCdnUrl(fileName) {
      // Check if storagePath is defined and not empty
      var storagePath = this.options.storage.storagePath ? "".concat(this.options.storage.storagePath, "/") : '';
      return "".concat(this.options.cdn.pullZoneEndPoint, "/").concat(storagePath).concat(fileName);
    }
  }, {
    key: "createFetchOptions",
    value: function createFetchOptions(method) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return {
        method: method,
        headers: {
          'content-type': 'application/octet-stream',
          AccessKey: this.options.storage.apiKey
        },
        body: body
      };
    }
  }, {
    key: "fetchWithStream",
    value: function () {
      var _fetchWithStream = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(url, stream, method) {
        var options;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              options = this.createFetchOptions(method, stream);
              return _context7.abrupt("return", fetch(url, options));
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function fetchWithStream(_x7, _x8, _x9) {
        return _fetchWithStream.apply(this, arguments);
      }
      return fetchWithStream;
    }()
  }, {
    key: "handleFetchResponse",
    value: function handleFetchResponse(response) {
      if (!response.ok) {
        throw new Error("Fetch error: ".concat(response.statusText));
      }
      return response;
    }
  }]);
  return BunnyFileService;
}(_medusaInterfaces.FileService);
var _default = BunnyFileService;
exports["default"] = _default;