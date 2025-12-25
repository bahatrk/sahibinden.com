import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { CategoryEntity } from "../../lib/database/category";
import { fetchCategoriesByParent } from "../../lib/api/category";

type Props = {
  onCategorySelected: (category: CategoryEntity) => void;
};

export default function CategorySelector({ onCategorySelected }: Props) {
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  
  // Seçim geçmişini tutarak "Geri" butonunu yönetebiliriz
  const [parentStack, setParentStack] = useState<number[]>([-1]); 

  useEffect(() => {
    loadCategories(parentStack[parentStack.length - 1]);
  }, [parentStack]);

  async function loadCategories(parentId: number) {
    const data = await fetchCategoriesByParent(parentId);

    // Eğer veri gelmezse ve bir üst kategori seçiliyse, demek ki en alt kategoriye geldik.
    if (data.length === 0 && parentId !== -1) {
       // Bu kısım API yapınıza göre değişebilir. 
       // Normalde parentId ile çağırdığınızda boş geliyorsa, o parent "seçilen" kategoridir.
       // Ancak burada parentId sadece ID olduğu için, son seçilen kategoriyi bulmamız gerekebilir.
       // Basitlik adına: Üst bileşene logic'i devredelim veya seçimi onaylayalım.
       return; 
    }
    setCategories(data);
  }

  async function handleSelect(category: CategoryEntity) {
    // Tıklanan kategorinin altı var mı kontrol et
    const subCategories = await fetchCategoriesByParent(category.id);
    
    if (subCategories.length > 0) {
      // Alt kategoriler var, listeyi güncelle
      setCategories(subCategories);
      setParentStack([...parentStack, category.id]);
    } else {
      // Alt kategori yok, seçim tamamlandı!
      onCategorySelected(category);
    }
  }

  function handleBack() {
    if (parentStack.length > 1) {
      const newStack = [...parentStack];
      newStack.pop();
      setParentStack(newStack);
    }
  }

  
  return (
    <View style={{ flex: 1 }}>
      {parentStack.length > 1 && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={{ color: "blue" }}>← Geri Dön</Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={{color: 'gray'}}>›</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={<Text style={styles.header}>Kategori Seçin</Text>}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  text: { fontSize: 16 },
  backButton: { padding: 10, backgroundColor: "#f0f0f0", marginBottom: 5 }
});