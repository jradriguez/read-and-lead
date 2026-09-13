import { useMemo, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragged = useRef(false);
  const dropCallback = useRef(onDrop);
  dropCallback.current = onDrop;
  const draggable = !!onDrop;
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled && draggable)
        .minDistance(12)
        .runOnJS(true)
        .onStart(() => {
          dragged.current = true;
        })
        .onUpdate((e) => setOffset({ x: e.translationX, y: e.translationY }))
        .onEnd((e) => {
          dropCallback.current?.(e.absoluteX, e.absoluteY);
        })
        .onFinalize(() => {
          setOffset({ x: 0, y: 0 });
        }),
    [disabled, draggable],
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
      style={[
        s.tile,
        selected && s.selected,
        { transform: [{ translateX: offset.x }, { translateY: offset.y }] },
      ]}
    >
      <Text style={s.letter}>{label}</Text>
    </Pressable>
  );
  return onDrop ? (
    <GestureDetector gesture={gesture}>
      <View style={{ zIndex: offset.x || offset.y ? 10 : 0 }}>{tile}</View>
    </GestureDetector>
  ) : (
    tile
  );
}
const s = StyleSheet.create({
  tile: {
    width: 80,
    height: 88,
    borderRadius: 19,
    backgroundColor: "white",
    borderWidth: 3,
    borderBottomWidth: 7,
    borderColor: color.line,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { borderColor: color.blue, backgroundColor: "#E1ECFF" },
  letter: { fontSize: 48, fontWeight: "600", color: color.ink },
});
