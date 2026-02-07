const mongoose = require('mongoose');
require('dotenv').config();

const MongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/pixelmind';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MongoDB_URI);
    console.log('✓ Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      fullName: String,
      profileImage: String,
      plan: { type: String, enum: ['free', 'starter', 'pro', 'studio'], default: 'free' },
      credits: { type: Number, default: 10 },
      totalCreditsUsed: { type: Number, default: 0 },
      razorpayCustomerId: String,
      subscriptionId: String,
      subscriptionActive: { type: Boolean, default: false },
      nextBillingDate: Date,
      editHistory: [{
        tool: String,
        timestamp: Date,
        imageUrl: String,
        creditsCost: Number,
      }],
      createdAt: { type: Date, default: Date.now },
      lastCreditResetDate: { type: Date, default: Date.now },
    });

    const TransactionSchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      type: { type: String, enum: ['payment', 'credits_used', 'refund', 'monthly_reset'], required: true },
      amount: Number,
      credits: Number,
      razorpayPaymentId: String,
      razorpayOrderId: String,
      status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
      description: String,
      createdAt: { type: Date, default: Date.now },
    });

    const EditHistorySchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      tool: String,
      inputImageUrl: String,
      outputImageUrl: String,
      creditsCost: Number,
      prompt: String,
      settings: mongoose.Schema.Types.Mixed,
      replicateTaskId: String,
      status: { type: String, enum: ['processing', 'success', 'failed'], default: 'processing' },
      createdAt: { type: Date, default: Date.now },
      completedAt: Date,
    });

    // Create models
    const User = mongoose.model('User', UserSchema);
    const Transaction = mongoose.model('Transaction', TransactionSchema);
    const EditHistory = mongoose.model('EditHistory', EditHistorySchema);

    // Create indexes
    console.log('Creating indexes...');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Transaction.collection.createIndex({ userId: 1, createdAt: -1 });
    await EditHistory.collection.createIndex({ userId: 1, createdAt: -1 });
    console.log('✓ Indexes created');

    // Create demo user (optional)
    const demoUserExists = await User.findOne({ email: 'demo@example.com' });
    if (!demoUserExists) {
      console.log('Creating demo user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('demo1234', 10);
      await User.create({
        email: 'demo@example.com',
        password: hashedPassword,
        fullName: 'Demo User',
        credits: 50,
        plan: 'pro',
        subscriptionActive: true,
      });
      console.log('✓ Demo user created (demo@example.com / demo1234)');
    }

    console.log('\n✓ Database initialization complete!');
    console.log('\nCollections:');
    console.log('  - User');
    console.log('  - Transaction');
    console.log('  - EditHistory');

    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
