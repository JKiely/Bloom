"use strict";
exports.__esModule = true;
var bloom_factory_js_1 = require("../lib/bloom_factory.js");
var chai_1 = require("chai");
require("mocha");
describe('Bloom', function () {
    describe('should be able to', function () {
        var bloom;
        beforeEach(function (done) {
            bloom = new bloom_factory_js_1.Bloom();
            done();
        });
        it('add an item and remember it', function () {
            bloom.insert('hi');
            chai_1.expect(bloom.has('hi')).to.be["true"];
        });
        it('know that it does not have an item', function () {
            chai_1.expect(bloom.does_not_have('hello')).to.be["true"];
        });
        it('add a list and remember them all', function () {
            bloom.insert(['hi', 'hello', 'hey']);
            chai_1.expect(bloom.has('hi')).to.be["true"];
            chai_1.expect(bloom.has('hello')).to.be["true"];
            chai_1.expect(bloom.has('hey')).to.be["true"];
        });
        it('add a number', function () {
            bloom.insert(7);
            chai_1.expect(bloom.has(7)).to.be["true"];
        });
    });
});
