import { StyleSheet, Text, View } from "react-native";
import { color } from "../../ui/tokens";

export function LessonProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Lesson progress"
      accessibilityValue={{
        min: 0,
        max: total,
        now: completed,
        text: `${completed} of ${total} activities finished`,
      }}
      style={s.progress}
    >
      <View
        style={s.lights}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              s.light,
              i < completed && s.done,
              i === completed && s.current,
            ]}
          >
            {i < completed ? (
              <Text style={s.check}>✓</Text>
            ) : i === completed ? (
              <View style={s.dot} />
            ) : null}
          </View>
        ))}
      </View>
      <Text style={s.caption}>
        {completed} / {total}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  progress: { gap: 5, alignItems: "center", flexShrink: 1 },
  lights: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  light: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.line,
    alignItems: "center",
    justifyContent: "center",
  },
  done: { backgroundColor: color.mint, borderColor: color.mintDark },
  current: { borderColor: color.blue, borderWidth: 3 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.blue },
  check: { fontSize: 15, lineHeight: 18, color: color.ink, fontWeight: "800" },
  caption: { fontSize: 13, color: color.muted, fontWeight: "600" },
});
