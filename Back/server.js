import express from 'express';
import { upload, validateRequest } from './app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post('/api/v1/generate-plans',
    upload.single('file'),
    validateRequest,
    (req, res) => {
        const { projectType, budget, floors, area, areaUnit } = req.body;
        const uploadedFile = req.file;

        console.log("Received Project Configuration:", {
            projectType,
            budget: Number(budget),
            floors: Number(floors),
            area: Number(area),
            areaUnit
        });

        // 3. Core Logic: Process the data (e.g., call the AI model)
        // ... AI Model Processing Logic using projectType, area, and the uploadedFile stream/path ...

        res.status(200).json({
            success: true,
            message: 'Architectural plans generated successfully.',
            resultId: 'gen-' + Date.now(),
        });
    }
);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'An error occurred while processing your request.'
    });
});

const port = process.env.PORT || 3001;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
});
