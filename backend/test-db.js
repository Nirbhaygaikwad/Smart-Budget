const mongoose = require('mongoose');
const Transaction = require('./model/Transaction');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mern-expenses', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Example function to test database operations
async function testDatabaseOperations() {
    try {
        // Example: Create a new transaction
        const newTransaction = new Transaction({
            user: '65f7c8b1e5c57dd59e37f123', // Replace with a valid user ID
            type: 'expense',
            category: 'Groceries',
            amount: 50.00,
            description: 'Weekly groceries'
        });

        // Save the transaction
        await newTransaction.save();
        console.log('Transaction saved:', newTransaction);

        // Example: Find all transactions
        const allTransactions = await Transaction.find();
        console.log('All transactions:', allTransactions);

        // Example: Find transactions by category
        const groceryTransactions = await Transaction.find({ category: 'Groceries' });
        console.log('Grocery transactions:', groceryTransactions);

        // Example: Calculate total expenses
        const expenses = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        console.log('Total expenses:', expenses[0]?.total || 0);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the test
testDatabaseOperations();
