export const API_KEY = "bac08a86a080a3fd988899fde351dda9";
export const BASE_URL = "http://192.168.1.2:8000";


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