import { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { color } from "../../ui/tokens";
export function LetterTile({
  id,
  label,
  selected,
  onSelect,
  onDrop,
  disabled = false,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onDrop?: (x: number, y: number) => void;
  disabled?: boolean;
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const active = useSharedValue(false);
  const alive = useRef(true);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const dragged = useRef(false);
  const dropCallback = useRef(onDrop);
  dropCallback.current = onDrop;
  const draggable = !!onDrop;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (disabled) {
      x.value = 0;
      y.value = 0;
      active.value = false;
    }
  }, [disabled, x, y, active]);
  const startDrag = useCallback(() => {
    dragged.current = true;
  }, []);
  const finishDrop = useCallback((px: number, py: number) => {
    if (alive.current && !disabledRef.current) dropCallback.current?.(px, py);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    zIndex: active.value ? 10 : 0,
  }));
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .withTestId(`drag-${id}`)
        .enabled(!disabled && draggable)
        .minDistance(12)
        .onStart(() => {
          active.value = true;
          scheduleOnRN(startDrag);
        })
        .onUpdate((e) => {
          x.value = e.translationX;
          y.value = e.translationY;
        })
        .onEnd((e, success) => {
          if (success) scheduleOnRN(finishDrop, e.absoluteX, e.absoluteY);
        })
        .onFinalize(() => {
          x.value = 0;
          y.value = 0;
          active.value = false;
        }),
    [disabled, draggable, id, active, x, y, startDrag, finishDrop],
  );
  const tile = (
    <Pressable
      testID={`tile-${id}`}
      accessibilityRole="button"
      accessibilityLabel={`Letter ${label}`}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        onSelect();
      }}
      onPressIn={() => {
        dragged.current = false;
      }}
      style={({ pressed }) => [
        s.tile,
        selected && s.selected,
        disabled && { opacity: 0.5 },
        pressed && { backgroundColor: color.yellow },
      ]}
    >
      <Text numberOfLines={1} adjustsFontSizeToFit style={s.letter}>
        {label}
      </Text>
      {selected ? <View pointerEvents="none" style={s.selectionMark} /> : null}
    </Pressable>
  );
  return onDrop ? (
    <GestureDetector gesture={gesture}>
      <Animated.View collapsable={false} style={animatedStyle}>
        {tile}
      </Animated.View>
    </GestureDetector>
  ) : (
    tile
  );
}
const s = StyleSheet.create({
  tile: {
    width: 80,
    minHeight: 96,
    paddingVertical: 10,
    borderRadius: 19,
    backgroundColor: color.paper,
    borderWidth: 3,
    borderBottomWidth: 8,
    borderColor: color.line,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { borderColor: color.blue, backgroundColor: color.blueLight },
  selectionMark: {
    position: "absolute",
    bottom: 5,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.blue,
  },
  letter: {
    fontSize: 48,
    fontWeight: "600",
    color: color.ink,
    width: "100%",
    textAlign: "center",
  },
});
