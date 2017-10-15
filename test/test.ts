import { Bloom } from '../lib/bloom_factory.js';
import { expect } from 'chai';
import 'mocha';

describe('Bloom', function() {
    describe('should be able to', function() {
        let bloom: Bloom;

        beforeEach(function(done) {
            bloom = new Bloom();
            done()
        })

        it('add an item and remember it', function() {
            bloom.insert('hi');
            expect(bloom.has('hi')).to.be.true;
        });

        it('know that it does not have an item', function() {
            expect(bloom.does_not_have('hello')).to.be.true;
        });

        it('add a list and remember them all', function() {
            bloom.insert(['hi','hello','hey']);
            expect(bloom.has('hi')).to.be.true;
            expect(bloom.has('hello')).to.be.true;
            expect(bloom.has('hey')).to.be.true;
        });

        it('add a number', function() {
            bloom.insert(7)
            expect(bloom.has(7)).to.be.true;
        });

    });
});

