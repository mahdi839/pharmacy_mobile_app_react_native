import { Image, Text, TouchableOpacity, View } from 'react-native';

import { productStyles } from '../styles/productStyles';

export default function ProductCard({ product, onAddToCart }) {
  const mrp = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const discountedPrice = Number(product.discounted_price ?? (mrp - (mrp * discount) / 100));

  return (
    <View style={productStyles.card}>
      <View style={productStyles.imageWrap}>
        <Image source={{ uri: product.image }} style={productStyles.image} />
        <View style={productStyles.discountBadge}>
          <Text style={productStyles.discountText}>{product.discount}% OFF</Text>
        </View>
      </View>

      <View style={productStyles.productInfo}>
        <Text style={productStyles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={productStyles.companyName} numberOfLines={1}>
          {product.company}
        </Text>
      </View>

      <Text style={productStyles.details}>
        {product.strength} | {product.form}
      </Text>
      <View style={productStyles.priceRow}>
        <Text style={productStyles.mrp}>BDT {mrp.toFixed(2)}</Text>
        <Text style={productStyles.price}>BDT {discountedPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={productStyles.addButton}
        activeOpacity={0.85}
        onPress={() => onAddToCart(product)}
      >
        <Text style={productStyles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
