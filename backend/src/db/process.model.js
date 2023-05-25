module.exports = (mongoose) => {
    const dbModel = mongoose.model(
        'process',
        mongoose.Schema(
            {
                accountId: { type: String, default: '0.0.0' },
                token: {type: String, default: ''},
                price: { type: String, default: '' },
                coinSide: { type: String, default: '' },
                result: { type: String, default: '' },
                status: { type: String, default: '' },
                description: { type: String, default: '' },
            },
            { timestamps: true }
        )
    );
    return dbModel;
};
