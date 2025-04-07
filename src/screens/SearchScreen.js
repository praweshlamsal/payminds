import { useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text } from 'react-native';
import TitleComponent from '../components/TitleComponent';
import ItemCard from '../components/ItemCard';

const subscriptionsData = [
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

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(subscriptionsData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filtered = subscriptionsData.filter(item => 
      item.name.toLowerCase().includes(formattedQuery) ||
      item.amount.includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <TitleComponent showIcon={false } title="Search Subscriptions" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search subscriptions..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => <ItemCard  item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? "No results found" : "Start typing to search subscriptions"}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 32,
  },
});

export default SearchScreen;