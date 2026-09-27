import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Robot } from "./Robot";
import { color } from "./tokens";

/** A single cause-and-effect response, started by the learner's Test button. */
export function MissionTestBench({
  kind,
  tested,
  reducedMotion,
}: {
  kind: "power" | "seat";
  tested: boolean;
  reducedMotion: boolean;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (reducedMotion || !tested) {
      progress.setValue(tested ? 1 : 0);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion, tested]);
  const seat = kind === "seat";
  const description = seat
    ? tested
      ? "Sam is sitting on the mat."
      : "Sam is ready to try the seat."
    : tested
      ? "The workbench lights are on."
      : "The workbench lights are off.";
  return (
    <View accessible accessibilityLabel={description} style={s.scene}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={s.picture}
      >
        <View style={s.wallPanel} />
        {seat ? (
          <View style={s.seat}>
            <View style={s.mat} />
            <View style={s.seatTop} />
            <View style={[s.leg, { left: 16 }]} />
            <View style={[s.leg, { right: 16 }]} />
          </View>
        ) : (
          <View style={s.lights}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={s.lamp}>
                <Animated.View style={[s.lit, { opacity: progress }]} />
              </View>
            ))}
          </View>
        )}
        <Animated.View
          style={[
            s.robot,
            seat && { top: 5 },
            {
              transform: [
                {
                  translateY: seat
                    ? progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 20],
                      })
                    : 0,
                },
              ],
            },
          ]}
        >
          <View style={s.smallRobot}>
            <Robot reducedMotion />
          </View>
        </Animated.View>
        <View style={s.bench} />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  scene: {
    width: "100%",
    maxWidth: 420,
    height: 250,
    borderRadius: 24,
    backgroundColor: color.blueLight,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: color.line,
  },
  picture: { flex: 1, alignItems: "center" },
  wallPanel: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 32,
    borderWidth: 2,
    borderColor: color.line,
    borderRadius: 18,
  },
  robot: { position: "absolute", top: 43, width: 230, height: 190, zIndex: 2 },
  smallRobot: { transform: [{ scale: 0.58 }], marginTop: -58 },
  bench: {
    position: "absolute",
    bottom: 20,
    height: 15,
    width: "88%",
    backgroundColor: color.wood,
    borderColor: color.woodDark,
    borderWidth: 2,
    borderRadius: 7,
  },
  lights: { flexDirection: "row", gap: 24, position: "absolute", top: 32 },
  lamp: {
    height: 22,
    width: 34,
    borderWidth: 2,
    borderColor: color.ink,
    borderRadius: 8,
    backgroundColor: color.metal,
    overflow: "hidden",
  },
  lit: { flex: 1, backgroundColor: color.yellow },
  seat: { position: "absolute", top: 188, width: 160, height: 42 },
  mat: {
    height: 12,
    backgroundColor: color.mint,
    borderWidth: 2,
    borderColor: color.mintDark,
    borderRadius: 7,
    marginHorizontal: 6,
  },
  seatTop: {
    height: 12,
    backgroundColor: color.wood,
    borderWidth: 2,
    borderColor: color.woodDark,
    borderRadius: 5,
  },
  leg: {
    position: "absolute",
    width: 12,
    height: 20,
    top: 22,
    backgroundColor: color.woodDark,
    borderRadius: 4,
  },
});
