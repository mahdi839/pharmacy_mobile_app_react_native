import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, useWindowDimensions, View } from 'react-native';

import { homeStyles } from '../styles/homeStyles';

const BANNER_GAP = 8;
const AUTO_SLIDE_DELAY = 5000;

export default function BannerCarousel({ banners }) {
  const listRef = useRef(null);
  const currentIndex = useRef(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { width } = useWindowDimensions();
  const bannerWidth = width - 20;
  const itemSpan = bannerWidth + BANNER_GAP;

  const moveTo = (index) => {
    if (banners.length === 0) {
      return;
    }

    const nextIndex = index >= banners.length ? 0 : index;
    currentIndex.current = nextIndex;
    setVisibleIndex(nextIndex);
    listRef.current?.scrollToOffset({
      offset: nextIndex * itemSpan,
      animated: true,
    });
  };

  useEffect(() => {
    currentIndex.current = 0;
    setVisibleIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [itemSpan, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      moveTo(currentIndex.current + 1);
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(interval);
  }, [banners.length, itemSpan]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={homeStyles.bannerSection}>
      <FlatList
        ref={listRef}
        horizontal
        data={banners}
        keyExtractor={(item) => `banner-${item.id}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={[homeStyles.bannerImage, { width: bannerWidth }]}
            resizeMode="cover"
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: BANNER_GAP }} />}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemSpan}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / itemSpan);
          currentIndex.current = index;
          setVisibleIndex(index);
        }}
      />
      {banners.length > 1 ? (
        <View style={homeStyles.bannerDots}>
          {banners.map((banner, index) => (
            <View
              key={banner.id}
              style={[
                homeStyles.bannerDot,
                index === visibleIndex ? homeStyles.bannerDotActive : null,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
