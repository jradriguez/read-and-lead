export type Outcome = "independent" | "assisted" | "incorrect" | "skipped";
export type Response = { selected: string[]; hints: number; skipped: boolean };
export type Attempt = {
  id: string;
  sessionId: string;
  learnerId: string;
  lessonId: string;
  lessonVersion: number;
  activityId: string;
  outcome: Outcome;
  hints: number;
  createdAt: number;
};
export type Session = {
  lessonId: string;
  sessionId: string;
  activityIndex: number;
  hints: number;
  failures: number;
  phase: "answer" | "demonstrate" | "complete";
};
export type SessionEvent =
  | { type: "hint" }
  | { type: "answered"; outcome: Outcome; activityCount: number }
  | { type: "demonstrated"; activityCount: number };
