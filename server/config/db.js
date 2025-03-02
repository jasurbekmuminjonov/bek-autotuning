const mongoose = require('mongoose');
exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongodb connected");
    } catch (e) {
        console.error(`Mongodb error: ${e.message}`);
        process.exit(1);
    }
}
