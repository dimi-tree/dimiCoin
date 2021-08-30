const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.pendingTransactions = [];
        this.minigReward = 100;  // coins if you successfully mine a new block
    }

    createGenesisBlock(){
        return new Block("2021-01-01", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        // Reset pendingTransactions
        // and transfer the reward to the miner
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.minigReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
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
let dimiCoin = new Blockchain();
dimiCoin.createTransaction(new Transaction('address1', 'address2', 100));
dimiCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\nStarting the miner...");
dimiCoin.minePendingTransactions('dimitris-address');

console.log("\nBalance of Dimitri is", dimiCoin.getBalanceOfAddress('dimitris-address'));

console.log("\nMining another block...");
dimiCoin.minePendingTransactions('dimitris-address');

console.log("\nBalance of Dimitri is", dimiCoin.getBalanceOfAddress('dimitris-address'));


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
