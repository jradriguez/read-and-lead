import type { Session, SessionEvent } from "./types";
export function startSession(lessonId: string, sessionId: string): Session {
  return {
    lessonId,
    sessionId,
    activityIndex: 0,
    hints: 0,
    failures: 0,
    phase: "answer",
  };
}
export function reduceSession(state: Session, event: SessionEvent): Session {
  if (state.phase === "complete") return state;
  if (event.type === "hint")
    return state.phase === "answer"
      ? { ...state, hints: state.hints + 1 }
      : state;
  if (
    !Number.isInteger(event.activityCount) ||
    event.activityCount < 1 ||
    state.activityIndex >= event.activityCount
  )
    throw new Error("INVALID_ACTIVITY_COUNT");
  if (event.type === "answered") {
    if (state.phase !== "answer") return state;
    if (event.outcome === "incorrect")
      return {
        ...state,
        hints: state.hints + 1,
        failures: state.failures + 1,
        phase: state.failures >= 1 ? "demonstrate" : "answer",
      };
  } else if (state.phase !== "demonstrate") return state;
  const activityIndex = state.activityIndex + 1;
  return {
    ...state,
    activityIndex,
    hints: 0,
    failures: 0,
    phase: activityIndex === event.activityCount ? "complete" : "answer",
  };
}
