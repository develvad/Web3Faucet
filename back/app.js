const express = require('express');
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const Web3 = require('web3');
const dotenv = require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to Test Network for Faucet.
const web3 = new Web3(process.env.TEST_NETWORK);

// Util: Hash Generator (MD5) to validate transactions
const hashGenerator = (data) => {
    const hash = crypto.createHash('md5').update(data).digest("hex");
    return hash;
}

// Ping
app.get('/ping', (req, res) => {
    res.send({date: new Date()})
});

app.get('/send/:account',  async (req, res) => {
    const signature = hashGenerator(req.params.account);
    const tx = await web3.eth.accounts.signTransaction(
    {
        to: req.params.account,
        from: process.env.FROM_ADDRESS,
        value:  web3.utils.toWei('10', 'ether'), // ETHERS: ethers.utils.parseEther("10").toHexString(),
        gas: 2000000
    }, '0x' + process.env.PRIVATE_KEY);
    const txSignSend = await web3.eth.sendSignedTransaction(
        tx.rawTransaction
    )
    res.send(
        { 
            signature,
            status: 'ok'
        }
    );
});

app.get('/balance/:account', async (req, res) => {
    const account = req.params.account;
    const signature = hashGenerator(account);
    console.log(account);
    try {
        const balance = await web3.eth.getBalance(account);
        const finalBalance = web3.utils.fromWei(balance) + ' ETH';
        console.log(finalBalance);
        res.send(
            { 
                signature,
                finalBalance
            }
        )
    } catch (error) {
        res.send(
            { 
                error
            }
        )
    }

});

app.listen(process.env.NODE_PORT || 3000, () => {
    console.log('Server started....');
}); // Seguimos en 1:08
