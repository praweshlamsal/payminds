import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ItemCard from '../components/ItemCard';
import TitleComponent from '../components/TitleComponent';

// Sample data - replace with your actual data source
const favoritesData = [
  {
    id: '1',
    name: 'Netflix Premium',
    amount: '19.99',
    nextBillingDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'Spotify Family',
    amount: '16.99',
    nextBillingDate: '2024-03-18',
  },
  {
    id: '3',
    name: 'Gym Membership',
    amount: '45.00',
    nextBillingDate: '2024-03-20',
  },
];

const FavoritesScreen = () => {
  return (
    <View style={styles.container}>
       <TitleComponent headerStyle={{
        marginTop: 18,
       }} showIcon={false}  title="Favorite Subscription" />

      <FlatList
        data={favoritesData}
        
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={()=> (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No favorites found</Text>
          </View>
        )}
      />
    </View>
  )
}

export default FavoritesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 16,
  },
})