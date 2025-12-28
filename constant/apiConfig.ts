export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;


const IMAGE_URL = BASE_URL + "/images/";
const LOGO_IMAGE_URL = BASE_URL + "/logo-images/image/";
export const DEFAULT_IMAGE = "https://placehold.co/300x300/png";


export function getImageUrl (image_name: string): string {
    
    if (image_name.startsWith("http")) {
        return image_name
    }

    return IMAGE_URL + image_name
}

export function getLogoImageUrl (image_name: string): string {
    
    if (image_name.startsWith("http")) {
        return image_name
    }

    return LOGO_IMAGE_URL + image_name
}