hash = require('farmhash')

class Bloom {
    constructor(expected_items=100, false_positive=0.01) {
        this.bits_per_item = this._bits_per_item(false_positive)
        this.len = expected_items * this.bits_per_item
        this.hashes = Math.ceil(0.7 * this.bits_per_item)
        this.bits = Array(this.len).fill(0)
        this.farmhash = farmhash
    }

    insert(item) {
        if (Array.isArray(item)) {
            item.forEach(i => {
                this.insert(i)
            })
        } else {
            const hl = this.hash(item)
            hl.forEach( h => {
            this.bits[h] = 1
            })
        }
    }

    has(item) {
        const hl = this.hash(item)
        hl.forEach(h => {
            if (this.bits[h] === 0) {
                return false
            }
        })
        return true
    }

    does_not_have(item) {
        const hl = this.hash(item)
        hl.forEach(h => {
            if (this.bits[h] === 1) {
                return false
            }
        })
        return true
    }

    hash(item) {
        if (typeof item === 'string') {
            return this._hashes(item)
        } else if (typeof item === 'number') {
            return this.hash(String(item))
        }
    }

    _hashes(item) {
        const h1 = this.farmhash.hash32WithSeed(item, 1)
        const h2 = this.farmhash.hash32WithSeed(item, 2)
        let hashes = [(h1 % this.len), (h2 % this.len)]
        while (hashes.length < this.hashes) {
            hashes.push(this._combine(hashes[hashes.length - 1], hashes[hashes.length - 2]))
        }
        return hashes
    }


    _combine(hash1, hash2) {
        return ((hash1 + hash2) % this.len)
    }

    _bits_per_item(false_pos) {
        return Math.ceil(Math.log(100/false_pos)/(Math.log(2)**2))
    }
}

module.exports = Bloom;
