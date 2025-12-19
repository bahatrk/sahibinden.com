import { openDb } from "./db";

export type FeatureGroupEntity = {
  id: number;
  name: string;
  category_type_id: number; // 1 = Emlak, 2 = Vasıta
};

export type FeatureEntity = {
  id: number;
  name: string;
  feature_group_id: number;
};

// Belirli kategori tipine göre feature gruplarını getir
export async function getFeatureGroupsByCategoryType(categoryTypeId: number): Promise<FeatureGroupEntity[]> {
  const db = await openDb();
  const sql = `SELECT * FROM feature_group WHERE category_type_id = ?`;
  return (await db.getAllAsync<FeatureGroupEntity>(sql, [categoryTypeId])) ?? [];
}

// Bir grup altındaki özellikleri getir
export async function getFeaturesByGroup(featureGroupId: number): Promise<FeatureEntity[]> {
  const db = await openDb();
  const sql = `SELECT * FROM feature WHERE feature_group_id = ?`;
  return (await db.getAllAsync<FeatureEntity>(sql, [featureGroupId])) ?? [];
}

// Seçilen özellikleri listing_feature tablosuna ekle
export async function addListingFeatures(listingId: number, featureIds: number[]) {
  const db = await openDb();
  for (const featureId of featureIds) {
    await db.runAsync(
      `INSERT OR IGNORE INTO listing_feature (listing_id, feature_id) VALUES (?, ?)`,
      [listingId, featureId]
    );
  }
}

// Listing'e ait özellikleri gruplu olarak çek
export async function getListingFeatures(listingId: number): Promise<{ group: FeatureGroupEntity; features: FeatureEntity[] }[]> {
  const db = await openDb();
  const groups = await db.getAllAsync<FeatureGroupEntity>(
    `SELECT DISTINCT fg.id, fg.name, fg.category_type_id
     FROM feature_group fg
     INNER JOIN feature f ON f.feature_group_id = fg.id
     INNER JOIN listing_feature lf ON lf.feature_id = f.id
     WHERE lf.listing_id = ?`,
    [listingId]
  );

  const result: { group: FeatureGroupEntity; features: FeatureEntity[] }[] = [];

  for (const g of groups) {
    const feats = await db.getAllAsync<FeatureEntity>(
      `SELECT f.* FROM feature f
       INNER JOIN listing_feature lf ON lf.feature_id = f.id
       WHERE lf.listing_id = ? AND f.feature_group_id = ?`,
      [listingId, g.id]
    );
    result.push({ group: g, features: feats });
  }

  return result;
}
