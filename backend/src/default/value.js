// status
exports.AVAILABLE_COINS = [
    {
        tokenName: '',
        tokenSymbol: 'Hbar',
        imageUrl: 'https://wallet.hashpack.app/assets/tokens/hbar.svg',
        tokenId: '',
        decimals: 8,
    },
    {
        tokenName: 'SAUCE',
        tokenSymbol: 'SAUCE',
        imageUrl: 'https://wallet.hashpack.app/assets/tokens/sauce.svg',
        tokenId: '0.0.731861',
        decimals: 6,
    },
    {
        tokenName: 'HeliSwap',
        tokenSymbol: 'HELI',
        imageUrl: 'https://app.heliswap.io/logo.svg',
        tokenId: '0.0.1937609',
        decimals: 8,
    },
];

// process
exports.COIN_FLIP_RESULT_WIN = 'win';
exports.COIN_FLIP_RESULT_LOSE = 'lose';
exports.COIN_FLIP_RESULT_PENDING = 'pending';

exports.COIN_FLIP_STATUS_START = 'start';
exports.COIN_FLIP_STATUS_FLIPPED = 'flipped';
exports.COIN_FLIP_STATUS_CHANGE_DB = 'changeDB';
exports.COIN_FLIP_STATUS_SUCCESS = 'success';

exports.HEAD_COIN_SIDE = 'head';
exports.TAIL_COIN_SIDE = 'tail';

exports.FLIP_SUCCESS_PERCENT = 50;
exports.FLIP_SUCCESS_PERCENT_OFFSET = 1;

// percent
exports.WINNER_REWARD_PERCENT = 0.975;
exports.MANAGER_REWARD_PERCENT = 0.00375;
exports.DEV_REWARD_PERCENT = 0.00375;
exports.REMAIN_REWARD_PERCENT = 0.0175;

exports.MINIUM_TREASURY_AMOUNT = 30000;