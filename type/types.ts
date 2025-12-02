// types.ts
export type RootStackParamList = {
  Categories: { parentId: number | null; parentName?: string };
  ListingPage: { categoryId: number; categoryName: string };
};
