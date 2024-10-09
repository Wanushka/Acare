const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital'); 


router.get("/icus", async (req, res) => {
  try {
    const icus = await Hospital.find({}, 'hospitalId username email beds'); 
    const formattedIcus = icus.map(icu => ({
      name: icu.hospitalId,
      location: icu.username,
      contact: icu.email,
      availableBeds: icu.beds
    }));

    return res.status(200).json(formattedIcus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching ICU data", error: err.message });
  }
});

router.put("/request-bed/:id", async (req, res) => {
  const hospitalId = req.params.id;

  try {
    const hospital = await Hospital.findOne({ hospitalId });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (hospital.beds <= 0) {
      return res.status(400).json({ message: "No available beds" });
    }

    hospital.beds -= 1;
    await hospital.save();

    return res.status(200).json({ message: "Bed requested successfully", updatedHospital: hospital });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating bed count", error: err.message });
  }
});

module.exports = router;
