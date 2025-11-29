const CatModel = require('../models/CatModel');

// 🟢 Get all cats
exports.getAllCats = async (req, res) => {
  try {
    const filters = {};
    if (req.query.gender) filters.gender = req.query.gender;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.search) filters.name = { $regex: req.query.search, $options: 'i' };

    const cats = await CatModel.find(filters).populate('createdBy', 'username');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🟢 Get single cat by ID
exports.getCatById = async (req, res) => {
  try {
    const cat = await CatModel.findById(req.params.catId).populate('createdBy', 'username');
    if (!cat) return res.status(404).json({ msg: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🟢 Create new cat
exports.createCat = async (req, res) => {
  try {
    const { name, gender, age, description, status, images } = req.body;
    console.log("Images from FE:", images);   // <---- เช็คตรงนี้

    const cat = await CatModel.create({
      name,
      gender,
      age,
      description,
      status,
      images,
      createdBy: req.user.id, // comes from authCheck
    });

    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cat', error: error.message });
  }
};

// 🟢 Update cat (only owner)
exports.updateCat = async (req, res) => {
  try {
    // ใช้ req.params.catId ตาม router
    const cat = await CatModel.findById(req.params.catId);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });

    // ตรวจสอบเจ้าของ
    if (cat.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this cat' });
    }

    // อัปเดตแมว
    const updatedCat = await CatModel.findByIdAndUpdate(req.params.catId, req.body, { new: true });
    res.json(updatedCat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cat', error: error.message });
  }
};


// 🟢 Delete cat (only owner)
exports.deleteCat = async (req, res) => {
  try {
    // ใช้ req.params.catId ให้ตรงกับ router
    const cat = await CatModel.findById(req.params.catId);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });

    // ตรวจสอบเจ้าของ
    if (cat.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this cat' });
    }

    // ลบแมว
    await cat.deleteOne();
    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cat', error: error.message });
  }
};


// 🟢 Adopt cat
exports.adoptCat = async (req, res) => {
  try {
    const cat = await CatModel.findById(req.params.catId);
    if (!cat) return res.status(404).json({ msg: 'Cat not found' });

    cat.status = 'adopted';
    await cat.save();
    res.json({ msg: 'Cat adopted successfully', cat });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🟢 Get all cats created by logged-in user
exports.getMyCats = async (req, res) => {
  try {
    const cats = await CatModel.find({ createdBy: req.user.id });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
