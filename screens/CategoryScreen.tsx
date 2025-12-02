import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getChildCategories, Category } from '../assets/database/category';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../type/types';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;
type CategoriesScreenRouteProp = RouteProp<RootStackParamList, 'Categories'>;

type Props = {
  navigation: CategoriesScreenNavigationProp;
  route: CategoriesScreenRouteProp;
};

export default function CategoryScreen({ route, navigation }: Props) {
  const { parentId, parentName } = route.params;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const cats = await getChildCategories(parentId);
      setCategories(cats);
    })();
  }, [parentId]);

  const handlePress = async (cat: Category) => {
    const children = await getChildCategories(cat.id);
    if (children.length > 0) {
      navigation.push('Categories', { parentId: cat.id, parentName: cat.adi });
    } else {
      navigation.navigate('ListingPage', { categoryId: cat.id, categoryName: cat.adi });
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {parentName && <Text style={{ fontSize: 18, marginBottom: 10 }}>Parent: {parentName}</Text>}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 16 }}>{item.adi}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
