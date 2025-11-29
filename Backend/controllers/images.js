const Image = require('../models/Image');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // ต้องอยู่บรรทัดบนสุดของไฟล์

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createImages = async (req, res) => {
  try {
    let { images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    if (!Array.isArray(images)) images = [images];

    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img, {
          folder: "CatFireHome",
          resource_type: "auto",
          public_id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });

        return result.secure_url;  // 👈 ส่ง URL กลับ
      })
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      images: uploadedImages
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: error.message });
  }
};




exports.removeImages = async (req, res) => {
  try {
    res.send('Remove files successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
