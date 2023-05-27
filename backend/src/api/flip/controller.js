require('dotenv').config('../.env');
const {  History  } = require('../../db');


exports.getHistory = async (req, res) => {
    console.log('getHistory log - 1 : ', req.query);
    try {
        const getTop10Result = await History.find({}, { })
            .sort({ _id:-1 }).limit(5);
        console.log('getHistory log - 2 : ', getTop10Result);
        return res.send({ result: true, data: getTop10Result });
    } catch (error) {
        return res.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.setHistory = async (req, res) => {

    console.log('sendOffer log - 1 : ', req.body);

    const newHistory = new History({
        accountId: req.body.walletAddress,
        betType: req.body.betType,
        betAmount: req.body.betAmount,
        win: req.body.win
    });

    const createResult = await newHistory.save();
    console.log('updateHistory log - 3 : ', createResult);
    if (!createResult) {
        return { result: false };
    }

    return { result: true, data: createResult };
}

