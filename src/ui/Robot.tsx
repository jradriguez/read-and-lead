import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { color } from "./tokens";
export function Robot({
  mood = "idle",
  reducedMotion = false,
}: {
  mood?: "idle" | "encourage" | "celebrate";
  reducedMotion?: boolean;
}) {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    bounce.stopAnimation();
    bounce.setValue(0);
    if (reducedMotion || mood === "idle") return;
    const a = Animated.sequence([
      Animated.timing(bounce, {
        toValue: -12,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(bounce, { toValue: 0, useNativeDriver: true }),
    ]);
    a.start();
    return () => a.stop();
  }, [mood, reducedMotion, bounce]);
  return (
    <Animated.View
      accessible
      accessibilityLabel={`Workshop robot, ${mood}`}
      style={[s.robot, { transform: [{ translateY: bounce }] }]}
    >
      <View style={s.antenna} />
      <View style={s.tip} />
      <View style={s.head}>
        <View style={s.face}>
          <View style={s.eye} />
          <View style={s.eye} />
          <View style={[s.smile, mood === "celebrate" && { height: 14 }]} />
        </View>
        <View style={s.bolt} />
      </View>
      <View style={s.body}>
        <View style={s.badge} />
        <View style={s.line} />
        <View style={s.line} />
      </View>
      <View style={[s.arm, { left: 2, transform: [{ rotate: "16deg" }] }]} />
      <View
        style={[
          s.arm,
          {
            right: 2,
            transform: [{ rotate: mood === "celebrate" ? "-65deg" : "-16deg" }],
          },
        ]}
      />
      <View style={[s.foot, { left: 43 }]} />
      <View style={[s.foot, { right: 43 }]} />
    </Animated.View>
  );
}
const s = StyleSheet.create({
  robot: { width: 230, height: 300, alignItems: "center" },
  antenna: { width: 8, height: 30, backgroundColor: color.ink, marginTop: 12 },
  tip: {
    position: "absolute",
    top: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.mint,
    borderWidth: 4,
    borderColor: color.ink,
  },
  head: {
    width: 202,
    height: 132,
    borderRadius: 40,
    backgroundColor: color.yellow,
    borderWidth: 4,
    borderColor: color.ink,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  face: {
    width: 146,
    height: 77,
    backgroundColor: color.ink,
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 17,
  },
  eye: { width: 17, height: 23, backgroundColor: color.paper, borderRadius: 9 },
  smile: {
    position: "absolute",
    bottom: 13,
    left: 59,
    width: 28,
    height: 7,
    backgroundColor: color.mint,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bolt: {
    position: "absolute",
    bottom: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D89E31",
  },
  body: {
    width: 132,
    height: 90,
    backgroundColor: color.blue,
    borderColor: color.ink,
    borderWidth: 4,
    borderRadius: 23,
    marginTop: 8,
    alignItems: "center",
    paddingTop: 17,
    zIndex: 1,
  },
  badge: {
    width: 26,
    height: 26,
    backgroundColor: color.mint,
    borderRadius: 13,
    marginBottom: 6,
  },
  line: { width: 35, height: 3, backgroundColor: color.sky, marginTop: 4 },
  arm: {
    position: "absolute",
    top: 187,
    width: 36,
    height: 69,
    borderRadius: 20,
    backgroundColor: color.yellow,
    borderWidth: 4,
    borderColor: color.ink,
  },
  foot: {
    position: "absolute",
    bottom: 2,
    width: 62,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.ink,
  },
});
