import { useRef } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
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
    <View style={{ gap: 32, alignItems: "center" }}>
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
              onPress={() => {
                if (selected) onPlace(selected, i);
              }}
              style={{
                width: slotWidth,
                height: 92,
                backgroundColor: value ? "white" : "#E8EFF3",
                borderRadius: 18,
                borderWidth: 3,
                borderStyle: value ? "solid" : "dashed",
                borderColor: color.line,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 48, fontWeight: "600", color: color.ink }}
              >
                {choices.find((c) => c.id === value)?.grapheme ?? ""}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
      <View
        key={`${width}:${height}`}
        style={[ui.row, { justifyContent: "center", gap: 14 }]}
      >
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
