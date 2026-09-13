export type Asset = {
  id: string;
  file: string;
  sha256: string;
  creator: string;
  rights: string;
  reviewed: boolean;
};
export type Pattern = { id: string; grapheme: string; modelAudioId: string };
export type Word = {
  id: string;
  text: string;
  segments: { text: string; patternId: string }[];
  modelAudioId: string;
};
export type Activity = {
  id: string;
  kind: "sound-match" | "word-build";
  promptAudioId: string;
  answer: string[];
  choices: string[];
  wordId?: string;
};
export type Lesson = {
  id: string;
  title: string;
  version: number;
  introducedPatternIds: string[];
  prerequisiteLessonIds: string[];
  activities: Activity[];
  connectedText: string;
  connectedWordIds: string[];
  connectedTextAudioId: string;
  review: { state: "draft" | "approved"; reviewer: string; digest: string };
};
export type Catalog = {
  patterns: Pattern[];
  words: Word[];
  lessons: Lesson[];
  assets: Asset[];
};
