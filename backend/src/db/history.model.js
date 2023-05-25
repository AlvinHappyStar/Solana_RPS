module.exports = (mongoose) => {
    const dbModel = mongoose.model(
        'history',
        mongoose.Schema(
            {
                accountId: { type: String, default: '0.0.0' },
                flipCount: { type: Number, default: 0 },
                winsCount: { type: Number, default: 0 },
                description: { type: String, default: '' },
            },
            { timestamps: true }
        )
    );
    return dbModel;
};
