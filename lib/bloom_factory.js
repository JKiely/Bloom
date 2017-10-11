var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var farmhash = {};
var hasher = /** @class */ (function () {
    function hasher(bits_per_item, array_len) {
        this.hash = farmhash;
        this.len = array_len;
        this.num_hashes = Math.ceil(0.7 * bits_per_item);
    }
    hasher.prototype.hashes = function (item) {
        var h1 = this.hash.hash32WithSeed(item, 1);
        var h2 = this.hash.hash32WithSeed(item, 2);
        var hash_list = [(h1 % this.len), (h2 % this.len)];
        while (hash_list.length < this.num_hashes) {
            hash_list.push(this.combine(hash_list[hash_list.length - 1], hash_list[hash_list.length - 2]));
        }
        return hash_list;
    };
    hasher.prototype.combine = function (h1, h2) {
        return ((h1 + h2) % this.len);
    };
    return hasher;
}());
var BloomFactory = /** @class */ (function (_super) {
    __extends(BloomFactory, _super);
    function BloomFactory(items, false_positive) {
        if (false_positive === void 0) { false_positive = 0.01; }
        var _this = this;
        var bits_per_item = Math.ceil(Math.log(100 / false_positive) / (Math.pow(Math.log(2), 2)));
        var num_items = items.length;
        var len = num_items * bits_per_item;
        _this = _super.call(this, bits_per_item, len) || this;
        _this.bits = _this.trained_array(items, _this.len);
        return _this;
    }
    BloomFactory.prototype.create = function () {
        return new Bloom(this.bits);
    };
    BloomFactory.prototype.calc_bits_per_item = function (false_positive) {
        return Math.ceil(Math.log(100 / false_positive) / (Math.pow(Math.log(2), 2)));
    };
    BloomFactory.prototype.trained_array = function (items, len) {
        var _this = this;
        var array = this.get_empty_array(len);
        items.forEach(function (item) {
            _this.train(array, item);
        });
        return array;
    };
    BloomFactory.prototype.train = function (array, item) {
        var hashes = this.hashes(item);
    };
    return BloomFactory;
}(hasher));
var Bloom = /** @class */ (function (_super) {
    __extends(Bloom, _super);
    function Bloom(bits) {
        var _this = this;
        bits = bits;
        return _this;
    }
    return Bloom;
}(hasher));
