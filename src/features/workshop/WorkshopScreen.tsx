import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Robot } from "../../ui/Robot";
import { color, ui } from "../../ui/tokens";
export function WorkshopScreen({
  onStart,
  onParent,
  parts = 0,
  reducedMotion = false,
  error = "",
}: {
  onStart: () => void;
  onParent: () => void;
  parts?: number;
  reducedMotion?: boolean;
  error?: string;
}) {
  const { width } = useWindowDimensions();
  const wide = width > 700;
  return (
    <ScrollView
      testID="workshop"
      style={ui.page}
      contentContainerStyle={[
        ui.content,
        { paddingTop: 54, paddingBottom: 40 },
      ]}
    >
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        <Text accessibilityRole="header" style={[ui.title, { fontSize: 26 }]}>
          Read and Lead
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Parent area"
          onPress={onParent}
          style={[ui.button, ui.secondary]}
        >
          <Text style={[ui.small, { fontWeight: "700" }]}>Grown-ups</Text>
        </Pressable>
      </View>
      <View style={[s.workshop, { flexDirection: wide ? "row" : "column" }]}>
        <View
          style={{
            flex: 1,
            gap: 22,
            alignItems: wide ? "flex-start" : "center",
          }}
        >
          <Text
            style={[
              ui.title,
              { fontSize: wide ? 56 : 38, textAlign: wide ? "left" : "center" },
            ]}
          >
            Little sounds.{"\n"}Big inventions.
          </Text>
          <Text
            style={[
              ui.body,
              { maxWidth: 360, textAlign: wide ? "left" : "center" },
            ]}
          >
            Help your robot bring the workshop to life.
          </Text>
          <Pressable
            testID="start-lesson"
            accessibilityRole="button"
            accessibilityLabel="Start lesson"
            onPress={onStart}
            style={[
              ui.button,
              { backgroundColor: color.yellow, minWidth: 240 },
            ]}
          >
            <Text style={[ui.buttonText, { color: color.ink, fontSize: 25 }]}>
              ▶ Let’s build
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            s.robotStage,
            { width: wide ? 300 : Math.min(300, width - 112) },
          ]}
        >
          <View style={s.window}>
            <View style={s.windowBar} />
          </View>
          <Robot reducedMotion={reducedMotion} />
          <View style={s.bench} />
        </View>
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={ui.error}>
          {error}
        </Text>
      ) : null}
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        <View>
          <Text style={[ui.title, { fontSize: 25 }]}>Your workshop</Text>
          <Text style={ui.small}>{parts} of 2 robot parts collected</Text>
        </View>
        <View style={ui.row}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={[
                s.part,
                {
                  backgroundColor: parts > i ? color.mint : "transparent",
                  borderStyle: parts > i ? "solid" : "dashed",
                },
              ]}
            >
              <Text style={{ fontSize: 27, color: color.ink }}>
                {parts > i ? "✓" : "+"}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={ui.small}>
        Developer preview · Teaching content awaits review
      </Text>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  workshop: {
    backgroundColor: color.paper,
    borderRadius: 36,
    padding: 32,
    gap: 20,
    alignItems: "center",
    minHeight: 430,
  },
  robotStage: {
    width: 300,
    height: 360,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  window: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: color.sky,
    borderWidth: 8,
    borderColor: "#C9DBE7",
  },
  windowBar: {
    width: 7,
    height: "100%",
    backgroundColor: color.paper,
    alignSelf: "center",
  },
  bench: {
    height: 18,
    width: "100%",
    backgroundColor: "#A27345",
    borderRadius: 7,
    marginTop: 4,
  },
  part: {
    width: 62,
    height: 62,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
});
