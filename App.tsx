import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";
import { verifyRuntimeReview } from "./src/content/runtime-review";
import { openNativeProgress } from "./src/progress/native";
import { nativeAudio } from "./src/audio/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, AppState, ScrollView, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WorkshopScreen } from "./src/features/workshop/WorkshopScreen";
import { LessonScreen } from "./src/features/lesson/LessonScreen";
import { ParentGate } from "./src/features/parent/ParentGate";
import { ParentScreen } from "./src/features/parent/ParentScreen";
import { catalog, catalogErrors } from "./src/content/catalog";
import {
  emptySummary,
  type ProgressRepository,
} from "./src/progress/repository";
import type { AudioController } from "./src/audio/controller";
import { ui } from "./src/ui/tokens";
type Dependencies = { repository: ProgressRepository; audio: AudioController };
async function loadNative(): Promise<Dependencies> {
  if (!__DEV__)
    await verifyRuntimeReview(catalog, (text) =>
      digestStringAsync(CryptoDigestAlgorithm.SHA256, text),
    );
  return { repository: await openNativeProgress(), audio: nativeAudio };
}
export default function App({
  load = loadNative,
}: {
  load?: () => Promise<Dependencies>;
}) {
  const [screen, setScreen] = useState<
    "workshop" | "lesson" | "gate" | "parent"
  >("workshop");
  const [dependencies, setDependencies] = useState<Dependencies | null>(null);
  const loading = useRef<Promise<Dependencies> | null>(null);
  const [summary, setSummary] = useState(emptySummary);
  const [error, setError] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [motion, setMotion] = useState(false);
  const [systemMotion, setSystemMotion] = useState(false);
  const invalid = catalogErrors(__DEV__);
  const ensure = useCallback(async () => {
    if (dependencies) return dependencies;
    if (!loading.current) loading.current = load();
    try {
      const d = await loading.current;
      setDependencies(d);
      setSummary(await d.repository.summary("local-learner"));
      return d;
    } catch (e) {
      loading.current = null;
      throw e;
    }
  }, [dependencies, load]);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setSystemMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemMotion,
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active") {
        dependencies?.audio.stop();
        setScreen((current) =>
          current === "parent" || current === "gate" ? "workshop" : current,
        );
      }
    });
    return () => sub.remove();
  }, [dependencies]);
  useEffect(() => {
    if (dependencies)
      void dependencies.repository
        .summary("local-learner")
        .then(setSummary)
        .catch(() =>
          setError("Progress could not be loaded. Please try again."),
        );
  }, [dependencies, screen]);
  useEffect(() => {
    void ensure().catch(() =>
      setError("Local progress could not be loaded. Tap to retry."),
    );
  }, [ensure]);
  const enter = (next: "lesson" | "gate") => {
    setError("");
    void ensure()
      .then(() => setScreen(next))
      .catch(() =>
        setError(
          "Local progress is unavailable. Tap again to retry. Your saved data has not been reset.",
        ),
      );
  };
  const audio = useMemo<AudioController>(
    () => ({
      play: (id) =>
        audioEnabled && dependencies
          ? dependencies.audio.play(id)
          : Promise.resolve(),
      stop: () => dependencies?.audio.stop(),
    }),
    [audioEnabled, dependencies],
  );
  const home = useCallback(() => setScreen("workshop"), []);
  const lesson =
    catalog.lessons.find((l) => !summary.completedLessonIds.includes(l.id)) ??
    catalog.lessons[0];
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {invalid.length ? (
        <ScrollView
          style={ui.page}
          contentContainerStyle={[ui.content, { paddingTop: 70 }]}
        >
          <Text style={ui.title}>Teaching review required</Text>
          <Text style={ui.body}>
            This content pack is not approved for child use. Open a development
            build for adult review.
          </Text>
        </ScrollView>
      ) : screen === "lesson" && dependencies ? (
        <LessonScreen
          key={lesson.id}
          lesson={lesson}
          catalog={catalog}
          repository={dependencies.repository}
          audio={audio}
          onComplete={home}
          onExit={home}
          reducedMotion={motion || systemMotion}
        />
      ) : screen === "gate" ? (
        <ParentGate onOpen={() => setScreen("parent")} onExit={home} />
      ) : screen === "parent" && dependencies ? (
        <ParentScreen
          repository={dependencies.repository}
          onExit={home}
          audioEnabled={audioEnabled}
          reducedMotion={motion || systemMotion}
          onAudioChange={(v) => {
            if (!v) audio.stop();
            setAudioEnabled(v);
          }}
          onMotionChange={setMotion}
        />
      ) : (
        <WorkshopScreen
          onStart={() => enter("lesson")}
          onParent={() => enter("gate")}
          parts={summary.completedLessonIds.length}
          reducedMotion={motion || systemMotion}
          error={error}
        />
      )}
    </GestureHandlerRootView>
  );
}
