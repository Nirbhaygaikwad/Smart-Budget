const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  }
}, {
  timestamps: true
});

// One budget per category per month for each user
budgetSchema.index({ user: 1, month: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
