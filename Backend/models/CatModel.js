// models/Cat.js
const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: String,
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  age: Number,
  description: String,
  status: { type: String, enum: ['available', 'pending', 'adopted'], default: 'available' },
  images: [String],   // <---- เก็บ URL ที่นี่
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adoptionRequestBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // 👈 ผู้ที่ขอรับเลี้ยง
}, { timestamps: true });


module.exports = mongoose.model('Cat', catSchema);
