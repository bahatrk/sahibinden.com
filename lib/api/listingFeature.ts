import { FeatureEntity, FeatureGroupEntity } from "../database/listingFeature";
import { api } from "./gateway";

// Backend'den dönen karmaşık yapı için tip tanımı (getListingFeatures için)
export type ListingFeaturesResponse = {
  group: FeatureGroupEntity;
  features: FeatureEntity[];
};


// 1. Belirli kategori tipine göre feature gruplarını getir
export async function getFeatureGroupsByCategoryTypeApi(categoryTypeId: number): Promise<FeatureGroupEntity[]> {
  try {
    const response = await api.get<FeatureGroupEntity[]>(`/features/groups/${categoryTypeId}`);
    return response.data;
  } catch (error) {
    console.error("Gruplar çekilemedi:", error);
    return [];
  }
}

// 2. Bir grup altındaki özellikleri getir
export async function getFeaturesByGroupApi(featureGroupId: number): Promise<FeatureEntity[]> {
  try {
    const response = await api.get<FeatureEntity[]>(`/features/group/${featureGroupId}/features`);
    return response.data;
  } catch (error) {
    console.error("Özellikler çekilemedi:", error);
    return [];
  }
}

// 3. Seçilen özellikleri listing_feature tablosuna ekle
export async function addListingFeaturesApi(listingId: number, featureIds: number[]): Promise<void> {
  try {
    // Axios otomatik olarak JSON header'larını ayarlar ve body'yi stringify yapar.
    await api.post(`/features/listing/${listingId}`, featureIds);
  } catch (error) {
    console.error("Özellik ekleme hatası:", error);
    throw error; // Hatayı bileşene fırlat ki kullanıcıya uyarı verebilesin
  }
}

// 4. Listing'e ait özellikleri gruplu olarak çek
export async function getListingFeaturesApi(listingId: number): Promise<ListingFeaturesResponse[]> {
  try {
    // Artık backend gruplamayı yaptığı için burada loop kurmaya gerek yok.
    // Tek istek atıyoruz ve veriyi alıyoruz.
    const response = await api.get<ListingFeaturesResponse[]>(`/features/${listingId}/features`);
    return response.data;
  } catch (error) {
    console.error("İlan özellikleri çekilemedi:", error);
    return [];
  }
}