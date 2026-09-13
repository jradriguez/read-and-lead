import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import {
  emptySummary,
  type ProgressRepository,
} from "../../progress/repository";
import { gateActive } from "./gate";
import { ui } from "../../ui/tokens";
export type ParentProps = {
  repository: ProgressRepository;
  onExit: () => void;
  audioEnabled: boolean;
  reducedMotion: boolean;
  onAudioChange: (v: boolean) => void;
  onMotionChange: (v: boolean) => void;
  now?: () => number;
};
export function ParentScreen({
  repository,
  onExit,
  audioEnabled,
  reducedMotion,
  onAudioChange,
  onMotionChange,
  now = Date.now,
}: ParentProps) {
  const [progress, setProgress] = useState(emptySummary);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const last = useRef(now());
  const locked = useRef(false);
  const lock = useRef(false);
  useEffect(() => {
    let alive = true;
    void repository
      .summary("local-learner")
      .then((s) => {
        if (alive) setProgress(s);
      })
      .catch(() => {
        if (alive)
          setMessage("Progress could not be loaded. Please reopen this area.");
      });
    return () => {
      alive = false;
    };
  }, [repository]);
  useEffect(() => {
    const expire = () => {
      locked.current = true;
      onExit();
    };
    const timer = setInterval(() => {
      if (!gateActive(last.current, now(), true)) expire();
    }, 500);
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active") expire();
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [now, onExit]);
  const allowed = () => {
    if (locked.current || !gateActive(last.current, now(), true)) {
      locked.current = true;
      onExit();
      return false;
    }
    last.current = now();
    return true;
  };
  const reset = async () => {
    if (!allowed() || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await repository.reset("local-learner");
      setProgress(emptySummary());
      setConfirm(false);
      setMessage("Progress reset.");
    } catch {
      setMessage("Progress could not be deleted. Please try again.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <ScrollView
      style={ui.page}
      contentContainerStyle={[ui.content, { paddingTop: 54 }]}
      onTouchStart={() => {
        if (!locked.current && gateActive(last.current, now(), true))
          last.current = now();
      }}
    >
      <Text style={ui.title}>Small steps, real practice</Text>
      <Text style={ui.body}>Responses so far</Text>
      <View style={ui.panel}>
        {(["independent", "assisted", "incorrect", "skipped"] as const).map(
          (key) => (
            <View
              key={key}
              style={[ui.row, { justifyContent: "space-between" }]}
            >
              <Text style={ui.body}>{key[0].toUpperCase() + key.slice(1)}</Text>
              <Text style={ui.title}>{progress[key]}</Text>
            </View>
          ),
        )}
      </View>
      <Text style={ui.small}>
        These are practice counts, not a reading level or a mastery assessment.
        A completed lesson earns one workshop part.
      </Text>
      <Text style={ui.body}>
        Patterns practised:{" "}
        {progress.completedLessonIds.includes("first-words")
          ? "m, short a, s, t"
          : progress.completedLessonIds.length
            ? "m, short a, s"
            : "No completed lessons yet"}
      </Text>
      <View style={ui.panel}>
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Text style={ui.body}>Audio</Text>
          <Switch
            accessibilityLabel="Audio"
            value={audioEnabled}
            onValueChange={(v) => {
              if (allowed()) onAudioChange(v);
            }}
          />
        </View>
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Text style={ui.body}>Reduce animation</Text>
          <Switch
            accessibilityLabel="Reduce animation"
            value={reducedMotion}
            onValueChange={(v) => {
              if (allowed()) onMotionChange(v);
            }}
          />
        </View>
        <Text style={ui.small}>
          These two preferences apply until the app closes.
        </Text>
      </View>
      <Text style={ui.small}>
        Progress stays on this device. There is no account or sync. Detailed
        attempts are retained for 90 days, then kept as totals.
      </Text>
      {message ? (
        <Text
          accessibilityLiveRegion="polite"
          style={message === "Progress reset." ? ui.body : ui.error}
        >
          {message}
        </Text>
      ) : null}
      {confirm ? (
        <View style={ui.panel}>
          <Text style={ui.body}>
            Delete all local progress and earned parts? This cannot be undone.
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => {
              if (allowed()) setConfirm(false);
            }}
            style={[ui.button, ui.secondary]}
          >
            <Text style={[ui.buttonText, ui.secondaryText]}>Keep progress</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => {
              void reset();
            }}
            style={ui.button}
          >
            <Text style={ui.buttonText}>Delete local progress</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (allowed()) setConfirm(true);
          }}
          style={[ui.button, ui.secondary]}
        >
          <Text style={[ui.buttonText, ui.secondaryText]}>Reset progress</Text>
        </Pressable>
      )}
      <Pressable accessibilityRole="button" onPress={onExit} style={ui.button}>
        <Text style={ui.buttonText}>Back to workshop</Text>
      </Pressable>
    </ScrollView>
  );
}
