import { StyleSheet, View } from "react-native";
import { Robot } from "./Robot";
import { color } from "./tokens";

/** A static, original set: decoration stays out of touch and reading order. */
export function WorkshopScene({
  reducedMotion = false,
  compact = false,
}: {
  reducedMotion?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={[s.scene, compact && { height: 278, paddingTop: 0 }]}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={StyleSheet.absoluteFill}
      >
        <View style={s.wall} />
        <View style={s.window}>
          <View style={s.cloud} />
          <View style={s.windowCross} />
          <View style={s.windowUpright} />
        </View>
        <View style={s.pegboard}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={s.peg} />
          ))}
          <View style={s.toolHandle} />
          <View style={s.toolHead} />
        </View>
        <View style={s.shelf} />
        <View style={s.jar}>
          <View style={s.jarTop} />
        </View>
        <View style={s.floor} />
        <View style={s.shadow} />
      </View>
      <View style={compact ? s.compactRobot : undefined}>
        <View style={compact ? s.scaledRobot : undefined}>
          <Robot reducedMotion={reducedMotion} />
        </View>
      </View>
      <View pointerEvents="none" style={s.bench} />
      <View pointerEvents="none" style={s.benchFront}>
        <View style={s.drawer}>
          <View style={s.handle} />
        </View>
        <View style={s.drawer}>
          <View style={s.handle} />
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  compactRobot: { width: 230, height: 216 },
  scaledRobot: {
    position: "absolute",
    bottom: -42,
    transform: [{ scale: 0.72 }],
  },
  scene: {
    width: "100%",
    height: 394,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: color.mintLight,
    paddingTop: 36,
  },
  wall: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 12,
    backgroundColor: color.mint,
  },
  window: {
    position: "absolute",
    right: 22,
    top: 34,
    width: 116,
    height: 116,
    borderRadius: 60,
    borderWidth: 9,
    borderColor: color.paper,
    backgroundColor: color.sky,
    overflow: "hidden",
  },
  windowCross: {
    position: "absolute",
    top: 45,
    height: 6,
    width: "100%",
    backgroundColor: color.paper,
  },
  windowUpright: {
    position: "absolute",
    left: 45,
    width: 6,
    height: "100%",
    backgroundColor: color.paper,
  },
  cloud: {
    position: "absolute",
    left: 12,
    top: 21,
    width: 60,
    height: 20,
    borderRadius: 20,
    backgroundColor: color.white,
  },
  pegboard: {
    position: "absolute",
    left: 20,
    top: 37,
    width: 102,
    height: 112,
    padding: 12,
    borderRadius: 16,
    backgroundColor: color.paper,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 17,
  },
  peg: { width: 5, height: 5, borderRadius: 3, backgroundColor: color.line },
  toolHandle: {
    position: "absolute",
    left: 41,
    top: 28,
    width: 12,
    height: 62,
    borderRadius: 7,
    backgroundColor: color.blue,
  },
  toolHead: {
    position: "absolute",
    left: 24,
    top: 20,
    width: 47,
    height: 20,
    borderRadius: 7,
    backgroundColor: color.ink,
  },
  shelf: {
    position: "absolute",
    top: 210,
    right: 12,
    width: 68,
    height: 10,
    borderRadius: 3,
    backgroundColor: color.woodDark,
  },
  jar: {
    position: "absolute",
    top: 168,
    right: 27,
    width: 35,
    height: 43,
    borderRadius: 8,
    backgroundColor: color.yellow,
  },
  jarTop: { height: 8, backgroundColor: color.yellowDark, borderRadius: 4 },
  floor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 105,
    backgroundColor: color.mint,
  },
  shadow: {
    position: "absolute",
    bottom: 59,
    width: 240,
    height: 24,
    borderRadius: 120,
    backgroundColor: color.mintDark,
    opacity: 0.15,
    alignSelf: "center",
  },
  bench: {
    width: "90%",
    height: 15,
    backgroundColor: color.wood,
    borderRadius: 5,
    borderBottomWidth: 4,
    borderColor: color.woodDark,
  },
  benchFront: {
    width: "80%",
    height: 43,
    backgroundColor: color.woodDark,
    flexDirection: "row",
    padding: 6,
    gap: 8,
  },
  drawer: {
    flex: 1,
    backgroundColor: color.wood,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: { width: 26, height: 5, borderRadius: 3, backgroundColor: color.ink },
});
