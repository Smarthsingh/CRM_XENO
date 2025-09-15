const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');

// Utility to build MongoDB query from rules
function buildQuery(rule) {
  if (!rule) return {};
  if (rule.logic && rule.conditions) {
    const subQueries = rule.conditions.map(buildQuery);
    if (rule.logic === 'AND') return { $and: subQueries };
    if (rule.logic === 'OR') return { $or: subQueries };
  } else {
    const { field, operator, value } = rule;
    switch (operator) {
      case '>': return { [field]: { $gt: value } };
      case '>=': return { [field]: { $gte: value } };
      case '<': return { [field]: { $lt: value } };
      case '<=': return { [field]: { $lte: value } };
      case '==': return { [field]: value };
      case '!=': return { [field]: { $ne: value } };
      default: return {};
    }
  }
}

// Preview audience size
router.post('/preview', async (req, res) => {
  try {
    const { rules } = req.body;
    const query = buildQuery(rules);
    const count = await Customer.countDocuments(query);
    res.json({ audienceSize: count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper to simulate sending
async function simulateVendorAPI(logId) {
  const isSuccess = Math.random() < 0.9; // 90% success
  const status = isSuccess ? 'SENT' : 'FAILED';
  setTimeout(async () => {
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTime: new Date(),
    });
  }, 500 + Math.random() * 1000);
}

// Create campaign
router.post('/', async (req, res) => {
  try {
    const { name, rules, createdBy } = req.body;
    const query = buildQuery(rules);
    const customers = await Customer.find(query);
    const audienceSize = customers.length;
    const campaign = new Campaign({ name, rules, audienceSize, createdBy });
    await campaign.save();

    for (const customer of customers) {
      const message = `Hi ${customer.name}, here's 10% off on your next order!`;
      const log = await CommunicationLog.create({
        campaign: campaign._id,
        customer: customer._id,
        status: 'PENDING',
        message,
      });
      simulateVendorAPI(log._id);
    }

    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🚀 NEW: Send custom message to campaign audience
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Fetch audience from rules
    const query = buildQuery(campaign.rules);
    const customers = await Customer.find(query);

    for (const customer of customers) {
      const log = await CommunicationLog.create({
        campaign: campaign._id,
        customer: customer._id,
        status: 'PENDING',
        message: message || `Hi ${customer.name}, check out our new campaign!`,
      });
      simulateVendorAPI(log._id);
    }

    res.json({ success: true, message: 'Campaign messages queued' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send messages' });
  }
});

// Delivery receipt endpoint
router.post('/receipt', async (req, res) => {
  try {
    const { logId, status } = req.body;
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTime: new Date(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a campaign
router.delete('/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get delivery stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await CommunicationLog.aggregate([
      {
        $group: {
          _id: { campaign: '$campaign', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);
    const result = {};
    stats.forEach(s => {
      const cid = s._id.campaign.toString();
      if (!result[cid]) result[cid] = { campaignId: cid, sent: 0, failed: 0 };
      if (s._id.status === 'SENT') result[cid].sent = s.count;
      if (s._id.status === 'FAILED') result[cid].failed = s.count;
    });
    res.json(Object.values(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get failed customers
router.get('/:id/failed-customers', async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaign: req.params.id, status: 'FAILED' }).populate('customer');
    const customers = logs.map(log => ({
      name: log.customer.name,
      email: log.customer.email,
      phone: log.customer.phone
    }));
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
