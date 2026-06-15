import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import SearchFilters from './components/SearchFilters';
import { API_BASE_URL } from './config/api';
import { appStyles } from './styles/appStyles';
import { authStyles } from './styles/authStyles';
import { cartStyles } from './styles/cartStyles';
import { homeStyles } from './styles/homeStyles';

const money = (value) => Number(value || 0).toFixed(2);
const productPrice = (product) => Number(product.discounted_price ?? product.price ?? 0);
const productMrp = (product) => Number(product.price ?? 0);
const baseHeaders = {
  Accept: 'application/json',
  'bypass-tunnel-reminder': 'true',
};

const apiErrorMessage = (error, fallbackMessage) => {
  if (error?.message === 'Network request failed') {
    return `Network request failed. Check that the backend is running at ${API_BASE_URL}.`;
  }

  return error?.message || fallbackMessage;
};

export default function App() {
  const [screen, setScreen] = useState('products');
  const [authMode, setAuthMode] = useState('login');
  const [authToken, setAuthToken] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: '',
    gmail: '',
    phone: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [products, setProducts] = useState([]);
  const [homeSliders, setHomeSliders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customer, setCustomer] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    notes: '',
  });

  const authHeaders = useMemo(() => ({
    ...baseHeaders,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  }), [authToken]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + productPrice(item.product) * item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + productMrp(item.product) * item.quantity, 0),
    [cartItems],
  );

  const discountTotal = useMemo(
    () => subtotal - cartTotal,
    [cartTotal, subtotal],
  );

  const latestOrder = orders[0];

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      customer_name: current.customer_name || authUser.name || '',
      customer_phone: current.customer_phone || authUser.phone || '',
    }));
  }, [authUser]);

  const fetchOrders = async (headers = authHeaders) => {
    if (!authToken) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customer/orders`, { headers });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Could not load orders.');
      }

      setOrders(payload.data || []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (!authToken) {
      return;
    }

    fetchOrders();
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    const timeout = setTimeout(() => {
      const fetchHome = async () => {
        setIsLoading(true);
        setErrorMessage('');

        const query = [
          productSearch.trim() ? `name=${encodeURIComponent(productSearch.trim())}` : '',
          companySearch.trim() ? `company=${encodeURIComponent(companySearch.trim())}` : '',
        ].filter(Boolean).join('&');

        try {
          const [productResponse, sliderResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`, { headers: authHeaders }),
            fetch(`${API_BASE_URL}/home-sliders`, { headers: authHeaders }),
          ]);
          const productPayload = await productResponse.json();
          const sliderPayload = await sliderResponse.json();

          if (!productResponse.ok) {
            throw new Error(productPayload.message || 'Could not load products.');
          }

          if (!sliderResponse.ok) {
            throw new Error(sliderPayload.message || 'Could not load home sliders.');
          }

          setProducts(productPayload.data || []);
          setHomeSliders(sliderPayload.data || []);
        } catch (error) {
          setErrorMessage(apiErrorMessage(error, 'Could not load products.'));
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchHome();
    }, 250);

    return () => clearTimeout(timeout);
  }, [authToken, companySearch, productSearch]);

  const updateAuthForm = (key, value) => {
    setAuthForm((current) => ({ ...current, [key]: value }));
  };

  const submitAuth = async () => {
    setAuthError('');
    setIsAuthSubmitting(true);

    const isRegister = authMode === 'register';
    const payload = isRegister
      ? authForm
      : { login: authForm.gmail || authForm.phone, password: authForm.password };

    try {
      const response = await fetch(`${API_BASE_URL}/customer/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not continue.');
      }

      setAuthToken(data.token);
      setAuthUser(data.customer);
      setScreen('products');
      setAuthForm({ name: '', gmail: '', phone: '', password: '' });
    } catch (error) {
      setAuthError(apiErrorMessage(error, 'Could not continue.'));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/customer/logout`, {
        method: 'POST',
        headers: authHeaders,
      });
    } catch {
      // Logout locally even if the network is unavailable.
    }

    setAuthToken('');
    setAuthUser(null);
    setOrders([]);
    setCartItems([]);
    setScreen('products');
    setCustomer({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      notes: '',
    });
  };

  const handleAddToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        return currentItems.map((item) => (
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCartItems((currentItems) => currentItems
      .map((item) => (
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ))
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const submitOrder = async () => {
    if (!customer.customer_name.trim() || !customer.customer_phone.trim() || !customer.customer_address.trim()) {
      Alert.alert('Missing details', 'Please enter customer name, phone, and address.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Empty cart', 'Please add medicine before checkout.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customer,
          items: cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Could not place order.');
      }

      setCartItems([]);
      setCustomer((current) => ({
        ...current,
        customer_name: authUser?.name || current.customer_name,
        customer_phone: authUser?.phone || current.customer_phone,
        customer_address: '',
        notes: '',
      }));
      await fetchOrders(authHeaders);
      setScreen('products');
      Alert.alert('Order placed', payload.message || 'Your order has been placed.');
    } catch (error) {
      Alert.alert('Order failed', apiErrorMessage(error, 'Could not place order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAuth = () => {
    const isRegister = authMode === 'register';

    return (
      <View style={authStyles.page}>
        <StatusBar style="dark" />
        <Text style={authStyles.brand}>MED Bangladesh</Text>
        <Text style={authStyles.subtitle}>Login to order medicine from the mobile app.</Text>

        <View style={authStyles.form}>
          <Text style={authStyles.title}>{isRegister ? 'Create Account' : 'Login'}</Text>
          {authError ? <Text style={authStyles.error}>{authError}</Text> : null}

          {isRegister ? (
            <>
              <Text style={authStyles.label}>Name</Text>
              <TextInput
                style={authStyles.input}
                value={authForm.name}
                onChangeText={(value) => updateAuthForm('name', value)}
                placeholder="Your name"
              />
            </>
          ) : null}

          <Text style={authStyles.label}>{isRegister ? 'Gmail' : 'Gmail or Mobile'}</Text>
          <TextInput
            style={authStyles.input}
            value={authForm.gmail}
            onChangeText={(value) => updateAuthForm('gmail', value)}
            placeholder={isRegister ? 'you@gmail.com' : 'Gmail or mobile number'}
            autoCapitalize="none"
            keyboardType={isRegister ? 'email-address' : 'default'}
          />

          {isRegister ? (
            <>
              <Text style={authStyles.label}>Mobile</Text>
              <TextInput
                style={authStyles.input}
                value={authForm.phone}
                onChangeText={(value) => updateAuthForm('phone', value)}
                placeholder="Mobile number"
                keyboardType="phone-pad"
              />
            </>
          ) : null}

          <Text style={authStyles.label}>Password</Text>
          <TextInput
            style={authStyles.input}
            value={authForm.password}
            onChangeText={(value) => updateAuthForm('password', value)}
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity
            style={[authStyles.button, isAuthSubmitting ? cartStyles.disabledButton : null]}
            onPress={submitAuth}
            disabled={isAuthSubmitting}
            activeOpacity={0.85}
          >
            <Text style={authStyles.buttonText}>
              {isAuthSubmitting ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAuthMode(isRegister ? 'login' : 'register')}>
            <Text style={authStyles.switchText}>
              {isRegister ? 'Already have an account? Login' : 'New customer? Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHomeHeader = () => (
    <>
      {homeSliders.map((slider) => (
        <View key={slider.id} style={homeStyles.sliderSection}>
          <View style={homeStyles.sliderHeader}>
            <Text style={homeStyles.sliderTitle}>{slider.name}</Text>
          </View>
          <FlatList
            horizontal
            data={slider.products || []}
            keyExtractor={(item) => `slider-${slider.id}-${item.id}`}
            renderItem={({ item }) => (
              <ProductCard product={item} onAddToCart={handleAddToCart} style={homeStyles.sliderCard} />
            )}
            contentContainerStyle={homeStyles.sliderList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}

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
    </>
  );

  const renderProducts = () => (
    <FlatList
      numColumns={2}
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ProductCard product={item} onAddToCart={handleAddToCart} />
      )}
      ListHeaderComponent={renderHomeHeader}
      ListEmptyComponent={!isLoading ? (
        <Text style={appStyles.emptyText}>No products found.</Text>
      ) : null}
      columnWrapperStyle={appStyles.productRow}
      contentContainerStyle={appStyles.productList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderCart = () => (
    <ScrollView contentContainerStyle={cartStyles.page}>
      <View style={cartStyles.headerRow}>
        <Text style={cartStyles.title}>Cart</Text>
        <TouchableOpacity style={cartStyles.secondaryButton} onPress={() => setScreen('products')}>
          <Text style={cartStyles.secondaryButtonText}>Products</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <Text style={appStyles.emptyText}>Your cart is empty.</Text>
      ) : (
        cartItems.map((item) => (
          <View key={item.product.id} style={cartStyles.item}>
            <View style={cartStyles.itemInfo}>
              <Text style={cartStyles.itemName}>{item.product.name}</Text>
              <Text style={cartStyles.itemMeta}>{item.product.company}</Text>
              <Text style={cartStyles.itemPrice}>BDT {money(productPrice(item.product))}</Text>
            </View>
            <View style={cartStyles.qtyControl}>
              <TouchableOpacity style={cartStyles.qtyButton} onPress={() => updateQuantity(item.product.id, -1)}>
                <Text style={cartStyles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={cartStyles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity style={cartStyles.qtyButton} onPress={() => updateQuantity(item.product.id, 1)}>
                <Text style={cartStyles.qtyButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={cartStyles.deleteButton}
                onPress={() => removeFromCart(item.product.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.product.name} from cart`}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#b42318" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View style={cartStyles.totalBox}>
        <View style={cartStyles.summaryRow}>
          <Text style={cartStyles.totalLabel}>Total Amount</Text>
          <Text style={cartStyles.totalValue}>BDT {money(cartTotal)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[cartStyles.primaryButton, cartItems.length === 0 ? cartStyles.disabledButton : null]}
        onPress={() => cartItems.length > 0 && setScreen('checkout')}
        activeOpacity={0.85}
      >
        <Text style={cartStyles.primaryButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCheckout = () => (
    <ScrollView contentContainerStyle={cartStyles.page}>
      <View style={cartStyles.headerRow}>
        <Text style={cartStyles.title}>Checkout</Text>
        <TouchableOpacity style={cartStyles.secondaryButton} onPress={() => setScreen('cart')}>
          <Text style={cartStyles.secondaryButtonText}>Cart</Text>
        </TouchableOpacity>
      </View>

      <View style={cartStyles.form}>
        <Text style={cartStyles.label}>Customer Name</Text>
        <TextInput
          style={cartStyles.input}
          value={customer.customer_name}
          onChangeText={(value) => setCustomer((current) => ({ ...current, customer_name: value }))}
          placeholder="Name"
        />

        <Text style={cartStyles.label}>Phone</Text>
        <TextInput
          style={cartStyles.input}
          value={customer.customer_phone}
          onChangeText={(value) => setCustomer((current) => ({ ...current, customer_phone: value }))}
          placeholder="Phone"
          keyboardType="phone-pad"
        />

        <Text style={cartStyles.label}>Address</Text>
        <TextInput
          style={[cartStyles.input, cartStyles.textArea]}
          value={customer.customer_address}
          onChangeText={(value) => setCustomer((current) => ({ ...current, customer_address: value }))}
          placeholder="Delivery address"
          multiline
        />

        <Text style={cartStyles.label}>Notes</Text>
        <TextInput
          style={[cartStyles.input, cartStyles.textArea]}
          value={customer.notes}
          onChangeText={(value) => setCustomer((current) => ({ ...current, notes: value }))}
          placeholder="Optional notes"
          multiline
        />
      </View>

      <View style={cartStyles.totalBox}>
        <View style={cartStyles.summaryRows}>
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.totalLabel}>Total Price</Text>
            <Text style={cartStyles.summaryValue}>BDT {money(subtotal)}</Text>
          </View>
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.totalLabel}>VAT</Text>
            <Text style={cartStyles.summaryValue}>BDT 0.00</Text>
          </View>
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.totalLabel}>Shipping Cost</Text>
            <Text style={cartStyles.summaryValue}>BDT 0.00</Text>
          </View>
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.totalLabel}>Discount</Text>
            <Text style={cartStyles.discountValue}>- BDT {money(discountTotal)}</Text>
          </View>
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.grandLabel}>Grand Total</Text>
            <Text style={cartStyles.totalValue}>BDT {money(cartTotal)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[cartStyles.primaryButton, isSubmitting ? cartStyles.disabledButton : null]}
        onPress={submitOrder}
        activeOpacity={0.85}
        disabled={isSubmitting}
      >
        <Text style={cartStyles.primaryButtonText}>{isSubmitting ? 'Submitting...' : 'Place Order'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderNotifications = () => (
    <ScrollView contentContainerStyle={cartStyles.page}>
      <Text style={cartStyles.title}>Notifications</Text>
      <View style={homeStyles.accountCard}>
        <Text style={homeStyles.accountName}>No notifications yet</Text>
        <Text style={homeStyles.accountMeta}>Order and offer notifications will appear here later.</Text>
      </View>
    </ScrollView>
  );

  const renderAccount = () => (
    <ScrollView contentContainerStyle={cartStyles.page}>
      <View style={cartStyles.headerRow}>
        <Text style={cartStyles.title}>Account</Text>
        <TouchableOpacity style={cartStyles.secondaryButton} onPress={logout}>
          <Text style={cartStyles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={homeStyles.accountCard}>
        <Text style={homeStyles.accountName}>{authUser?.name}</Text>
        <Text style={homeStyles.accountMeta}>{authUser?.phone}</Text>
        {authUser?.gmail ? <Text style={homeStyles.accountMeta}>{authUser.gmail}</Text> : null}
        {latestOrder ? (
          <View style={homeStyles.statusPill}>
            <Text style={homeStyles.statusText}>Latest: {latestOrder.status}</Text>
          </View>
        ) : null}
      </View>

      <Text style={homeStyles.sectionTitle}>Previous Orders</Text>
      {orders.length === 0 ? (
        <Text style={appStyles.emptyText}>No orders yet.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={homeStyles.orderRow}>
            <View style={homeStyles.orderTop}>
              <Text style={homeStyles.orderNumber}>{order.order_number}</Text>
              <View style={homeStyles.statusPill}>
                <Text style={homeStyles.statusText}>{order.status}</Text>
              </View>
            </View>
            <Text style={homeStyles.orderMeta}>BDT {money(order.total)}</Text>
            <Text style={homeStyles.orderMeta}>{new Date(order.created_at).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );

  if (!authUser) {
    return renderAuth();
  }

  return (
    <View style={appStyles.container}>
      <StatusBar style="light" />
      <Navbar cartCount={cartCount} onCartPress={() => setScreen('cart')} />
      <View style={appStyles.screenBody}>
        {screen === 'products' ? renderProducts() : null}
        {screen === 'cart' ? renderCart() : null}
        {screen === 'checkout' ? renderCheckout() : null}
        {screen === 'notifications' ? renderNotifications() : null}
        {screen === 'account' ? renderAccount() : null}
      </View>
      <BottomNav activeScreen={screen} onChange={setScreen} cartCount={cartCount} />
    </View>
  );
}
