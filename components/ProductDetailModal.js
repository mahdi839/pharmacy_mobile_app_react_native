import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

import { alertStyles } from '../styles/alertStyles';
import { notificationStyles } from '../styles/notificationStyles';

/**
 * Shows one product, opened from a notification. `product` is null while loading.
 */
export default function ProductDetailModal({ visible, product, isLoading, onClose, onAddToCart }) {
  const mrp = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const price = Number(product?.discounted_price ?? (mrp - (mrp * discount) / 100));
  const isOutOfStock = Number(product?.stock || 0) <= 0;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <View style={alertStyles.backdrop}>
        <View style={notificationStyles.productCard}>
          {isLoading || !product ? (
            <View style={notificationStyles.loadingBox}>
              {isLoading ? (
                <ActivityIndicator color="#1a7f5a" size="large" />
              ) : (
                <>
                  <Text style={notificationStyles.productName}>Product not available</Text>
                  <Text style={[notificationStyles.productMeta, { marginBottom: 16 }]}>
                    This product may have been removed.
                  </Text>
                  <TouchableOpacity style={[notificationStyles.secondaryButton, { flex: 0, width: '100%' }]} onPress={onClose}>
                    <Text style={notificationStyles.secondaryButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <>
              <Image source={{ uri: product.image }} style={notificationStyles.productImage} resizeMode="contain" />
              <View style={notificationStyles.productBody}>
                <Text style={notificationStyles.productName}>{product.name}</Text>
                <Text style={notificationStyles.productMeta}>
                  {[product.strength, product.form].filter(Boolean).join(' | ')}
                  {product.company ? ` · ${product.company}` : ''}
                </Text>

                <View style={notificationStyles.priceRow}>
                  <Text style={notificationStyles.productPrice}>BDT {price.toFixed(2)}</Text>
                  {mrp > price ? <Text style={notificationStyles.productMrp}>BDT {mrp.toFixed(2)}</Text> : null}
                </View>

                {discount > 0 ? (
                  <View style={notificationStyles.discountPill}>
                    <Text style={notificationStyles.discountText}>{discount}% OFF</Text>
                  </View>
                ) : null}

                <Text style={notificationStyles.stockText}>{isOutOfStock ? 'Out of stock' : 'In stock'}</Text>

                <View style={notificationStyles.buttonRow}>
                  <TouchableOpacity style={notificationStyles.secondaryButton} onPress={onClose} activeOpacity={0.85}>
                    <Text style={notificationStyles.secondaryButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[notificationStyles.primaryButton, isOutOfStock ? notificationStyles.disabledButton : null]}
                    onPress={() => onAddToCart(product)}
                    disabled={isOutOfStock}
                    activeOpacity={0.85}
                  >
                    <Text style={notificationStyles.primaryButtonText}>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
