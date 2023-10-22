import type { CSSProperties, FC } from "react";
import React, { Children, memo, useLayoutEffect, useState } from "react";
import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { clamp } from "./math";
import StackCarouselItem from "./StackCarouselItem";
import { Direction } from "./types";

const DEFAULT_ITEM_WIDTH = 200;
const DEFAULT_ITEM_HEIGHT = "100%";
const DEFAULT_LEFT_MARGIN = Dimensions.get("screen").width * 0.05;
const DEFAULT_CHANGE_THRESHOLD = 80;

interface CarouselProps {
  disabled?: boolean;
  itemWidth?: number;
  itemHeight?: number | string;
  padding?: number;
  changeThreshold?: number;
}

const styles = StyleSheet.create({
  root: {
    left: DEFAULT_LEFT_MARGIN,
  },
});

const Carousel: FC<CarouselProps> = memo(
  ({
    disabled = false,
    itemWidth = DEFAULT_ITEM_WIDTH,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    changeThreshold = DEFAULT_CHANGE_THRESHOLD,
    children,
  }) => {
    const offsetX = useSharedValue(0);
    const currentPositionX = useSharedValue(0);
    const direction = useSharedValue(Direction.RIGHT);

    const [items, setItems] = useState<
      (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
    >([]);

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { startX: number }
    >({
      onStart: (_, ctx) => {
        ctx.startX = offsetX.value;
      },
      onActive: ({ translationX }, ctx) => {
        // If disabled, clamp the offset
        const translation = disabled
          ? clamp(translationX, -150, 0)
          : translationX;
        offsetX.value = ctx.startX + translation;
      },
      onEnd: ({ translationX }) => {
        // If disabled lock the carousel to the current position
        if (disabled) {
          offsetX.value = withTiming(-(currentPositionX.value * itemWidth));
          return;
        }

        // Get swipe direction
        direction.value = translationX < 0 ? Direction.RIGHT : Direction.LEFT;

        // Snap back to the center if lower than change threshold
        if (Math.abs(translationX) > changeThreshold)
          currentPositionX.value = currentPositionX.value + 1 * direction.value;

        // Snap to next position
        offsetX.value = withTiming(-(currentPositionX.value * itemWidth), {
          easing: Easing.out(Easing.ease),
        });
      },
    });

    useLayoutEffect(() => {
      const childrenArr = Children.toArray(children);
      // If children length is less then 4, clone children to fill 4 items
      for (let i = 0; childrenArr.length > 1 && childrenArr.length < 4; i++)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        childrenArr.push(childrenArr[i]!);
      setItems(childrenArr);
    }, [children]);

    return (
      <GestureHandlerRootView style={styles.root}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{ height: itemHeight } as ViewStyle}>
            {items.map((child, idx) => {
              return (
                <StackCarouselItem
                  key={idx}
                  index={idx}
                  offsetX={offsetX}
                  itemWidth={itemWidth}
                  itemsLength={items.length}
                >
                  {child}
                </StackCarouselItem>
              );
            })}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    );
  },
);

export default Carousel;
