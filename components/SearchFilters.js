import { TextInput, View } from 'react-native';

import { searchStyles } from '../styles/searchStyles';

export default function SearchFilters({
  productSearch,
  companySearch,
  onProductSearchChange,
  onCompanySearchChange,
}) {
  return (
    <View style={searchStyles.container}>
      <TextInput
        style={searchStyles.input}
        placeholder="Product name"
        placeholderTextColor="#7a8a83"
        value={productSearch}
        onChangeText={onProductSearchChange}
      />
      <TextInput
        style={searchStyles.input}
        placeholder="Company name"
        placeholderTextColor="#7a8a83"
        value={companySearch}
        onChangeText={onCompanySearchChange}
      />
    </View>
  );
}
