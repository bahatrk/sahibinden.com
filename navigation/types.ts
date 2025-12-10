import { CategoryEntity } from "../lib/database/category";
import { ListingWithData } from "../lib/database/listing";


export type RootStackParamList = {
  Home:undefined;
  Category: CategoryEntity;
  ListingDetail: { listing: ListingWithData };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  CreateListing: undefined;
};