import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { WorkshopScene } from "../../ui/WorkshopScene";
import { WorkshopButton } from "../../ui/WorkshopButton";
import { WorkshopIcon } from "../../ui/WorkshopIcon";
import { color, ui } from "../../ui/tokens";
export function WorkshopScreen({
  onStart,
  onParent,
  parts = 0,
  reducedMotion = false,
  error = "",
  replays = [],
  onReplay,
  nextLessonTitle = "Wake up the workshop",
}: {
  onStart: () => void;
  onParent: () => void;
  parts?: number;
  reducedMotion?: boolean;
  error?: string;
  replays?: { id: string; title: string }[];
  onReplay?: (id: string) => void;
  nextLessonTitle?: string;
}) {
  const { width, fontScale } = useWindowDimensions();
  const wide = width >= 760 && fontScale < 1.5;
  return (
    <ScrollView
      testID="workshop"
      style={ui.page}
      contentContainerStyle={[
        ui.content,
        {
          paddingTop: 60,
          paddingBottom: 40,
          paddingHorizontal: width < 420 ? 18 : 28,
        },
      ]}
    >
      <View style={[ui.row, s.header]}>
        <View style={s.brand}>
          <View accessible={false} style={s.brandMark}>
            <View style={s.brandEye} />
            <View style={s.brandEye} />
          </View>
          <Text accessibilityRole="header" style={s.brandTitle}>
            Read to Lead
          </Text>
        </View>
        <WorkshopButton
          label="Grown-ups"
          accessibilityLabel="Parent area"
          onPress={onParent}
          tone="quiet"
        />
      </View>
      <View style={[s.workshop, wide && s.workshopWide]}>
        <View style={[s.scene, wide && s.sceneWide]}>
          <WorkshopScene reducedMotion={reducedMotion} compact={width < 600} />
        </View>
        <View style={[s.mission, wide && s.missionWide]}>
          <Text
            accessibilityRole="header"
            style={[
              s.title,
              !wide && s.center,
              width < 600 && { fontSize: 32, lineHeight: 36 },
            ]}
          >
            Little sounds.{"\n"}Big inventions.
          </Text>
          <Text style={[ui.body, !wide && s.center]}>
            Help your robot bring the workshop to life.
          </Text>
          <View style={[s.missionLabel, !wide && { alignSelf: "center" }]}>
            <WorkshopIcon name="part" ink={color.mintDark} />
            <Text style={s.missionText}>{nextLessonTitle}</Text>
          </View>
          <WorkshopButton
            testID="start-lesson"
            label="Let’s build"
            accessibilityLabel="Start lesson"
            onPress={onStart}
            icon="play"
            tone="yellow"
          />
        </View>
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={ui.error}>
          {error}
        </Text>
      ) : null}
      <View style={[s.collection, !wide && { alignItems: "flex-start" }]}>
        <View style={s.collectionCopy}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            Your workshop
          </Text>
          <Text style={ui.small}>{parts} of 2 robot parts collected</Text>
        </View>
        <View style={s.parts}>
          {[0, 1].map((i) => (
            <View
              key={i}
              accessible
              accessibilityLabel={`Robot part ${i + 1}, ${parts > i ? "collected" : "not collected yet"}`}
              style={[s.part, parts > i && s.collected]}
            >
              <WorkshopIcon
                name="part"
                ink={parts > i ? color.mintDark : color.muted}
              />
              {parts > i ? (
                <View style={s.partCheck}>
                  <WorkshopIcon name="check" ink={color.mintDark} />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
      {replays.length > 0 ? (
        <View style={s.replays}>
          <Text accessibilityRole="header" style={s.sectionTitle}>
            Build again
          </Text>
          <View style={s.replayRow}>
            {replays.map((lesson) => (
              <WorkshopButton
                key={lesson.id}
                label={lesson.title}
                accessibilityLabel={`Replay ${lesson.title}`}
                icon="replay"
                tone="quiet"
                onPress={() => onReplay?.(lesson.id)}
              />
            ))}
          </View>
        </View>
      ) : null}
      <Text style={[ui.small, s.preview]}>
        Developer preview · Teaching content awaits review
      </Text>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  header: { justifyContent: "space-between", gap: 12 },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandMark: {
    width: 42,
    height: 36,
    borderRadius: 13,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: color.yellowDark,
    backgroundColor: color.yellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  brandEye: {
    width: 5,
    height: 9,
    borderRadius: 4,
    backgroundColor: color.ink,
  },
  brandTitle: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: "800",
    color: color.ink,
    letterSpacing: -0.7,
  },
  workshop: {
    backgroundColor: color.paper,
    borderRadius: 36,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: color.line,
    padding: 14,
    gap: 20,
  },
  workshopWide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
    padding: 22,
  },
  scene: { width: "100%" },
  sceneWide: { width: "48%" },
  mission: { gap: 18, padding: 8 },
  missionWide: { flex: 1, paddingVertical: 22, paddingRight: 6 },
  title: {
    fontSize: 42,
    lineHeight: 47,
    letterSpacing: -1.3,
    fontWeight: "800",
    color: color.ink,
  },
  center: { textAlign: "center" },
  missionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  missionText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: color.muted,
    flexShrink: 1,
  },
  collection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    paddingHorizontal: 6,
  },
  collectionCopy: { gap: 4 },
  sectionTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "800",
    color: color.ink,
  },
  parts: { flexDirection: "row", gap: 12 },
  part: {
    width: 72,
    height: 64,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: color.muted,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.paper,
  },
  collected: {
    backgroundColor: color.mintLight,
    borderColor: color.mintDark,
    borderStyle: "solid",
  },
  partCheck: {
    position: "absolute",
    right: -7,
    top: -9,
    width: 26,
    height: 26,
    backgroundColor: color.paper,
    borderRadius: 13,
    transform: [{ scale: 0.65 }],
  },
  replays: { gap: 12, paddingHorizontal: 6 },
  replayRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  preview: { textAlign: "center", fontSize: 13 },
});
