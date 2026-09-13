import type { Catalog } from "../../src/content/types";
export function makeCatalog(): Catalog {
  const patterns = ["m", "short-a", "s", "t"].map((id) => ({
    id,
    grapheme: id === "short-a" ? "a" : id,
    modelAudioId: id,
  }));
  return {
    patterns,
    assets: [
      "m",
      "short-a",
      "s",
      "t",
      "am",
      "sam",
      "mat",
      "sat",
      "sentence",
    ].map((id) => ({
      id,
      file: `audio/${id}.wav`,
      sha256: "a".repeat(64),
      creator: "fixture",
      rights: "test-only",
      reviewed: false,
    })),
    words: [
      {
        id: "am",
        text: "am",
        segments: [
          { text: "a", patternId: "short-a" },
          { text: "m", patternId: "m" },
        ],
        modelAudioId: "am",
      },
      {
        id: "sam",
        text: "Sam",
        segments: [
          { text: "s", patternId: "s" },
          { text: "a", patternId: "short-a" },
          { text: "m", patternId: "m" },
        ],
        modelAudioId: "sam",
      },
      {
        id: "sat",
        text: "sat",
        segments: [
          { text: "s", patternId: "s" },
          { text: "a", patternId: "short-a" },
          { text: "t", patternId: "t" },
        ],
        modelAudioId: "sat",
      },
    ],
    lessons: [
      {
        id: "first-sounds",
        title: "Wake up the workshop",
        version: 1,
        introducedPatternIds: ["m", "short-a", "s"],
        prerequisiteLessonIds: [],
        activities: [
          {
            id: "match-m",
            kind: "sound-match",
            promptAudioId: "m",
            answer: ["m"],
            choices: ["m", "short-a", "s"],
          },
          {
            id: "build-am",
            kind: "word-build",
            promptAudioId: "am",
            answer: ["short-a", "m"],
            choices: ["m", "short-a", "s"],
            wordId: "am",
          },
        ],
        connectedText: "",
        connectedWordIds: [],
        connectedTextAudioId: "",
        review: { state: "draft", reviewer: "", digest: "" },
      },
      {
        id: "first-words",
        title: "Build a robot seat",
        version: 1,
        introducedPatternIds: ["t"],
        prerequisiteLessonIds: ["first-sounds"],
        activities: [
          {
            id: "build-sat",
            kind: "word-build",
            promptAudioId: "sat",
            answer: ["s", "short-a", "t"],
            choices: ["m", "short-a", "s", "t"],
            wordId: "sat",
          },
        ],
        connectedText: "Sam sat.",
        connectedWordIds: ["sam", "sat"],
        connectedTextAudioId: "sentence",
        review: { state: "draft", reviewer: "", digest: "" },
      },
    ],
  };
}
