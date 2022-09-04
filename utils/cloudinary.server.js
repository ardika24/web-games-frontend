import { v2 as cloudinary } from "cloudinary";

const config = cloudinary.config();

export function signUpload() {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder: "my-first-folder",
            // eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260', // You can put manipulation configuration here
        },
        config.api_secret
    );

    return {
        timestamp,
        signature,
        cloudName: config.cloud_name,
        apiKey: config.api_key,
    };
}
