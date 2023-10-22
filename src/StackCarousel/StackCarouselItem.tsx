import type { FC } from "react";
import React, { memo, useLayoutEffect } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface StackCarouselItemProps {
  index: number;
  itemsLength: number;
  itemWidth?: number;
  offsetX: Animated.SharedValue<number>;
  style?: ViewStyle;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  item: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

const calculateStyles = (sharedValue: number) => {
  "worklet";
  const scale = interpolate(sharedValue, [-200, 0, 200], [0.85, 1, 1]);
  const zIndex = interpolate(sharedValue, [-400, -200, 0], [-1, 1, 2]);
  const opacity = interpolate(sharedValue, [-600, 0, 200], [0, 1, 1]);
  const translateX = interpolate(
    sharedValue,
    [-200, 0, 100, 200],
    [-50, 0, 100, 400],
  );

  return {
    opacity,
    zIndex,
    transform: [{ translateX }, { scale }],
  };
};

const StackCarouselItem: FC<StackCarouselItemProps> = memo(
  ({ index, itemsLength, itemWidth, offsetX, style, children }) => {
    const currentPositionOffset = useSharedValue(0);

    useLayoutEffect(() => {
      currentPositionOffset.value = 0;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsLength]);

    const rStyle = useAnimatedStyle(() => {
      if (!itemWidth) throw new Error("Item width is required");
      if (!itemsLength) throw new Error("Items length is required");

      if (itemsLength < 2) return calculateStyles(offsetX.value);

      const totalItemOffset =
        -index * itemWidth + offsetX.value + currentPositionOffset.value;

      // If we have more then one items on the right side,
      // we need to move the second item to the left
      if (totalItemOffset >= itemWidth * 1)
        currentPositionOffset.value -= itemsLength * itemWidth - 1;
      // Last Item on the left end is pushed to the right end
      else if (totalItemOffset <= -(itemsLength - 1) * itemWidth)
        currentPositionOffset.value += itemsLength * itemWidth + 1;

      // Stay in -1/+1 offset error range
      currentPositionOffset.value =
        Math.round(currentPositionOffset.value / 10) * 10 - 1;

      return calculateStyles(totalItemOffset);
    });

    return (
      <Animated.View style={[styles.item, style, rStyle]}>
        {children}
      </Animated.View>
    );
  },
);

export default StackCarouselItem;
