const mongoose = require('mongoose');

// Reuse the connection across serverless invocations
let connectionPromise = null;

const dbConnect = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    if (!connectionPromise) {
        mongoose.set('strictQuery', false);

        const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expenses-tracker';

        connectionPromise = mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((conn) => {
            console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
            return conn.connection;
        }).catch((error) => {
            connectionPromise = null;
            console.error('MongoDB connection error:', error);
            throw error;
        });
    }

    return connectionPromise;
};

module.exports = dbConnect;
