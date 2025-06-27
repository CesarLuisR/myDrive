import { ManagedUpload } from "aws-sdk/clients/s3";
import config from "../config";
import { s3 } from "../config/s3";

export const storageFileService = async (file: Express.Multer.File, fileKey: string): Promise<ManagedUpload.SendData> => {
    const params = {
        Bucket: config.aws.bucket_name,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        return data;
    } catch(e) {
        console.error("Error uploading to S3:", e);
        throw new Error("Failed to upload file to storage.");
    }
}