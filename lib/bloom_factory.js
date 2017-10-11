"use strict";
exports.__esModule = true;
var farmhash = require("farmhash");
var Bloom = /** @class */ (function () {
    function Bloom(expected_items, false_positive) {
        if (expected_items === void 0) { expected_items = 100; }
        if (false_positive === void 0) { false_positive = 0.01; }
        this.bits_per_item = this._bits_per_item(false_positive);
        this.len = expected_items * this.bits_per_item;
        this.hashes = Math.ceil(0.7 * this.bits_per_item);
        this.bits = Array(this.len).map(Number.prototype.valueOf, 0);
        this.farmhash = farmhash;
    }
    Bloom.prototype.insert = function (item) {
        var _this = this;
        if (Array.isArray(item)) {
            item.forEach(function (i) {
                _this.insert(i);
            });
        }
        else {
            var hl = this.hash(item);
            hl.forEach(function (h) {
                _this.bits[h] = 1;
            });
        }
    };
    Bloom.prototype.has = function (item) {
        var _this = this;
        var hl = this.hash(item);
        hl.forEach(function (h) {
            if (_this.bits[h] === 0) {
                return false;
            }
        });
        return true;
    };
    Bloom.prototype.does_not_have = function (item) {
        var _this = this;
        var hl = this.hash(item);
        hl.forEach(function (h) {
            if (_this.bits[h] === 1) {
                return false;
            }
        });
        return true;
    };
    Bloom.prototype.hash = function (item) {
        if (typeof item === 'string') {
            return this._hashes(item);
        }
        else if (typeof item === 'number') {
            return this.hash(String(item));
        }
    };
    Bloom.prototype._hashes = function (item) {
        var h1 = this.farmhash.hash32WithSeed(item, 1);
        var h2 = this.farmhash.hash32WithSeed(item, 2);
        var hashes = [(h1 % this.len), (h2 % this.len)];
        while (hashes.length < this.hashes) {
            hashes.push(this._combine(hashes[hashes.length - 1], hashes[hashes.length - 2]));
        }
        return hashes;
    };
    Bloom.prototype._combine = function (hash1, hash2) {
        return ((hash1 + hash2) % this.len);
    };
    Bloom.prototype._bits_per_item = function (false_pos) {
        return Math.ceil(Math.log(100 / false_pos) / (Math.pow(Math.log(2), 2)));
    };
    return Bloom;
}());
exports.Bloom = Bloom;
