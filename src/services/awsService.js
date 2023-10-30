const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'us-east-2',  // Reemplaza con tu región
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4'  // Especifica la versión 4 de la firma
});

const s3 = new AWS.S3();

const uploadToS3 = async (filePath, key) => {
    const uploadParams = {
        Bucket: 'sisidevtest01a',  // Reemplaza con el nombre de tu bucket
        Key: key,
        Body: fs.createReadStream(filePath)
    };

    try {
        const data = await s3.upload(uploadParams).promise();
        console.log(`Archivo subido exitosamente a ${data.Location}`);
        return data;
    } catch (error) {
        console.error(`Error al subir el archivo: ${error.message}`);
        throw error;
    }
};

const getSignedUrl = async (key) => {
    const params = {
        Bucket: 'sisidevtest01a',  // Reemplaza con el nombre de tu bucket
        Key: key,
        Expires: 60  // Expires es la duración en segundos
    };

    try {
        const url = await s3.getSignedUrlPromise('getObject', params);
        return url;
    } catch (error) {
        console.error(`Error al obtener la URL firmada: ${error.message}`);
        throw error;
    }
};

module.exports = {
    uploadToS3,
    getSignedUrl
};
