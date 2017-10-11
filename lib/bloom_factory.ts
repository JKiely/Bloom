import * as farmhash from 'farmhash';

export class Bloom {
    bits_per_item: number;
    len: number;
    hashes: number;
    bits: number[];
    farmhash: any;

    constructor(expected_items: number = 100, false_positive: number = 0.01) {
        this.bits_per_item = this._bits_per_item(false_positive)
        this.len = expected_items * this.bits_per_item
        this.hashes = Math.ceil(0.7 * this.bits_per_item)
        this.bits = Array(this.len).map(Number.prototype.valueOf, 0)
        this.farmhash = farmhash
    }

    public insert(item: any) {
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

    public has(item: any): boolean {
        const hl = this.hash(item)
        hl.forEach(h => {
            if (this.bits[h] === 0) {
                return false
            }
        })
        return true
    }

    public does_not_have(item: any): boolean {
        const hl = this.hash(item)
        hl.forEach(h => {
            if (this.bits[h] === 1) {
                return false
            }
        })
        return true
    }

    private hash(item: any): number[] {
        if (typeof item === 'string') {
            return this._hashes(item)
        } else if (typeof item === 'number') {
            return this.hash(String(item))
        }
    }

    private _hashes(item: string): number[] {
        const h1 = this.farmhash.hash32WithSeed(item, 1)
        const h2 = this.farmhash.hash32WithSeed(item, 2)
        let hashes = [(h1 % this.len), (h2 % this.len)]
        while (hashes.length < this.hashes) {
            hashes.push(this._combine(hashes[hashes.length - 1], hashes[hashes.length - 2]))
        }
        return hashes
    }

    private _combine(hash1: number, hash2: number): number {
        return ((hash1 + hash2) % this.len)
    }

    private _bits_per_item(false_pos: number): number {
        return Math.ceil(Math.log(100/false_pos)/(Math.log(2)**2))
    }
}

