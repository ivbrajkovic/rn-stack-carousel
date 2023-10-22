# :zap: React Native Stack Carousel

### Simple and lightweight image carousel for react native

Simple image carousel for React Native with card stack 3D effect.  
Only dependencies are react-native-reanimated and react-native-gesture-handler.

---

### 🚀 [Demo](https://snack.expo.dev/@ivbrajkovic/rn-stack-slider) - Expo snack example

---

![ezgif com-gif-maker](https://user-images.githubusercontent.com/44271953/158834461-28b1fe03-6d2f-47f8-ab5d-9427cdfc46d3.gif)

---

## Instalation 

```JS
yarn add react-native-reanimated
yarn add react-native-gesture-handler
yarn add rn-stack-carousel
```

## Basic usage

```JS
// slider.js
import React from 'react';
import {Image, StyleSheet, View } from 'react-native';
import StackCarousel from 'rn-stack-carousel';

const ITEM_HEIGHT = 400;

const urls = Array.from(
  { length: 10 },
  (_, i) => `https://picsum.photos/300/${ITEM_HEIGHT}?id=${i}`
);

export default function App() {
  return (
    <View style={styles.root}>
      <StackCarousel itemHeight={ITEM_HEIGHT}>
        {urls.map((url, index) => (
          <Image source={{ uri: url }} style={styles.itemImage} />
        ))}
      </StackCarousel>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  itemImage: {
    width: 300,
    height: 400,
    resizeMode: 'cover',
  },
});
```

