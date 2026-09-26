import { Pressable, StyleSheet, Text } from "react-native";
import { color, ui } from "./tokens";
import { WorkshopIcon, type WorkshopIconName } from "./WorkshopIcon";

export function WorkshopButton({
  label,
  accessibilityLabel = label,
  onPress,
  icon,
  tone = "blue",
  disabled = false,
  testID,
}: {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  icon?: WorkshopIconName;
  tone?: "blue" | "yellow" | "quiet";
  disabled?: boolean;
  testID?: string;
}) {
  const ink = tone === "blue" ? color.white : color.ink;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        s[tone],
        disabled && s.disabled,
        pressed && ui.pressed,
      ]}
    >
      {icon ? (
        <WorkshopIcon name={icon} ink={disabled ? color.muted : ink} />
      ) : null}
      <Text style={[s.label, { color: disabled ? color.muted : ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    minHeight: 64,
    maxWidth: "100%",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 6,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  blue: { backgroundColor: color.blue, borderColor: color.blueDark },
  yellow: { backgroundColor: color.yellow, borderColor: color.yellowDark },
  quiet: {
    backgroundColor: color.white,
    borderColor: color.line,
    borderBottomWidth: 4,
  },
  disabled: { backgroundColor: color.metal, borderColor: color.line },
  label: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
});
