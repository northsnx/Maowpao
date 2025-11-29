const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema(
  {
    cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
    adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: { type: String }, // optional message from user
  },
  { timestamps: true }
);

module.exports = mongoose.model('Adoption', adoptionSchema);
