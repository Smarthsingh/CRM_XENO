const mongoose = require("mongoose");

const CampaignStatSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  sent: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  failedCustomers: [
    {
      name: String,
      email: String,
      phone: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("CampaignStat", CampaignStatSchema);
