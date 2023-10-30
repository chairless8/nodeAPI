// audioProcces/mainController.js
const { uploadToS3, getSignedUrl } = require('../../services/awsService');
const { transcribeAudio } = require('../../services/replicateService');

const processAudio = async (req, res) => {
    try {
        const filePath = req.file.path;
        const uploadData = await uploadToS3(filePath);
        const signedUrl = await getSignedUrl(uploadData.Key);
        const transcription = await transcribeAudio(signedUrl);
        res.json({ transcription });
    } catch (err) {
        next(err);  // Pasando el error al middleware de manejo de errores
    }
};

module.exports = {
    processAudio
};
