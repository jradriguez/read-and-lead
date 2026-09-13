import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";
import { verifyRuntimeReview } from "./src/content/runtime-review";
import {
  openNativeProgress,
  resetUnavailableNativeProgress,
} from "./src/progress/native";
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
  recover = resetUnavailableNativeProgress,
}: {
  load?: () => Promise<Dependencies>;
  recover?: () => Promise<void>;
}) {
  const [screen, setScreen] = useState<
    "workshop" | "lesson" | "gate" | "parent"
  >("workshop");
  const [dependencies, setDependencies] = useState<Dependencies | null>(null);
  const loading = useRef<Promise<Dependencies> | null>(null);
  const recovering = useRef<Promise<void> | null>(null);
  const [summary, setSummary] = useState(emptySummary);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [activeLessonId, setActiveLessonId] = useState(catalog.lessons[0].id);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [motion, setMotion] = useState(false);
  const [systemMotion, setSystemMotion] = useState(false);
  const invalid = catalogErrors(__DEV__);
  const ensure = useCallback(async () => {
    if (recovering.current) await recovering.current;
    if (dependencies) return dependencies;
    if (!loading.current) loading.current = load();
    try {
      const d = await loading.current;
      setSummary(await d.repository.summary("local-learner"));
      setDependencies(d);
      setStorageError("");
      return d;
    } catch (e) {
      loading.current = null;
      setStorageError(
        e instanceof Error && e.message === "NEWER_SCHEMA"
          ? "This data needs a newer app version. Update the app to keep it."
          : "Local progress could not be opened. Retry before considering a reset.",
      );
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
    let alive = true;
    if (dependencies && screen === "workshop")
      void dependencies.repository
        .summary("local-learner")
        .then((value) => {
          if (alive) setSummary(value);
        })
        .catch(() => {
          if (alive)
            setError("Progress could not be loaded. Please try again.");
        });
    return () => {
      alive = false;
    };
  }, [dependencies, screen]);
  useEffect(() => {
    void ensure().catch(() =>
      setError("Local progress could not be loaded. Tap to retry."),
    );
  }, [ensure]);
  const enter = (replayId?: string) => {
    setError("");
    void ensure()
      .then(async (d) => {
        const latest = await d.repository.summary("local-learner");
        const next = replayId
          ? catalog.lessons.find(
              (l) =>
                l.id === replayId && latest.completedLessonIds.includes(l.id),
            )
          : (catalog.lessons.find(
              (l) => !latest.completedLessonIds.includes(l.id),
            ) ?? catalog.lessons[0]);
        if (!next) return;
        setSummary(latest);
        setActiveLessonId(next.id);
        setScreen("lesson");
      })
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
  const lesson = catalog.lessons.find((l) => l.id === activeLessonId)!;
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
      ) : screen === "parent" ? (
        <ParentScreen
          repository={dependencies?.repository ?? null}
          storageError={storageError}
          onRetry={async () => {
            await ensure();
          }}
          onRecover={
            !dependencies && storageError
              ? async () => {
                  if (!recovering.current) {
                    recovering.current = (async () => {
                      if (loading.current)
                        await loading.current.catch(() => {});
                      await recover();
                      loading.current = null;
                    })().finally(() => {
                      recovering.current = null;
                    });
                  }
                  await recovering.current;
                  await ensure();
                }
              : undefined
          }
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
          onStart={() => enter()}
          onParent={() => setScreen("gate")}
          replays={catalog.lessons.filter((l) =>
            summary.completedLessonIds.includes(l.id),
          )}
          onReplay={enter}
          parts={summary.completedLessonIds.length}
          reducedMotion={motion || systemMotion}
          error={error}
        />
      )}
    </GestureHandlerRootView>
  );
}
