const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/pixelmind', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('[DB] MongoDB connected'))
  .catch(err => console.log('[DB] Connection error:', err));

// ========================
// DATABASE SCHEMAS
// ========================

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: String,
  plan: { type: String, enum: ['free', 'starter', 'pro', 'studio'], default: 'free' },
  credits: { type: Number, default: 10 },
  totalCreditsUsed: { type: Number, default: 0 },
  subscriptionActive: { type: Boolean, default: false },
  referralCode: String,
  referralEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const TransactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['payment', 'credits_used', 'refund', 'referral'], required: true },
  amount: Number,
  credits: Number,
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
  status: { type: String, enum: ['processing', 'success', 'failed'], default: 'success' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const EditHistory = mongoose.model('EditHistory', EditHistorySchema);

// ========================
// CREDIT COSTS
// ========================

const CREDIT_COSTS = {
  'text-to-image': 2,
  'background-remove': 1,
  'upscale': 2,
  'expand': 3,
  'prompt-edit': 2,
  'generative-fill': 2,
  'object-remove': 2,
  'background-ai': 2,
  'batch-processing': 5,
};

// ========================
// AUTHENTICATION MIDDLEWARE
// ========================

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-123');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ========================
// CREDIT CHECK MIDDLEWARE
// ========================

const creditCheckMiddleware = (toolName) => {
  return async (req, res, next) => {
    try {
      const cost = CREDIT_COSTS[toolName];
      const user = await User.findById(req.userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.credits < cost) {
        return res.status(402).json({ 
          error: 'Insufficient credits',
          required: cost,
          available: user.credits,
          action: 'upgrade'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

// ========================
// DEDUCT CREDITS FUNCTION
// ========================

const deductCredits = async (userId, credits, toolName) => {
  try {
    const user = await User.findById(userId);
    if (user.credits < credits) throw new Error('Insufficient credits');

    user.credits -= credits;
    user.totalCreditsUsed += credits;
    await user.save();

    await Transaction.create({
      userId,
      type: 'credits_used',
      credits,
      description: `${toolName} tool used`,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// ========================
// AUTH ROUTES
// ========================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      referralCode,
      credits: 10,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key-123');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key-123');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// USER ROUTES
// ========================

app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/history', authMiddleware, async (req, res) => {
  try {
    const history = await EditHistory.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// AI TOOL ROUTES
// ========================

// Text to Image
app.post('/api/tools/text-to-image', authMiddleware, creditCheckMiddleware('text-to-image'), async (req, res) => {
  try {
    const { prompt, style, size } = req.body;

    // Create edit record
    const editRecord = await EditHistory.create({
      userId: req.userId,
      tool: 'text-to-image',
      creditsCost: 2,
      prompt,
      settings: { style, size },
      status: 'processing',
    });

    // Deduct credits
    await deductCredits(req.userId, 2, 'Text-to-Image');

    // Placeholder: Call AI API (Replicate/similar)
    // Real implementation would call actual API
    const placeholderUrl = `https://via.placeholder.com/${size || '512x512'}?text=Generated+Image`;

    // Update record with result
    setTimeout(async () => {
      editRecord.outputImageUrl = placeholderUrl;
      editRecord.status = 'success';
      await editRecord.save();
    }, 1000);

    res.json({
      success: true,
      editId: editRecord._id,
      message: 'Image generation started',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Background Remove
app.post('/api/tools/background-remove', authMiddleware, creditCheckMiddleware('background-remove'), async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const editRecord = await EditHistory.create({
      userId: req.userId,
      tool: 'background-remove',
      inputImageUrl: imageUrl,
      creditsCost: 1,
      status: 'processing',
    });

    await deductCredits(req.userId, 1, 'Background Remove');

    const placeholderUrl = 'https://via.placeholder.com/512x512?text=No+Background';

    setTimeout(async () => {
      editRecord.outputImageUrl = placeholderUrl;
      editRecord.status = 'success';
      await editRecord.save();
    }, 1000);

    res.json({
      success: true,
      editId: editRecord._id,
      message: 'Background removal started',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upscale
app.post('/api/tools/upscale', authMiddleware, creditCheckMiddleware('upscale'), async (req, res) => {
  try {
    const { imageUrl, scale } = req.body;

    const editRecord = await EditHistory.create({
      userId: req.userId,
      tool: 'upscale',
      inputImageUrl: imageUrl,
      creditsCost: 2,
      settings: { scale },
      status: 'processing',
    });

    await deductCredits(req.userId, 2, 'Upscale');

    const placeholderUrl = `https://via.placeholder.com/1024x1024?text=Upscaled+${scale}x`;

    setTimeout(async () => {
      editRecord.outputImageUrl = placeholderUrl;
      editRecord.status = 'success';
      await editRecord.save();
    }, 1000);

    res.json({
      success: true,
      editId: editRecord._id,
      message: 'Upscaling started',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expand Image
app.post('/api/tools/expand', authMiddleware, creditCheckMiddleware('expand'), async (req, res) => {
  try {
    const { imageUrl, direction } = req.body;

    const editRecord = await EditHistory.create({
      userId: req.userId,
      tool: 'expand',
      inputImageUrl: imageUrl,
      creditsCost: 3,
      settings: { direction },
      status: 'processing',
    });

    await deductCredits(req.userId, 3, 'Expand');

    const placeholderUrl = 'https://via.placeholder.com/768x512?text=Expanded+Image';

    setTimeout(async () => {
      editRecord.outputImageUrl = placeholderUrl;
      editRecord.status = 'success';
      await editRecord.save();
    }, 1000);

    res.json({
      success: true,
      editId: editRecord._id,
      message: 'Image expansion started',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prompt Edit
app.post('/api/tools/prompt-edit', authMiddleware, creditCheckMiddleware('prompt-edit'), async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;

    const editRecord = await EditHistory.create({
      userId: req.userId,
      tool: 'prompt-edit',
      inputImageUrl: imageUrl,
      creditsCost: 2,
      prompt,
      status: 'processing',
    });

    await deductCredits(req.userId, 2, 'Prompt Edit');

    const placeholderUrl = 'https://via.placeholder.com/512x512?text=Prompt+Edited';

    setTimeout(async () => {
      editRecord.outputImageUrl = placeholderUrl;
      editRecord.status = 'success';
      await editRecord.save();
    }, 1000);

    res.json({
      success: true,
      editId: editRecord._id,
      message: 'Prompt editing started',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Edit Result
app.get('/api/tools/result/:editId', authMiddleware, async (req, res) => {
  try {
    const edit = await EditHistory.findById(req.params.editId);
    if (!edit) return res.status(404).json({ error: 'Not found' });

    res.json(edit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// PAYMENT ROUTES
// ========================

app.post('/api/payment/order', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;

    const plans = {
      starter: { price: 19900, credits: 300 },
      pro: { price: 49900, credits: 1000 },
      studio: { price: 99900, credits: 5000 },
    };

    if (!plans[plan]) return res.status(400).json({ error: 'Invalid plan' });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: plans[plan].price,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, plan } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const plans = {
      starter: { credits: 300 },
      pro: { credits: 1000 },
      studio: { credits: 5000 },
    };

    const user = await User.findById(req.userId);
    user.credits += plans[plan].credits;
    user.plan = plan;
    user.subscriptionActive = true;
    await user.save();

    await Transaction.create({
      userId: req.userId,
      type: 'payment',
      credits: plans[plan].credits,
      status: 'success',
      description: `${plan} plan purchased`,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ADMIN ROUTES
// ========================

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const totalUsers = await User.countDocuments();
    const totalCreditsUsed = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCreditsUsed' } } },
    ]);
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'payment', status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalUsers,
      totalCreditsUsed: totalCreditsUsed[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/user-credits/:userId', authMiddleware, async (req, res) => {
  try {
    const { credits } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.credits += credits;
    await user.save();

    res.json({ success: true, credits: user.credits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// SERVER START
// ========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] PixelMind API running on port ${PORT}`);
});
