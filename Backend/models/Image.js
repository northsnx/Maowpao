// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },          // URL จาก Cloudinary
  public_id: { type: String, required: true },    // public_id จาก Cloudinary (ใช้เวลา delete)
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ใครอัพโหลด
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
