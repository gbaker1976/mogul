define(["exports", "app", "view"], function (exports, _app, _view) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Mogul = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Mogul = exports.Mogul = function () {
        function Mogul() {
            _classCallCheck(this, Mogul);
        }

        _createClass(Mogul, null, [{
            key: "View",
            get: function get() {
                return _view.View;
            }
        }]);

        return Mogul;
    }();

    ;
});