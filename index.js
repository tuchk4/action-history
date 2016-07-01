'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _history = Symbol('history');
var _limit = Symbol('limit');

var getTime = function getTime() {
  return new Date().getTime();
};

var ActionStep = function () {
  function ActionStep(tag, details) {
    _classCallCheck(this, ActionStep);

    this.id = _guid2.default.create().value;
    this.createTime = getTime();

    this.tag = tag;
    this.details = details;
  }

  _createClass(ActionStep, [{
    key: 'toPlain',
    value: function toPlain() {
      var plain = {
        id: this.id,
        tag: this.tag,
        details: this.details,
        createTime: this.createTime
      };

      if (this.stepsTime) {
        plain.stepsTime = this.stepsTime;
      }

      if (this.sequence && this.sequence.length) {
        var sequence = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.sequence[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var step = _step.value;

            sequence.push(step.toPlain());
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        plain.sequence = sequence;
      }

      if (this.sequenceTag) {
        plain.sequenceTag = this.sequenceTag;
      }

      return plain;
    }
  }]);

  return ActionStep;
}();

exports.default = ActionStep;

var ActionHistory = function () {
  function ActionHistory() {
    var limit = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

    _classCallCheck(this, ActionHistory);

    this[_history] = [];
    this[_limit] = limit;
  }

  _createClass(ActionHistory, [{
    key: 'toArray',
    value: function toArray() {
      var history = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this[_history][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var step = _step2.value;

          history.push(step.toPlain());
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return history;
    }
  }, {
    key: 'add',
    value: function add(tag) {
      var details = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var step = new ActionStep(tag, details);
      this[_history].push(step);

      if (this[_history].length > this[_limit]) {
        this[_history] = this[_history].slice(0, this[_history].length > -this[_limit]);
      }

      return step;
    }
  }, {
    key: 'sequence',
    value: function sequence() {
      var _this = this;

      var sequenceTag = arguments.length <= 0 || arguments[0] === undefined ? 'empty sequence tag' : arguments[0];

      var steps = [];
      return function (tag) {
        var details = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var step = _this.add(tag, details);
        step.sequence = [];
        step.sequenceTag = sequenceTag;

        var time = getTime();

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = steps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var previous = _step3.value;

            previous.sequence.push(step);
            if (!previous.stepsTime) {
              previous.stepsTime = {};
            }

            previous.stepsTime = _extends({}, previous.stepsTime, _defineProperty({}, tag, time - previous.createTime));
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        steps.push(step);
      };
    }
  }]);

  return ActionHistory;
}();

exports.default = ActionHistory;