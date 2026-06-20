const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const Violation = require('../models/Violation');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload-evidence', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No image file provided." });
        }

        console.log(`Received image for analysis: ${req.file.originalname}`);

        // Forward to Python CV Engine
        const form = new FormData();
        form.append('image', fs.createReadStream(req.file.path));

        let cvResult;
        try {
            const pythonResponse = await axios.post('http://127.0.0.1:5001/process_image', form, {
                headers: {
                    ...form.getHeaders()
                }
            });
            cvResult = pythonResponse.data;
        } catch (error) {
            console.error("Python CV Engine error:", error.message);
            // Fallback response if python engine is down
            cvResult = {
                plate_number: "UNKNOWN",
                violation_type: "Unable to reach AI Engine",
                confidence: 0,
                annotated_image: null
            };
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        if (!cvResult.success && cvResult.annotated_image === null) {
            return res.status(500).json({ success: false, error: "AI processing failed." });
        }

        // Save to MongoDB if there's a valid violation
        const newViolation = new Violation({
            id: `VIO-${Math.floor(1000 + Math.random() * 9000)}`,
            type: cvResult.violation_type,
            location: "Junction 4, Outer Ring Road", // Mock location for uploaded image
            time: new Date().toISOString().substring(11, 16),
            date: new Date().toISOString().substring(0, 10),
            plate: cvResult.plate_number,
            status: "Pending Review",
            image: cvResult.annotated_image, // Base64 image
            amount: cvResult.violation_type.includes("Helmet") ? 500 : 1000
        });

        await newViolation.save();

        res.json({
            success: true,
            message: "Image processed successfully",
            data: newViolation
        });

    } catch (err) {
        console.error("Upload evidence error:", err);
        res.status(500).json({ success: false, error: "Server error during processing." });
    }
});

module.exports = router;
