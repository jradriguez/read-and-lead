import { useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { Pattern } from "../../content/types";
import { LetterTile } from "./LetterTile";
import { dropIndex, type Bounds } from "./placement";
import { color, ui } from "../../ui/tokens";
export function WordBuilder({
  choices,
  slots,
  selected,
  onSelect,
  onPlace,
  disabled,
}: {
  choices: Pattern[];
  slots: (string | null)[];
  selected: string | null;
  onSelect: (id: string) => void;
  onPlace: (id: string, index: number) => void;
  disabled: boolean;
}) {
  const refs = useRef<(View | null)[]>([]);
  const { width, height } = useWindowDimensions();
  const slotWidth = Math.max(
    56,
    Math.min(
      80,
      Math.floor((width - 112 - (slots.length - 1) * 12) / slots.length),
    ),
  );
  const drop = (id: string, x: number, y: number) => {
    const bounds: Bounds[] = [];
    let remaining = slots.length;
    refs.current.forEach((ref, i) => {
      if (!ref) {
        remaining--;
        return;
      }
      ref.measureInWindow((bx, by, w, h) => {
        bounds[i] = { x: bx, y: by, width: w, height: h };
        if (--remaining === 0) {
          const index = dropIndex(x, y, bounds);
          if (index >= 0) onPlace(id, index);
        }
      });
    });
  };
  return (
    <View style={{ gap: 24, alignItems: "center", width: "100%" }}>
      <View style={s.slotTray}>
        <View style={[ui.row, { justifyContent: "center", gap: 12 }]}>
          {slots.map((value, i) => (
            <View
              key={i}
              ref={(r) => {
                refs.current[i] = r;
              }}
              collapsable={false}
            >
              <Pressable
                testID={`slot-${i}`}
                accessibilityRole="button"
                accessibilityLabel={`Slot ${i + 1}${value ? `, ${choices.find((c) => c.id === value)?.grapheme}` : ", empty"}`}
                disabled={disabled}
                accessibilityState={{ disabled }}
                onPress={() => {
                  if (selected) onPlace(selected, i);
                }}
                style={({ pressed }) => [
                  {
                    width: slotWidth,
                    minHeight: 102,
                    paddingVertical: 10,
                    backgroundColor: value ? color.paper : color.sky,
                    borderRadius: 18,
                    borderWidth: 3,
                    borderStyle: value ? "solid" : "dashed",
                    borderColor: value ? color.blue : color.muted,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  pressed && { backgroundColor: color.yellow },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 48,
                    fontWeight: "600",
                    color: color.ink,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {choices.find((c) => c.id === value)?.grapheme ?? ""}
                </Text>
                <View pointerEvents="none" style={s.slotMark} />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
      <View key={`${width}:${height}`} style={[ui.row, s.tileTray]}>
        {choices.map((p) => (
          <LetterTile
            key={p.id}
            id={p.id}
            label={p.grapheme}
            selected={selected === p.id}
            disabled={disabled}
            onSelect={() => onSelect(p.id)}
            onDrop={(x, y) => drop(p.id, x, y)}
          />
        ))}
      </View>
      <Text style={[ui.small, { textAlign: "center" }]}>
        Drag a letter, or tap a letter and then a space.
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  slotTray: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: color.metal,
    borderTopWidth: 4,
    borderColor: color.line,
  },
  slotMark: {
    position: "absolute",
    bottom: 9,
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: color.muted,
  },
  tileTray: {
    justifyContent: "center",
    gap: 14,
    padding: 12,
    backgroundColor: color.blueLight,
    borderRadius: 24,
    borderBottomWidth: 4,
    borderColor: color.line,
  },
});
