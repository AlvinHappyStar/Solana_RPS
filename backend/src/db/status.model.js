module.exports = (mongoose) => {
    const dbModel = mongoose.model(
        'status',
        mongoose.Schema(
            {
                token: { type: String, default: '' },
                earnAmount: { type: Number, default: 0 },
                totalFlipCount: { type: Number, default: 0 },
                totalWinsCount: { type: Number, default: 0 },
                chooseHeadCount: { type: Number, default: 0 },
                headWinsCount: { type: Number, default: 0 },
                chooseTailCount: { type: Number, default: 0 },
                tailWinsCount: { type: Number, default: 0 },
                description: { type: String, default: '' },
            },
            { timestamps: true }
        )
    );
    return dbModel;
};
