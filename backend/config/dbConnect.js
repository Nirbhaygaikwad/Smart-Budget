const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        
        const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expenses-tracker';
        console.log('Connecting to MongoDB:', connectionString);
        
        const conn = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        
        // Test the connection by trying to get the collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = dbConnect;
