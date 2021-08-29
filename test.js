const assert = require( "assert" );
const mycode = require( "./main" );

let block;
let dimiCoin;

describe("Block Test", () => {

    it("check block mining", () => {
        block = new mycode.Block(1, "2021-01-28", { amount: 4 });
        block.mineBlock(2);
        assert.equal(block.hash.substring(0, 2), "00");
    });
})

describe("BlockChain Test", () => {

    beforeEach(() => {
        dimiCoin = new mycode.Blockchain();
        dimiCoin.addBlock(new mycode.Block(1, "2021-01-28", { amount: 4 }));
        dimiCoin.addBlock(new mycode.Block(2, "2021-02-14", { amount: 10 }));
    });

    it("check blockchain is valid", () => {
        assert.equal(dimiCoin.isChainValid(), true);
    });

    it("check blockchain is invalid when data has been tampered with", () => {
        dimiCoin.chain[1].data = { amount: 100 };
        assert.equal(dimiCoin.isChainValid(), false);
    });

    it("check blockchain is invalid when data has been tampered with and hash re-calculated", () => {
        dimiCoin.chain[1].data = { amount: 100 };
        dimiCoin.chain[1].hash = dimiCoin.chain[1].calculateHash();
        assert.equal(dimiCoin.isChainValid(), false);
    });
})
