const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelmind', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ===== DATABASE SCHEMAS =====

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  credits: { type: Number, default: 10 },
  plan: { type: String, enum: ['free', 'starter', 'pro', 'studio'], default: 'free' },
  subscriptionActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const editSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'success', 'failed'], default: 'pending' },
  creditsCost: { type: Number, required: true },
  inputImageUrl: String,
  outputImageUrl: String,
  prompt: String,
  parameters: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Edit = mongoose.model('Edit', editSchema);

// ===== MIDDLEWARE =====

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const checkCredits = (requiredCredits) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.credits < requiredCredits) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: requiredCredits,
          available: user.credits,
        });
      }
      req.user.credits = user.credits;
      next();
    } catch (err) {
      res.status(500).json({ error: 'Error checking credits' });
    }
  };
};

// ===== AUTHENTICATION ROUTES =====

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      credits: 10,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        credits: user.credits,
        plan: user.plan,
        subscriptionActive: user.subscriptionActive,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        credits: user.credits,
        plan: user.plan,
        subscriptionActive: user.subscriptionActive,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ===== USER ROUTES =====

app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/api/user/history', verifyToken, async (req, res) => {
  try {
    const edits = await Edit.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(edits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ===== AI TOOL ROUTES =====

const TOOL_COSTS = {
  'text-to-image': 2,
  'background-remove': 1,
  'upscale': 2,
  'expand': 3,
  'prompt-edit': 2,
  'generative-fill': 2,
};

// Generic tool processing endpoint
app.post('/api/tools/:tool', verifyToken, checkCredits(2), async (req, res) => {
  try {
    const { tool } = req.params;
    const cost = TOOL_COSTS[tool] || 2;

    // Check credits again with exact cost
    const user = await User.findById(req.user.id);
    if (user.credits < cost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: cost,
        available: user.credits,
      });
    }

    // Create edit record
    const edit = await Edit.create({
      userId: req.user.id,
      tool,
      status: 'processing',
      creditsCost: cost,
      prompt: req.body.prompt,
      parameters: req.body,
    });

    // Deduct credits
    user.credits -= cost;
    await user.save();

    // TODO: Connect to actual AI provider (Fal, Replicate, etc.)
    // For now, set to success after 2 seconds
    setTimeout(async () => {
      const updatedEdit = await Edit.findById(edit._id);
      updatedEdit.status = 'success';
      updatedEdit.outputImageUrl = 'https://via.placeholder.com/512';
      await updatedEdit.save();
    }, 2000);

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Tool processing failed', details: err.message });
  }
});

// Specific tool endpoints
app.post('/api/tools/text-to-image', verifyToken, checkCredits(2), async (req, res) => {
  try {
    const edit = await Edit.create({
      userId: req.user.id,
      tool: 'text-to-image',
      status: 'processing',
      creditsCost: 2,
      prompt: req.body.prompt,
      parameters: req.body,
    });

    const user = await User.findById(req.user.id);
    user.credits -= 2;
    await user.save();

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.post('/api/tools/background-remove', verifyToken, checkCredits(1), async (req, res) => {
  try {
    const edit = await Edit.create({
      userId: req.user.id,
      tool: 'background-remove',
      status: 'processing',
      creditsCost: 1,
      inputImageUrl: req.body.imageUrl,
    });

    const user = await User.findById(req.user.id);
    user.credits -= 1;
    await user.save();

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.post('/api/tools/upscale', verifyToken, checkCredits(2), async (req, res) => {
  try {
    const edit = await Edit.create({
      userId: req.user.id,
      tool: 'upscale',
      status: 'processing',
      creditsCost: 2,
      inputImageUrl: req.body.imageUrl,
      parameters: { scale: req.body.scale },
    });

    const user = await User.findById(req.user.id);
    user.credits -= 2;
    await user.save();

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Upscaling failed' });
  }
});

app.post('/api/tools/expand', verifyToken, checkCredits(3), async (req, res) => {
  try {
    const edit = await Edit.create({
      userId: req.user.id,
      tool: 'expand',
      status: 'processing',
      creditsCost: 3,
      inputImageUrl: req.body.imageUrl,
      parameters: { direction: req.body.direction },
    });

    const user = await User.findById(req.user.id);
    user.credits -= 3;
    await user.save();

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Expansion failed' });
  }
});

app.post('/api/tools/prompt-edit', verifyToken, checkCredits(2), async (req, res) => {
  try {
    const edit = await Edit.create({
      userId: req.user.id,
      tool: 'prompt-edit',
      status: 'processing',
      creditsCost: 2,
      inputImageUrl: req.body.imageUrl,
      prompt: req.body.prompt,
    });

    const user = await User.findById(req.user.id);
    user.credits -= 2;
    await user.save();

    res.json({ editId: edit._id, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: 'Edit failed' });
  }
});

// Result polling endpoint
app.get('/api/tools/result/:editId', verifyToken, async (req, res) => {
  try {
    const edit = await Edit.findById(req.params.editId);
    if (!edit) return res.status(404).json({ error: 'Edit not found' });

    res.json(edit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// ===== ADMIN ROUTES =====

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth failed' });
  }
};

app.get('/api/admin/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCreditsUsed = await Edit.aggregate([
      { $group: { _id: null, total: { $sum: '$creditsCost' } } },
    ]);
    const totalRevenue = totalCreditsUsed[0]?.total * 0.01 || 0;

    res.json({
      totalUsers,
      totalCreditsUsed: totalCreditsUsed[0]?.total || 0,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/analytics', verifyToken, isAdmin, async (req, res) => {
  try {
    const toolUsage = await Edit.aggregate([
      { $group: { _id: '$tool', count: { $sum: 1 }, revenue: { $sum: '$creditsCost' } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ toolUsage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.post('/api/admin/adjust-credits', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits } },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to adjust credits' });
  }
});

// ===== PAYMENT ROUTES =====

app.post('/api/payment/order', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const plans = {
      starter: { amount: 19900, credits: 300 },
      pro: { amount: 49900, credits: 1000 },
    };

    const planData = plans[plan];
    if (!planData) return res.status(400).json({ error: 'Invalid plan' });

    // TODO: Connect to Razorpay API
    // For now, return mock order
    res.json({
      success: true,
      orderId: 'order_' + Date.now(),
      amount: planData.amount,
      credits: planData.credits,
    });
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// ===== ERROR HANDLING =====

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== SERVER START =====

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
