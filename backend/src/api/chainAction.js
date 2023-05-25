require('dotenv').config('../.env');
const {
    AccountId,
    PrivateKey,
    TokenId,
    Client,
    NftId,
    Hbar,
    TransactionId,
    TransferTransaction,
} = require('@hashgraph/sdk');
const axios = require('axios');

const operatorId = AccountId.fromString(process.env.TREASURY_ID);
const operatorKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
// const client = Client.forMainnet()
//     .setOperator(operatorId, operatorKey)
//     .setDefaultMaxTransactionFee(new Hbar(50));

const receiveAllowance = async (senderId_r, amount_r, ftId_r, ftAmount_r, nftId_r, serialNum_r) => {
    console.log('receiveAllowance log - 1 : ', senderId_r, amount_r, ftId_r, ftAmount_r, nftId_r, serialNum_r);
    try {
        const client = Client.forMainnet()
            .setOperator(operatorId, operatorKey)
            .setDefaultMaxTransactionFee(new Hbar(50));

        let approvedSendTx = new TransferTransaction();
        if (amount_r > 0) {
            const sendBal = new Hbar(amount_r);
            approvedSendTx.addApprovedHbarTransfer(AccountId.fromString(senderId_r), sendBal.negated())
                .addHbarTransfer(operatorId, sendBal);
        }
        if (ftAmount_r > 0) {
            approvedSendTx.addApprovedTokenTransfer(TokenId.fromString(ftId_r), AccountId.fromString(senderId_r), -ftAmount_r)
                .addTokenTransfer(TokenId.fromString(ftId_r), operatorId, ftAmount_r);
        }
        if (serialNum_r > 0) {
            const nft = new NftId(TokenId.fromString(nftId_r), serialNum_r);
            approvedSendTx.addApprovedNftTransfer(nft, AccountId.fromString(senderId_r), operatorId);
        }
        approvedSendTx.setTransactionId(TransactionId.generate(operatorId)) // Spender must generate the TX ID or be the client
            .freezeWith(client);
        const approvedSendSign = await approvedSendTx.sign(operatorKey);
        const approvedSendSubmit = await approvedSendSign.execute(client);
        const approvedSendRx = await approvedSendSubmit.getReceipt(client);

        if (approvedSendRx.status._code != 22)
            return false;

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const sendCoin = async (receiverId_s, amount_s, ftId_s, ftAmount_s) => {
    console.log('sendCoin log - 1 : ', receiverId_s, amount_s, ftId_s, ftAmount_s);
    try {
        const client = Client.forMainnet()
            .setOperator(operatorId, operatorKey)
            .setDefaultMaxTransactionFee(new Hbar(50));

        const transferTx = await new TransferTransaction();
        if (amount_s > 0) {
            transferTx.addHbarTransfer(operatorId, new Hbar(-amount_s))
                .addHbarTransfer(AccountId.fromString(receiverId_s), new Hbar(amount_s));
        }
        if (ftAmount_s > 0) {
            transferTx.addTokenTransfer(TokenId.fromString(ftId_s), operatorId, -parseInt(ftAmount_s))
                .addTokenTransfer(TokenId.fromString(ftId_s), AccountId.fromString(receiverId_s), parseInt(ftAmount_s));
        }
        transferTx.freezeWith(client)
            .sign(operatorKey);
        const transferSubmit = await transferTx.execute(client);
        const transferRx = await transferSubmit.getReceipt(client);

        if (transferRx.status._code != 22)
            return false;

        return true;
    } catch (error) {
        console.log('sendCoin log - 2 : ', error);
        return false;
    }
}

const getAccountHbarBalance = async (accountId_g) => {
    console.log('getAccountHbarBalance log - 1 : ', accountId_g);
    try {
        const balanceInfo = await axios.get(`https://mainnet-public.mirrornode.hedera.com/api/v1/balances?account.id=${accountId_g}`);
        console.log('getAccountHbarBalance log - 2 : ', balanceInfo.data);
        if (balanceInfo.data?.balances?.length > 0) {
            return { result: true, data: changeToRealHbarBalance(balanceInfo.data.balances[0].balance) };
        }
        return { result: false, error: 'axios error!' };
    } catch (error) {
        return { result: false, error: error.message };
    }
}

const getAllowanceInfo = async (ownerId_g, spenderId_g) => {
    console.log('getAllowanceInfo log - 1 : ', ownerId_g, spenderId_g);
    try {
        const allowanceInfo = await axios.get(`https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/${ownerId_g}/allowances/crypto?spender.id=${spenderId_g}`);
        console.log('getAllowanceInfo log - 2 : ', allowanceInfo.data);
        if (allowanceInfo.data?.allowances?.length > 0) {
            return { result: true, data: changeToRealHbarBalance(allowanceInfo.data.allowances[0].amount_granted) };
        }
        return { result: false, error: 'no allowances!' };
    } catch (error) {
        return { result: false, error: error.message };
    }
}

const getAccountTokenBalance = async (accountId_g, tokenId_g) => {
    console.log('getAccountTokenBalance log - 1 : ', accountId_g, tokenId_g);
    try {
        const balanceInfo = await axios.get(`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenId_g}/balances?account.id=${accountId_g}`);
        console.log('getAccountTokenBalance log - 2 : ', balanceInfo.data);
        if (balanceInfo.data?.balances?.length > 0) {
            return { result: true, data: balanceInfo.data.balances[0].balance };
        }
        return { result: false, error: 'axios error!' };
    } catch (error) {
        return { result: false, error: error.message };
    }
}

const changeToRealHbarBalance = (balance_c) => {
    console.log('changeToRealHbarBalance log - 1 : ', balance_c);
    return parseFloat(balance_c) / 100000000;
}

module.exports = {
    receiveAllowance,
    sendCoin,
    getAccountHbarBalance,
    getAccountTokenBalance,
    getAllowanceInfo,
};