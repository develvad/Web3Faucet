const express = require('express');
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const Web3 = require('web3');
const dotenv = require('dotenv').config();
const cors = require('cors');

// START APP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
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
    const account = req.params.account;
    console.log('account: ', account);
    const signature = hashGenerator(account);
    const statusError = {
        isError: false,
        error: ''
    };
    if (web3.utils.isAddress(account)) {
        try {
            const tx = await web3.eth.accounts.signTransaction(
                {
                    to: account,
                    from: process.env.FROM_ADDRESS,
                    value:  web3.utils.toWei('10', 'ether'),
                    gas: 2000000
                }, '0x' + process.env.PRIVATE_KEY);
                const txSignSend = await web3.eth.sendSignedTransaction(
                    tx.rawTransaction
                )
                const balance = await web3.eth.getBalance(account);
                const ammount = web3.utils.fromWei(balance) + ' ETH';
                res.status(200).send({ signature, ammount, status: 'ok' });
            } catch(e) {
               statusError.isError = true;
               statusError.error = e;
               res.status(500).send({error: statusError.error});

            }
    } else {
        statusError.isError = true;
        statusError.error = 'NOT VALID 0xAddress';
        res.status(500).send({error: statusError.error});
    }

});

app.get('/balance/:account', async (req, res) => {
    const account = req.params.account;
    const signature = hashGenerator(account);
    console.log(account);
    try {
        const balance = await web3.eth.getBalance(account);
        const finalBalance = web3.utils.fromWei(balance) + ' ETH';
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
