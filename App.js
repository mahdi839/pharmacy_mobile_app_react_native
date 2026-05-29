import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import SearchFilters from './components/SearchFilters';
import { API_BASE_URL } from './config/api';
import { appStyles } from './styles/appStyles';

export default function App() {
  const [productSearch, setProductSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        setErrorMessage('');

        const query = [
          productSearch.trim() ? `name=${encodeURIComponent(productSearch.trim())}` : '',
          companySearch.trim() ? `company=${encodeURIComponent(companySearch.trim())}` : '',
        ].filter(Boolean).join('&');

        try {
          const response = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`);
          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload.message || 'Could not load products.');
          }

          setProducts(payload.data || []);
        } catch (error) {
          setErrorMessage(error.message || 'Could not load products.');
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }, 250);

    return () => clearTimeout(timeout);
  }, [companySearch, productSearch]);

  const handleAddToCart = (product) => {
    setCartItems((currentItems) => [...currentItems, product]);
  };

  return (
    <View style={appStyles.container}>
      <StatusBar style="light" />
      <Navbar cartCount={cartItems.length} />
      <SearchFilters
        productSearch={productSearch}
        companySearch={companySearch}
        onProductSearchChange={setProductSearch}
        onCompanySearchChange={setCompanySearch}
      />
      {errorMessage ? (
        <View style={appStyles.messageBox}>
          <Text style={appStyles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
      {isLoading ? (
        <View style={appStyles.loadingBox}>
          <ActivityIndicator color="#1a7f5a" />
        </View>
      ) : null}
      <FlatList
        numColumns={2}
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={handleAddToCart} />
        )}
        ListEmptyComponent={!isLoading ? (
          <Text style={appStyles.emptyText}>No products found.</Text>
        ) : null}
        columnWrapperStyle={appStyles.productRow}
        contentContainerStyle={appStyles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
