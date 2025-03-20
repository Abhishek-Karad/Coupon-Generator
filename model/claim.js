const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const claimSchema = new mongoose.Schema({
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  ipAddress: { type: String, required: true },
  sessionId: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Claim", claimSchema);