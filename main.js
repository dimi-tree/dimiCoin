const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    /*

    Proof-of-Work
        This this mechanism you have to prove that you've put a lot of computing power
    into making a block. This process is also called mining.
        E.g. bitcoin requires the hash of a block to begin with a certain amount of zeros.
    And because you cannot influence the output of a hash function, you simply have to try
    a lot of combinations and hope you get lucky with the hash that has a sufficient number
    of zeros in front of it.

    */
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        // console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(0, "2021-01-01", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        
        return true;
    }
}

exports.Block = Block;
exports.Blockchain = Blockchain;
// let dimiCoin = new Blockchain();

// console.log("Mining block 1...");
// dimiCoin.addBlock(new Block(1, "2021-01-28", { amount: 4 }));

// console.log("Mining block 2...");
// dimiCoin.addBlock(new Block(2, "2021-02-14", { amount: 10 }));

// console.log("Is blockchain valid? " + dimiCoin.isChainValid());

// dimiCoin.chain[1].data = { amount: 100 };

// console.log("Is blockchain valid? " + dimiCoin.isChainValid());

// dimiCoin.chain[1].data = { amount: 100 };
// dimiCoin.chain[1].hash = dimiCoin.chain[1].calculateHash();

// console.log("Is blockchain valid? " + dimiCoin.isChainValid());

// console.log(JSON.stringify(dimiCoin, null, 4));
