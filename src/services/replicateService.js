const Replicate = require('replicate');

const transcribeAudio = async (signedUrl) => {
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        const output = await replicate.run(
            "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
            {
                input: {
                    audio: signedUrl  // La URL firmada
                }
            }
        );
        return output;
    } catch (e) {
        console.error(`Error al hacer la solicitud a Replicate: ${e.message}`);
        throw e;  // Re-lanza el error para manejarlo en otro lado
    }
};

module.exports = {
    transcribeAudio
};
