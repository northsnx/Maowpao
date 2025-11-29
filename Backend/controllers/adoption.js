const Adoption = require('../models/Adoption');
const CatModel = require('../models/CatModel');

// =============================
// 1) Request Adoption (Create)
// =============================
exports.requestAdoption = async (req, res) => {
  try {
    const { catId, message } = req.body;

    // ดึงแมว
    const cat = await CatModel.findById(catId);
    if (!cat) return res.status(404).json({ message: "Cat not found" });

    // ตรวจสอบว่าเจ้าของแมวไม่สามารถอุปการะแมวตัวเองได้
    if (cat.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot adopt your own cat" });
    }

    // สร้างคำขอ adoption
    const adoption = await Adoption.create({
      cat: cat._id,
      adopter: req.user._id,
      owner: cat.createdBy,  // ใช้ createdBy เป็นเจ้าของแมว
      message: message || ""
    });

    res.status(201).json({
      message: "Adoption request sent",
      adoption
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================
// 2) Get requests where user is the owner
// ======================================
exports.getRequestsForOwner = async (req, res) => {
  try {
    const requests = await Adoption.find({ owner: req.user._id })
      .populate({
        path: 'cat',
        populate: { path: 'createdBy', select: 'username' } // ดึง username ของเจ้าของแมว
      })
      .populate('adopter', 'username'); // ดึง username ของผู้ขออุปการะ

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===========================
// 3) Approve Adoption Request
// ===========================
exports.approveAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate('cat');
    if (!adoption) return res.status(404).json({ message: "Request not found" });

    // ตรวจสอบว่า owner ตรงกับเจ้าของแมว
    if (adoption.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can approve" });
    }

    // เช็คว่าแมวยัง available
    const cat = adoption.cat;
    if (cat.status !== "available") {
      return res.status(400).json({ message: "This cat has already been adopted" });
    }

    // อัปเดตสถานะ adoption และ cat พร้อมกัน
    adoption.status = "approved";
    cat.status = "adopted";

    await adoption.save();
    await cat.save();

    // ปรับสถานะคำขอ adoption อื่นที่เกี่ยวกับแมวตัวนี้เป็น "rejected"
    await Adoption.updateMany(
      { cat: cat._id, _id: { $ne: adoption._id } },
      { status: "rejected" }
    );

    res.json({ message: "Adoption approved", adoption, cat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===========================
// 4) Reject Adoption Request
// ===========================
exports.rejectAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) return res.status(404).json({ message: "Request not found" });

    if (adoption.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can reject" });
    }

    adoption.status = "rejected";
    await adoption.save();

    res.json({ message: "Adoption rejected", adoption });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================================
// 5) Get user's adoption requests (as adopter)
// ==============================================
exports.getMyAdoptionRequests = async (req, res) => {
  try {
    const requests = await Adoption.find({ adopter: req.user._id })
      .populate({
        path: 'cat',
        populate: { path: 'createdBy', select: 'username' } // ดึง username ของเจ้าของแมว
      })
      .populate('owner', 'username')      // ดึง username ของ owner
      .populate('adopter', 'username');   // ดึง username ของ adopter

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.id; // ใช้ id ของ Adoption document

    const adoption = await Adoption.findById(adoptionId);

    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    // ตรวจสอบว่า requester คือผู้ยกเลิก
    if (adoption.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot cancel this request" });
    }

    if (adoption.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel a request that is already processed" });
    }

    await adoption.deleteOne();

    res.json({ message: "Adoption request canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
