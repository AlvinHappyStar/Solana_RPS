module.exports = (mongoose) => {
    const dbModel = mongoose.model(
        'history',
        mongoose.Schema(
            {
                accountId: { type: String, default: '' },
                betType: { type: String, default: '' },
                betAmount: { type: Number, default: 0 },
                win: { type: Number, default: 0 },
            },
            { timestamps: true }
        )
    );
    return dbModel;
};
