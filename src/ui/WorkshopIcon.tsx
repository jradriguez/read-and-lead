import { StyleSheet, View } from "react-native";
import { color } from "./tokens";

export type WorkshopIconName =
  "play" | "sound" | "home" | "replay" | "check" | "part";

/** Original shapes keep action icons bundled and consistent on both platforms. */
export function WorkshopIcon({
  name,
  ink = color.ink,
}: {
  name: WorkshopIconName;
  ink?: string;
}) {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={s.frame}
    >
      {name === "play" ? (
        <View style={[s.play, { borderLeftColor: ink }]} />
      ) : null}
      {name === "sound" ? (
        <>
          <View style={[s.speaker, { backgroundColor: ink }]} />
          <View style={[s.cone, { borderRightColor: ink }]} />
          <View style={[s.wave, { borderColor: ink }]} />
        </>
      ) : null}
      {name === "home" ? (
        <>
          <View style={[s.roof, { borderColor: ink }]} />
          <View style={[s.house, { borderColor: ink }]} />
        </>
      ) : null}
      {name === "replay" ? (
        <>
          <View style={[s.replay, { borderColor: ink }]} />
          <View style={[s.arrow, { borderBottomColor: ink }]} />
        </>
      ) : null}
      {name === "check" ? (
        <View style={[s.check, { borderColor: ink }]} />
      ) : null}
      {name === "part" ? (
        <>
          <View style={[s.part, { backgroundColor: ink }]} />
          <View style={[s.partHole, { backgroundColor: color.paper }]} />
        </>
      ) : null}
    </View>
  );
}
const s = StyleSheet.create({
  frame: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  play: {
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 4,
  },
  speaker: {
    position: "absolute",
    left: 2,
    top: 10,
    width: 7,
    height: 9,
    borderRadius: 2,
  },
  cone: {
    position: "absolute",
    left: 4,
    top: 5,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 11,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  wave: {
    position: "absolute",
    right: 1,
    width: 9,
    height: 20,
    borderRightWidth: 3,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  roof: {
    position: "absolute",
    top: 4,
    width: 15,
    height: 15,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    transform: [{ rotate: "45deg" }],
  },
  house: {
    position: "absolute",
    bottom: 3,
    width: 18,
    height: 14,
    borderWidth: 3,
    borderTopWidth: 0,
    borderRadius: 2,
  },
  replay: {
    width: 21,
    height: 21,
    borderWidth: 3,
    borderRadius: 12,
    borderLeftColor: "transparent",
  },
  arrow: {
    position: "absolute",
    left: 0,
    top: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "-30deg" }],
  },
  check: {
    width: 10,
    height: 19,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    transform: [{ rotate: "40deg" }],
    marginTop: -4,
  },
  part: {
    width: 22,
    height: 22,
    borderRadius: 6,
    transform: [{ rotate: "30deg" }],
  },
  partHole: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
});
