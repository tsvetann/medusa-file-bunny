"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _medusaInterfaces = require("medusa-interfaces");
var fs = _interopRequireWildcard(require("fs"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var fetch = require('node-fetch');

// create medusajs file service which integrates with bunny cdn
var BunnyFileService = /*#__PURE__*/function (_FileService) {
  (0, _inherits2["default"])(BunnyFileService, _FileService);
  var _super = _createSuper(BunnyFileService);
  function BunnyFileService(_ref, pluginOptions) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, BunnyFileService);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "options", {
      storage: {
        storageUploadEndPoint: process.env.BUNNY_STORAGE_UPLOAD_ENDPOINT,
        apiKey: process.env.BUNNY_API_KEY,
        storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
        storagePath: process.env.BUNNY_STORAGE_PATH
      },
      cdn: {
        pullZoneEndPoint: process.env.BUNNY_PULLZONE_ENDPOINT
      }
    });
    if (pluginOptions) {
      _this.options = pluginOptions;
    }
    return _this;
  }

  // upload file to bunny cdn
  // @ts-ignore
  (0, _createClass2["default"])(BunnyFileService, [{
    key: "upload",
    value: function () {
      var _upload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileData) {
        var url, readStream, options, uploadedUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              url = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
              readStream = fs.createReadStream(fileData.path);
              options = {
                method: 'PUT',
                headers: {
                  'content-type': 'application/octet-stream',
                  AccessKey: this.options.storage.apiKey
                },
                body: readStream
              };
              _context.next = 6;
              return fetch(url, options);
            case 6:
              uploadedUrl = "".concat(this.options.cdn.pullZoneEndPoint, "/").concat(this.options.storage.storagePath, "/").concat(fileData.originalname);
              console.log(uploadedUrl);
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
        var url, options;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              url = "".concat(this.options.storage.storageUploadEndPoint, "/").concat(this.options.storage.storageZoneName, "/").concat(this.options.storage.storagePath, "/").concat(fileData.file_key);
              options = {
                method: 'DELETE',
                headers: {
                  AccessKey: this.options.storage.apiKey
                }
              };
              _context2.next = 5;
              return fetch(url, options);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              throw new Error(_context2.t0);
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 7]]);
      }));
      function _delete(_x2) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
  return BunnyFileService;
}(_medusaInterfaces.FileService);
var _default = BunnyFileService;
exports["default"] = _default;