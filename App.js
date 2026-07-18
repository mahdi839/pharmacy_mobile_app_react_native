import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import BottomNav from './components/BottomNav';
import AppAlert from './components/AppAlert';
import BannerCarousel from './components/BannerCarousel';
import HomeProductSlider from './components/HomeProductSlider';
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
const normalizedText = (value) => String(value || '').trim().toLowerCase();
const baseHeaders = {
  Accept: 'application/json',
  'bypass-tunnel-reminder': 'true',
};
const AUTH_SESSION_KEY = 'med-bangladesh-auth-session';

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
  const [isAuthRestoring, setIsAuthRestoring] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: '',
    gmail: '',
    phone: '',
    address: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [products, setProducts] = useState([]);
  const [homeSliders, setHomeSliders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [appAlert, setAppAlert] = useState(null);
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
  const isSearching = Boolean(productSearch.trim() || companySearch.trim());

  useEffect(() => {
    let isMounted = true;

    const restoreAuthSession = async () => {
      try {
        const savedSession = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

        if (!savedSession) {
          return;
        }

        const session = JSON.parse(savedSession);

        if (session?.token && session?.customer && isMounted) {
          setAuthToken(session.token);
          setAuthUser(session.customer);
        }
      } catch {
        await SecureStore.deleteItemAsync(AUTH_SESSION_KEY).catch(() => {});
      } finally {
        if (isMounted) {
          setIsAuthRestoring(false);
        }
      }
    };

    restoreAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setCustomer((current) => ({
      ...current,
      customer_name: current.customer_name || authUser.name || '',
      customer_phone: current.customer_phone || authUser.phone || '',
      customer_address: current.customer_address || authUser.address || '',
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

        const productName = productSearch.trim();
        const companyName = normalizedText(companySearch);
        const query = productName ? `?name=${encodeURIComponent(productName)}` : '';

        try {
          const [productResponse, sliderResponse, bannerPayload] = await Promise.all([
            fetch(`${API_BASE_URL}/products${query}`, { headers: authHeaders }),
            fetch(`${API_BASE_URL}/home-sliders`, { headers: authHeaders }),
            fetch(`${API_BASE_URL}/banners`, { headers: authHeaders })
              .then(async (response) => (response.ok ? response.json() : { data: [] }))
              .catch(() => ({ data: [] })),
          ]);
          const productPayload = await productResponse.json();
          const sliderPayload = await sliderResponse.json();

          if (!productResponse.ok) {
            throw new Error(productPayload.message || 'Could not load products.');
          }

          if (!sliderResponse.ok) {
            throw new Error(sliderPayload.message || 'Could not load home sliders.');
          }

          const loadedProducts = productPayload.data || [];
          setProducts(companyName
            ? loadedProducts.filter((product) => normalizedText(product.company).includes(companyName))
            : loadedProducts);
          setHomeSliders(sliderPayload.data || []);
          setBanners(bannerPayload.data || []);
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

      await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify({
        token: data.token,
        customer: data.customer,
      }));
      setAuthToken(data.token);
      setAuthUser(data.customer);
      setScreen('products');
      setAuthForm({
        name: '',
        gmail: '',
        phone: '',
        address: '',
        password: '',
      });
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

    await SecureStore.deleteItemAsync(AUTH_SESSION_KEY).catch(() => {});
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
    if (Number(product.stock || 0) <= 0) {
      return;
    }

    const existingItem = cartItems.find((item) => item.product.id === product.id);
    if (existingItem && existingItem.quantity >= Number(product.stock)) {
      setAppAlert({
        type: 'warning',
        title: 'Stock Limit Reached',
        message: `Only ${product.stock} unit(s) of ${product.name} are currently available.`,
      });
      return;
    }

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
    setAppAlert({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added successfully. You can continue shopping.`,
      buttonText: 'Continue Shopping',
    });
  };

  const updateQuantity = (productId, change) => {
    setCartItems((currentItems) => currentItems
      .map((item) => (
        item.product.id === productId
          ? {
            ...item,
            quantity: Math.min(Number(item.product.stock || 0), Math.max(0, item.quantity + change)),
          }
          : item
      ))
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const submitOrder = async () => {
    if (!customer.customer_name.trim() || !customer.customer_phone.trim() || !customer.customer_address.trim()) {
      setAppAlert({ type: 'warning', title: 'Missing Details', message: 'Please enter customer name, phone, and address.' });
      return;
    }

    if (cartItems.length === 0) {
      setAppAlert({ type: 'warning', title: 'Your Cart Is Empty', message: 'Please add medicine before checkout.' });
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
      const updatedAuthUser = {
        ...authUser,
        address: customer.customer_address,
      };
      setAuthUser(updatedAuthUser);
      await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify({
        token: authToken,
        customer: updatedAuthUser,
      })).catch(() => {});
      setCustomer((current) => ({
        ...current,
        customer_name: authUser?.name || current.customer_name,
        customer_phone: authUser?.phone || current.customer_phone,
        customer_address: current.customer_address,
        notes: '',
      }));
      await fetchOrders(authHeaders);
      setScreen('products');
      setAppAlert({
        type: 'success',
        title: 'Order Placed!',
        message: payload.message || 'Your order has been placed successfully. We will keep you updated.',
        buttonText: 'Continue Shopping',
      });
    } catch (error) {
      setAppAlert({ type: 'error', title: 'Order Failed', message: apiErrorMessage(error, 'Could not place order.'), buttonText: 'Try Again' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAuth = () => {
    const isRegister = authMode === 'register';

    const changeAuthMode = (mode) => {
      setAuthMode(mode);
      setAuthError('');
    };

    const renderAuthInput = ({
      field,
      icon,
      label,
      placeholder,
      keyboardType = 'default',
      multiline = false,
      secure = false,
    }) => (
      <View style={authStyles.fieldGroup}>
        <Text style={authStyles.label}>{label}</Text>
        <View style={[authStyles.inputShell, multiline ? authStyles.textAreaShell : null]}>
          <MaterialCommunityIcons name={icon} size={20} color="#668078" />
          <TextInput
            style={[authStyles.input, multiline ? authStyles.textArea : null]}
            value={authForm[field]}
            onChangeText={(value) => updateAuthForm(field, value)}
            placeholder={placeholder}
            placeholderTextColor="#8b9d97"
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            autoCorrect={false}
            keyboardType={keyboardType}
            multiline={multiline}
            secureTextEntry={secure && !showPassword}
          />
          {secure ? (
            <TouchableOpacity
              style={authStyles.passwordToggle}
              onPress={() => setShowPassword((current) => !current)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color="#668078"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );

    return (
      <ScrollView
        contentContainerStyle={authStyles.scrollPage}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />
        <View style={authStyles.brandBlock}>
          <View style={authStyles.logoFrame}>
            <Image
              source={require('./assets/icon.png')}
              style={authStyles.logo}
              resizeMode="cover"
              accessibilityLabel="MED Bangladesh app icon"
            />
          </View>
          <Text style={authStyles.brand}>MED Bangladesh</Text>
          <Text style={authStyles.subtitle}>Trusted medicine, delivered to your door</Text>
        </View>

        <View style={authStyles.form}>
          <Text style={authStyles.title}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={authStyles.formSubtitle}>
            {isRegister ? 'Enter your details to get started.' : 'Sign in to continue to your account.'}
          </Text>

          <View style={authStyles.modeSwitch}>
            <TouchableOpacity
              style={[authStyles.modeOption, !isRegister ? authStyles.modeOptionActive : null]}
              onPress={() => changeAuthMode('login')}
            >
              <Text style={[authStyles.modeText, !isRegister ? authStyles.modeTextActive : null]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[authStyles.modeOption, isRegister ? authStyles.modeOptionActive : null]}
              onPress={() => changeAuthMode('register')}
            >
              <Text style={[authStyles.modeText, isRegister ? authStyles.modeTextActive : null]}>Register</Text>
            </TouchableOpacity>
          </View>

          {authError ? <Text style={authStyles.error}>{authError}</Text> : null}

          {isRegister ? (
            renderAuthInput({ field: 'name', icon: 'account-outline', label: 'Full name', placeholder: 'Enter your full name' })
          ) : null}

          {renderAuthInput({
            field: 'gmail',
            icon: isRegister ? 'email-outline' : 'account-circle-outline',
            label: isRegister ? 'Email address (optional)' : 'Email or mobile number',
            placeholder: isRegister ? 'name@example.com' : 'Enter email or mobile number',
            keyboardType: isRegister ? 'email-address' : 'default',
          })}

          {isRegister ? (
            <>
              {renderAuthInput({ field: 'phone', icon: 'phone-outline', label: 'Mobile number', placeholder: '01XXXXXXXXX', keyboardType: 'phone-pad' })}
              {renderAuthInput({ field: 'address', icon: 'map-marker-outline', label: 'Delivery address', placeholder: 'House, road, area and city', multiline: true })}
            </>
          ) : null}

          {renderAuthInput({ field: 'password', icon: 'lock-outline', label: 'Password', placeholder: isRegister ? 'At least 6 characters' : 'Enter your password', secure: true })}

          <TouchableOpacity
            style={[authStyles.button, isAuthSubmitting ? cartStyles.disabledButton : null]}
            onPress={submitAuth}
            disabled={isAuthSubmitting}
            activeOpacity={0.85}
          >
            <Text style={authStyles.buttonText}>
              {isAuthSubmitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Login Securely'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => changeAuthMode(isRegister ? 'login' : 'register')}>
            <Text style={authStyles.switchText}>
              {isRegister ? 'Already have an account? ' : 'New to MED Bangladesh? '}
              <Text style={authStyles.switchAction}>{isRegister ? 'Login' : 'Create account'}</Text>
            </Text>
          </TouchableOpacity>

          <View style={authStyles.secureNote}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color="#3a7562" />
            <Text style={authStyles.secureNoteText}>Your information is securely protected</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderProductListHeader = () => (
    <>
      {isSearching ? (
        <View style={appStyles.searchResultHeader}>
          <Text style={appStyles.searchResultTitle}>Search results</Text>
          {!isLoading ? (
            <Text style={appStyles.searchResultCount}>{products.length} {products.length === 1 ? 'product' : 'products'} found</Text>
          ) : null}
        </View>
      ) : (
        <>
          <BannerCarousel banners={banners} />
          {homeSliders.map((slider) => (
            <HomeProductSlider
              key={slider.id}
              slider={slider}
              onAddToCart={handleAddToCart}
            />
          ))}
        </>
      )}
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
    <View style={appStyles.productsScreen}>
      <SearchFilters
        productSearch={productSearch}
        companySearch={companySearch}
        onProductSearchChange={setProductSearch}
        onCompanySearchChange={setCompanySearch}
      />
      <FlatList
        numColumns={2}
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={handleAddToCart} />
        )}
        ListHeaderComponent={renderProductListHeader}
        ListEmptyComponent={!isLoading ? (
          <Text style={appStyles.emptyText}>No products found.</Text>
        ) : null}
        columnWrapperStyle={appStyles.productRow}
        contentContainerStyle={appStyles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
        <Text style={cartStyles.primaryButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCheckout = () => (
    <ScrollView contentContainerStyle={cartStyles.page}>
      <View style={cartStyles.headerRow}>
        <Text style={cartStyles.title}>Review & Confirm</Text>
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
        <Text style={cartStyles.primaryButtonText}>{isSubmitting ? 'Confirming...' : 'Confirm Order'}</Text>
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

  if (isAuthRestoring) {
    return (
      <View style={authStyles.page}>
        <StatusBar style="dark" />
        <ActivityIndicator color="#1a7f5a" size="large" />
      </View>
    );
  }

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
      <AppAlert alert={appAlert} onClose={() => setAppAlert(null)} />
    </View>
  );
}
