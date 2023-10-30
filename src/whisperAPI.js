// Importa las bibliotecas necesarias
const AWS = require('aws-sdk');
const Replicate = require('replicate');

// Configura AWS SDK
AWS.config.update({
    region: 'us-east-2',  // Reemplaza con tu región
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4'  // Especifica la versión 4 de la firma
});

// Crea una nueva instancia del cliente S3
const s3 = new AWS.S3();

// Define las opciones para la subida
const uploadParams = {
    Bucket: 'sisidevtest01a',  // Reemplaza con el nombre de tu bucket
    Key: 'Recording001',  // Reemplaza con el nombre que deseas para el archivo en S3
    Body: require('fs').createReadStream('./src/RecordingTest.m4a'),  // El contenido del archivo, puedes usar fs.createReadStream('path-to-your-file') si el archivo está en tu sistema de archivos
};

// Sube el archivo a S3
s3.upload(uploadParams, async (err, data) => {
    if (err) {
        console.error(`Error al subir el archivo: ${err.message}`);
        return;
    }

    console.log(`Archivo subido exitosamente a ${data.Location}`);

    // Crea una nueva instancia de Replicate
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    // Obtén una URL firmada
    const params = {Bucket: 'sisidevtest01a', Key: 'Recording001', Expires: 60};  // Expires es la duración en segundos
    s3.getSignedUrl('getObject', params, async (err, url) => {
        if (err) {
            console.error(`Error al obtener la URL firmada: ${err.message}`);
            return;
        }

        // Usa la URL firmada en tu solicitud a Replicate
        try {
            const output = await replicate.run(
                "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
                {
                    input: {
                        audio: url  // La URL firmada
                    }
                }
            );
            console.log(output);
        } catch (e) {
            console.error(`Error al hacer la solicitud a Replicate: ${e.message}`);
        }
    });

});
