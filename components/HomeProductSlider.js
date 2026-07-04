import { useEffect, useMemo, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import ProductCard from './ProductCard';
import { homeStyles } from '../styles/homeStyles';

const CARD_GAP = 10;
const AUTO_SLIDE_DELAY = 4500;

export default function HomeProductSlider({ slider, onAddToCart }) {
  const listRef = useRef(null);
  const currentIndex = useRef(0);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 30) / 2;
  const itemSpan = cardWidth + CARD_GAP;
  const products = slider.products || [];
  const pageStarts = useMemo(() => {
    const lastRowStart = Math.max(products.length - 2, 0);

    return Array.from(
      new Set(Array.from(
        { length: Math.ceil(products.length / 2) },
        (_, page) => Math.min(page * 2, lastRowStart),
      )),
    );
  }, [products.length]);

  const moveTo = (nextIndex) => {
    if (pageStarts.length <= 1) {
      return;
    }

    currentIndex.current = nextIndex;
    listRef.current?.scrollToOffset({
      offset: nextIndex * itemSpan,
      animated: true,
    });
  };

  const moveByPage = (direction) => {
    const currentPage = pageStarts.reduce((closestPage, start, page) => (
      Math.abs(start - currentIndex.current)
        < Math.abs(pageStarts[closestPage] - currentIndex.current)
        ? page
        : closestPage
    ), 0);
    const nextPage = (currentPage + direction + pageStarts.length) % pageStarts.length;

    moveTo(pageStarts[nextPage]);
  };

  useEffect(() => {
    currentIndex.current = 0;
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [itemSpan, slider.id]);

  useEffect(() => {
    if (pageStarts.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      moveByPage(1);
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(interval);
  }, [itemSpan, pageStarts]);

  return (
    <View style={homeStyles.sliderSection}>
      <View style={homeStyles.sliderHeader}>
        <Text style={homeStyles.sliderTitle}>{slider.name}</Text>
        <View style={homeStyles.sliderTitleLine} />
        <View style={homeStyles.sliderArrows}>
          <TouchableOpacity
            style={homeStyles.sliderArrow}
            onPress={() => moveByPage(-1)}
            accessibilityRole="button"
            accessibilityLabel={`Previous ${slider.name} products`}
          >
            <MaterialCommunityIcons name="chevron-left" size={22} color="#14543e" />
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.sliderArrow}
            onPress={() => moveByPage(1)}
            accessibilityRole="button"
            accessibilityLabel={`Next ${slider.name} products`}
          >
            <MaterialCommunityIcons name="chevron-right" size={22} color="#14543e" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        horizontal
        data={products}
        keyExtractor={(item) => `slider-${slider.id}-${item.id}`}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={onAddToCart}
            style={[homeStyles.sliderCard, { width: cardWidth }]}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        contentContainerStyle={homeStyles.sliderList}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemSpan}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          currentIndex.current = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
        }}
      />
    </View>
  );
}
