var farmhash = {}

abstract class hasher {
    hash: any;
    len: number;
    num_hashes: number;

    constructor(bits_per_item: number, array_len: number) {
        this.hash = farmhash
        this.len = array_len
        this.num_hashes = Math.ceil(0.7 * bits_per_item)
    }

    hashes(item:string): number[] {
        const h1 = this.hash.hash32WithSeed(item, 1)
        const h2 = this.hash.hash32WithSeed(item, 2)
        let hash_list = [(h1 % this.len), (h2 % this.len)]
        while (hash_list.length < this.num_hashes) {
            hash_list.push(this.combine(hash_list[hash_list.length - 1], hash_list[hash_list.length - 2]))
        }
        return hash_list
    }

    private combine(h1:number, h2:number): number {
        return ((h1 + h2) % this.len)
    }
}

class BloomFactory extends hasher {
    num_items: number;
    len: number;
    bits: number[];

    constructor(items:string[], false_positive:number = 0.01) {
        const bits_per_item = Math.ceil(Math.log(100/false_positive)/(Math.log(2)**2))
        const num_items = items.length;
        const len = num_items * bits_per_item;
        super(bits_per_item, len)
        this.bits = this.trained_array(items, this.len);
    }

    create(): Bloom {
       return new Bloom(this.bits)
    }

    private calc_bits_per_item(false_positive:number): number {
        return Math.ceil(Math.log(100/false_positive)/(Math.log(2)**2))
    }

    private trained_array(items:string[], len:number): number[] {
        const array = this.get_empty_array(len)
        items.forEach(item => {
            this.train(array, item)
        })
        return array
    }

    private train(array:number[], item:string) {
        const hashes = this.hashes(item)
    }
}

class Bloom extends hasher {
    constructor(bits:number[]) {
        bits = bits
    }
}


