"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCamera = void 0;
var GameObject_1 = require("../GameObject");
var Camera_1 = require("../Components/Camera");
var GameCamera = /** @class */ (function (_super) {
    __extends(GameCamera, _super);
    function GameCamera() {
        var _this = _super.call(this) || this;
        _this.transform.position.x = 0;
        _this.transform.position.y = 0;
        _this.camera = _this.addComponent(function () { return new Camera_1.Camera(); });
        return _this;
    }
    return GameCamera;
}(GameObject_1.GameObject));
exports.GameCamera = GameCamera;
//# sourceMappingURL=GameCamera.js.map