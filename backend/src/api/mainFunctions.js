require('dotenv').config('../.env');
const { Status, Process, History } = require('../db');
const { FLIP_SUCCESS_PERCENT, FLIP_SUCCESS_PERCENT_OFFSET, HEAD_COIN_SIDE, TAIL_COIN_SIDE, AVAILABLE_COINS, MINIUM_TREASURY_AMOUNT } = require('../default/value');
const { getAccountHbarBalance, getAccountTokenBalance } = require('./chainAction');

const checkStatus = async (tokenSymbol_c) => {
    try {
        const existCheckResult = await Status.findOne({ token: tokenSymbol_c });
        console.log('checkStatus log - 1 : ', existCheckResult);
        if (existCheckResult === null) {
            // add to db
            const newStatus = new Status({
                token: tokenSymbol_c,
                earnAmount: 0,
                totalFlipCount: 0,
                totalWinsCount: 0,
                chooseHeadCount: 0,
                headWinsCount: 0,
                chooseTailCount: 0,
                tailWinsCount: 0,
            })

            const createResult = await newStatus.save();
            console.log('checkStatus log - 2 : ', createResult);
            if (!createResult) {
                return { result: false };
            }

            return { result: true, data: createResult };
        }

        return { result: true, data: existCheckResult };
    } catch (error) {
        return { result: false };
    }
}

const updateProcess = async (processId_u, value_u) => {
    console.log('updateProcess log - 1 : ', processId_u);
    try {
        const updateResult = await Process.updateOne({ _id: processId_u }, value_u);
        console.log('updateProcess log - 2 : ', updateResult);
        if (!updateResult) {
            return { result: false };
        }

        return { result: true, data: updateResult };
    } catch (error) {
        return { result: false };
    }
}

const updateHistory = async (accountId_u, flipResult_u) => {
    console.log('updateHistory log - 1 : ', accountId_u);
    try {
        const existCheckResult = await History.findOne({ accountId: accountId_u });
        console.log('updateHistory log - 2 : ', existCheckResult);
        if (existCheckResult === null) {
            const newHistory = new History({
                accountId: accountId_u,
                flipCount: 1,
                winsCount: flipResult_u ? 1 : 0
            });

            const createResult = await newHistory.save();
            console.log('updateHistory log - 3 : ', createResult);
            if (!createResult) {
                return { result: false };
            }

            return { result: true, data: createResult };
        }

        const updateResult = await History.updateOne({ accountId: accountId_u }, {
            $inc: { flipCount: 1, winsCount: flipResult_u ? 1 : 0 }
        });
        console.log('updateHistory log - 4 : ', updateResult);
        if (!updateResult) {
            return { result: false };
        }

        return { result: true, data: updateResult };
    } catch (error) {
        return { result: false };
    }
}

const updateStatus = async (tokenSymbol_u, betPrice_u, flipResult_u, coinSide_u) => {
    console.log('updateStatus log - 1 : ', tokenSymbol_u, betPrice_u, flipResult_u, coinSide_u);
    try {
        const getStatus = await checkStatus(tokenSymbol_u);
        console.log('updateStatus log - 2 : ', getStatus);
        if (!getStatus.result) {
            return { result: false };
        }
        const currentStatus = getStatus.data;

        const updateResult = await Status.updateOne({ token: tokenSymbol_u }, {
            earnAmount: currentStatus.earnAmount - (flipResult_u ? betPrice_u : -betPrice_u),
            totalFlipCount: currentStatus.totalFlipCount + 1,
            totalWinsCount: currentStatus.totalWinsCount + (flipResult_u ? 1 : 0),
            chooseHeadCount: currentStatus.chooseHeadCount + (coinSide_u === HEAD_COIN_SIDE ? 1 : 0),
            headWinsCount: currentStatus.headWinsCount + (flipResult_u && coinSide_u === HEAD_COIN_SIDE ? 1 : 0),
            chooseTailCount: currentStatus.chooseTailCount + (coinSide_u === TAIL_COIN_SIDE ? 1 : 0),
            tailWinsCount: currentStatus.tailWinsCount + (flipResult_u && coinSide_u === TAIL_COIN_SIDE ? 1 : 0),
        })
        console.log('updateStatus log - 3 : ', updateResult);
        if (!updateResult) {
            return { result: false };
        }

        return { result: true, data: updateResult };
    } catch (error) {
        return { result: false };
    }
}

const generateFlipResult = async (restBalance_g, betPrice_g, tokenNo_g, coinSide_g) => {
    console.log('generateFlipResult log - 1 : ', restBalance_g, betPrice_g, tokenNo_g);

    // check treasury balance
    if (tokenNo_g === 0) {
        const treasuryBalance = await getAccountHbarBalance(process.env.TREASURY_ID);
        console.log('generateFlipResult log - 2 : ', treasuryBalance);
        if (!treasuryBalance.result) {
            return false;
        }

        if (parseFloat(treasuryBalance.data) - parseFloat(betPrice_g) <= MINIUM_TREASURY_AMOUNT) {
            console.log('generateFlipResult log - 3 : ', treasuryBalance.data, betPrice_g);
            return false;
        }
    } else {
        const treasuryBalance = await getAccountTokenBalance(process.env.TREASURY_ID, AVAILABLE_COINS[tokenNo_g].tokenId);
        console.log('generateFlipResult log - 4 : ', treasuryBalance);
        if (!treasuryBalance.result) {
            return false;
        }

        if (parseFloat(treasuryBalance.data) - parseFloat(betPrice_g) <= MINIUM_TREASURY_AMOUNT) {
            console.log('generateFlipResult log - 5 : ', treasuryBalance.data, betPrice_g);
            return false;
        }
    }
    // console.log('generateFlipResult log - 6 : ', restBalance_g, betPrice_g);
    // if (parseFloat(restBalance_g) - parseFloat(betPrice_g) <= MINIUM_TREASURY_AMOUNT)
    //     return false;

    console.log('generateFlipResult log - 7 ');
    if (parseInt(Math.random() * 100000000) % 100 < FLIP_SUCCESS_PERCENT + (coinSide_g != HEAD_COIN_SIDE ? 0 : FLIP_SUCCESS_PERCENT_OFFSET))
        return true;
    return false;
}

module.exports = {
    checkStatus,
    updateProcess,
    updateHistory,
    updateStatus,
    generateFlipResult,
};