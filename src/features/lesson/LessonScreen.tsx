import { useEffect, useRef, useState } from "react";
import { randomUUID } from "expo-crypto";
import { AppState, Pressable, ScrollView, Text, View } from "react-native";
import type { Catalog, Lesson } from "../../content/types";
import type { AudioController } from "../../audio/controller";
import type { ProgressRepository } from "../../progress/repository";
import type { Attempt, Session } from "../../learning/types";
import { evaluate } from "../../learning/evaluate";
import { startSession, reduceSession } from "../../learning/session";
import { placeTile } from "./placement";
import { WordBuilder } from "./WordBuilder";
import { LetterTile } from "./LetterTile";
import { Robot } from "../../ui/Robot";
import { color, ui } from "../../ui/tokens";
export type LessonProps = {
  lesson: Lesson;
  catalog: Catalog;
  repository: ProgressRepository;
  audio: AudioController;
  onComplete: () => void;
  onExit: () => void;
  reducedMotion?: boolean;
  random?: () => number;
};
export function LessonScreen({
  lesson,
  catalog,
  repository,
  audio,
  onComplete,
  onExit,
  reducedMotion = false,
  random = Math.random,
}: LessonProps) {
  const [session, setSession] = useState(() =>
    startSession(lesson.id, randomUUID()),
  );
  const [intro, setIntro] = useState(lesson.introducedPatternIds.length > 0);
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    lesson.activities[0].answer.map(() => null),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const sequence = useRef(0);
  const pending = useRef<{ attempt: Attempt; next: Session } | null>(null);
  const alive = useRef(true);
  const activity =
    lesson.activities[
      Math.min(session.activityIndex, lesson.activities.length - 1)
    ];
  const [choiceIds, setChoiceIds] = useState(() =>
    shuffle(activity.choices, random),
  );
  useEffect(() => {
    alive.current = true;
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active") audio.stop();
    });
    return () => {
      alive.current = false;
      sub.remove();
      audio.stop();
    };
  }, [audio]);
  const play = (id: string) => {
    setAudioError(false);
    void audio.play(id).catch(() => {
      if (alive.current) setAudioError(true);
    });
  };
  useEffect(() => {
    if (intro || session.phase === "complete") return;
    setAudioError(false);
    void audio.play(activity.promptAudioId).catch(() => {
      if (alive.current) setAudioError(true);
    });
  }, [activity.id, activity.promptAudioId, intro, session.phase, audio]);
  const nextActivity = (next: Session) => {
    setSession(next);
    setSelected(null);
    if (next.phase !== "complete") {
      setSlots(lesson.activities[next.activityIndex].answer.map(() => null));
      if (next.activityIndex !== session.activityIndex)
        setChoiceIds(
          shuffle(lesson.activities[next.activityIndex].choices, random),
        );
    }
  };
  const save = async () => {
    if (lock.current || !pending.current) return;
    lock.current = true;
    setBusy(true);
    setSaveError(false);
    const event = pending.current;
    try {
      await repository.record(
        event.attempt,
        event.next.phase === "complete"
          ? { id: lesson.id, version: lesson.version }
          : undefined,
      );
      if (!alive.current) return;
      pending.current = null;
      if (event.attempt.outcome === "incorrect")
        setFeedback(
          event.next.phase === "demonstrate"
            ? "Let’s build this one together."
            : "Let’s listen and try again.",
        );
      else
        setFeedback(
          event.attempt.outcome === "skipped"
            ? "We can practise that another time."
            : "You built it!",
        );
      nextActivity(event.next);
    } catch {
      if (alive.current) setSaveError(true);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  const submit = (skip = false) => {
    if (
      lock.current ||
      pending.current ||
      session.phase === "complete" ||
      (!skip && session.phase === "answer" && slots.some((x) => x === null))
    )
      return;
    const outcome =
      session.phase === "demonstrate"
        ? "assisted"
        : evaluate(activity, {
            selected: slots.map((x) => x ?? ""),
            hints: session.hints,
            skipped: skip,
          });
    const next = reduceSession(
      session,
      session.phase === "demonstrate"
        ? { type: "demonstrated", activityCount: lesson.activities.length }
        : {
            type: "answered",
            outcome,
            activityCount: lesson.activities.length,
          },
    );
    pending.current = {
      attempt: {
        id: `${session.sessionId}-${sequence.current++}`,
        sessionId: session.sessionId,
        learnerId: "local-learner",
        lessonId: lesson.id,
        lessonVersion: lesson.version,
        activityId: activity.id,
        outcome,
        hints: session.hints,
        createdAt: Date.now(),
      },
      next,
    };
    void save();
  };
  const hint = () => {
    setSession((s) => reduceSession(s, { type: "hint" }));
    setFeedback(
      `Try ${activity.answer.map((id) => catalog.patterns.find((p) => p.id === id)?.grapheme).join(" · ")}.`,
    );
    play(activity.promptAudioId);
  };
  const choices = choiceIds.map((id) =>
    catalog.patterns.find((p) => p.id === id)!,
  );
  const button = (
    label: string,
    action: () => void,
    secondary = false,
    id?: string,
  ) => (
    <Pressable
      testID={id}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={
        busy || (id === "check-answer" && slots.some((x) => x === null))
      }
      onPress={action}
      style={[ui.button, secondary && ui.secondary, busy && { opacity: 0.5 }]}
    >
      <Text style={[ui.buttonText, secondary && ui.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <ScrollView
      testID="lesson-screen"
      style={ui.page}
      contentContainerStyle={[
        ui.content,
        { paddingTop: 54, paddingBottom: 40 },
      ]}
    >
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        {button(
          "Workshop",
          () => {
            audio.stop();
            onExit();
          },
          true,
        )}
        <Text style={ui.small}>
          {Math.min(session.activityIndex + 1, lesson.activities.length)} /{" "}
          {lesson.activities.length}
        </Text>
      </View>
      <View style={[ui.panel, { alignItems: "center" }]}>
        <Text style={[ui.small, { color: color.red }]}>
          Adult developer preview · Unreviewed teaching material
        </Text>
        <Text
          accessibilityRole="header"
          style={[ui.title, { textAlign: "center" }]}
        >
          {intro
            ? "Meet the sounds"
            : session.phase === "complete"
              ? "You built it!"
              : session.phase === "demonstrate"
                ? "Let’s try together"
                : activity.kind === "sound-match"
                  ? "Find the sound"
                  : "Build the word"}
        </Text>
        {intro ? (
          <>
            <View style={[ui.row, { justifyContent: "center" }]}>
              {lesson.introducedPatternIds.map((id) => {
                const p = catalog.patterns.find((p) => p.id === id)!;
                return (
                  <LetterTile
                    key={id}
                    id={id}
                    label={p.grapheme}
                    selected={false}
                    onSelect={() => play(p.modelAudioId)}
                  />
                );
              })}
            </View>
            <Text style={ui.body}>Tap each letter. Listen to its sound.</Text>
            {button("Ready to build", () => {
              setIntro(false);
            })}
          </>
        ) : session.phase === "complete" ? (
          <>
            <Robot mood="celebrate" reducedMotion={reducedMotion} />
            {lesson.connectedText ? (
              <>
                <Text style={[ui.title, { fontSize: 48 }]}>
                  {lesson.connectedText}
                </Text>
                {button(
                  "Hear the sentence",
                  () => play(lesson.connectedTextAudioId),
                  true,
                )}
              </>
            ) : null}
            <Text style={ui.body}>A new part for your workshop.</Text>
            {button("Back to workshop", onComplete, false, "finish-lesson")}
          </>
        ) : (
          <>
            <Text style={ui.small}>
              {activity.kind === "sound-match"
                ? "Listen, then choose a letter."
                : "Listen, then put the sounds in order."}
            </Text>
            {button(
              "Hear it again",
              () => play(activity.promptAudioId),
              true,
              "replay-audio",
            )}
            {session.phase === "demonstrate" ? (
              <>
                <Text style={[ui.title, { fontSize: 56 }]}>
                  {activity.answer
                    .map(
                      (id) =>
                        catalog.patterns.find((p) => p.id === id)?.grapheme,
                    )
                    .join("  ")}
                </Text>
                <Text style={ui.body}>Listen and say it together.</Text>
                {button("Continue together", () => submit())}
              </>
            ) : (
              <>
                {activity.kind === "word-build" ? (
                  <WordBuilder
                    choices={choices}
                    slots={slots}
                    selected={selected}
                    onSelect={setSelected}
                    onPlace={(id, index) => {
                      if (!pending.current)
                        setSlots((s) => placeTile(s, id, index));
                    }}
                    disabled={busy || saveError}
                  />
                ) : (
                  <View style={[ui.row, { justifyContent: "center" }]}>
                    {choices.map((p) => (
                      <LetterTile
                        key={p.id}
                        id={p.id}
                        label={p.grapheme}
                        selected={slots[0] === p.id}
                        disabled={busy || saveError}
                        onSelect={() => setSlots([p.id])}
                      />
                    ))}
                  </View>
                )}
                <View style={[ui.row, { justifyContent: "center" }]}>
                  {button("Show me", hint, true)}
                  {button(
                    "Check answer",
                    () => submit(),
                    false,
                    "check-answer",
                  )}
                </View>
                {button("Skip for now", () => submit(true), true)}
              </>
            )}
          </>
        )}
        {feedback && session.phase !== "complete" ? (
          <Text accessibilityLiveRegion="polite" style={ui.body}>
            {feedback}
          </Text>
        ) : null}
        {audioError ? (
          <Text accessibilityRole="alert" style={ui.error}>
            Audio is unavailable. Ask a grown-up to model this sound, or try
            replay.
          </Text>
        ) : null}
        {saveError ? (
          <>
            <Text accessibilityRole="alert" style={ui.error}>
              Progress could not be saved. Tap retry.
            </Text>
            {button("Retry save", () => {
              void save();
            })}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
function shuffle(values: string[], random: () => number): string[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
