import type { Catalog } from "./types";

export function validateCatalog(c: Catalog, release: boolean): string[] {
  const errors = new Set<string>();
  const fail = (code: string) => {
    errors.add(code);
  };
  for (const list of [c.patterns, c.words, c.lessons, c.assets]) {
    if (new Set(list.map((x) => x.id)).size !== list.length)
      fail("DUPLICATE_ID");
  }
  const patterns = new Map(c.patterns.map((p) => [p.id, p]));
  const words = new Map(c.words.map((w) => [w.id, w]));
  const assets = new Set(c.assets.map((a) => a.id));
  const audio = (id: string) => {
    if (!assets.has(id)) fail("MISSING_AUDIO");
  };
  c.patterns.forEach((p) => audio(p.modelAudioId));
  c.words.forEach((w) => {
    audio(w.modelAudioId);
    if (
      w.segments.length === 0 ||
      w.segments
        .map((s) => s.text)
        .join("")
        .toLowerCase() !== w.text.toLowerCase()
    )
      fail("WORD_SEGMENTS");
    w.segments.forEach((s) => {
      if (
        !patterns.has(s.patternId) ||
        patterns.get(s.patternId)?.grapheme.toLowerCase() !==
          s.text.toLowerCase()
      )
        fail("WORD_SEGMENTS");
    });
  });
  const lessons = new Map(c.lessons.map((l) => [l.id, l]));
  const memo = new Map<string, Set<string>>();
  const cumulative = (id: string, visiting: Set<string>): Set<string> => {
    if (visiting.has(id)) {
      fail("PREREQUISITE_CYCLE");
      return new Set();
    }
    if (memo.has(id)) return memo.get(id)!;
    const lesson = lessons.get(id);
    if (!lesson) {
      fail("MISSING_PREREQUISITE");
      return new Set();
    }
    const next = new Set(visiting).add(id);
    const result = new Set(lesson.introducedPatternIds);
    lesson.prerequisiteLessonIds.forEach((p) =>
      cumulative(p, next).forEach((x) => result.add(x)),
    );
    memo.set(id, result);
    return result;
  };
  c.lessons.forEach((l) => {
    const taught = cumulative(l.id, new Set());
    const check = (id: string) => {
      if (!patterns.has(id) || !taught.has(id)) fail("UNTAUGHT_PATTERN");
    };
    l.introducedPatternIds.forEach(check);
    if (!Number.isInteger(l.version) || l.version < 1 || !l.activities.length)
      fail("INVALID_LESSON");
    if (new Set(l.activities.map((a) => a.id)).size !== l.activities.length)
      fail("DUPLICATE_ID");
    l.activities.forEach((a) => {
      audio(a.promptAudioId);
      [...a.answer, ...a.choices].forEach(check);
      if (!a.answer.length || a.answer.some((p) => !a.choices.includes(p)))
        fail("ANSWER_NOT_SELECTABLE");
      if (a.kind === "sound-match" && a.answer.length !== 1)
        fail("INVALID_ACTIVITY");
      if (a.kind === "word-build") {
        const w = words.get(a.wordId ?? "");
        if (
          !w ||
          JSON.stringify(w.segments.map((s) => s.patternId)) !==
            JSON.stringify(a.answer)
        )
          fail("WORD_ANSWER");
        w?.segments.forEach((s) => check(s.patternId));
      }
    });
    const displayed = l.connectedText.toLowerCase().match(/[a-z]+/g) ?? [];
    const declared = l.connectedWordIds.map((id) =>
      words.get(id)?.text.toLowerCase(),
    );
    if (
      /[^a-zA-Z .!?]/.test(l.connectedText) ||
      JSON.stringify(displayed) !== JSON.stringify(declared)
    )
      fail("CONNECTED_TEXT");
    l.connectedWordIds.forEach((id) => {
      const w = words.get(id);
      if (!w) fail("CONNECTED_TEXT");
      else w.segments.forEach((s) => check(s.patternId));
    });
    if (l.connectedText) audio(l.connectedTextAudioId);
    if (
      release &&
      (l.review.state !== "approved" ||
        !l.review.reviewer.trim() ||
        !/^[a-f0-9]{64}$/.test(l.review.digest))
    )
      fail("UNAPPROVED_LESSON");
  });
  if (release)
    c.assets.forEach((a) => {
      if (
        !a.reviewed ||
        !a.creator.trim() ||
        !a.rights.trim() ||
        /pending|test-only/i.test(a.rights)
      )
        fail("UNAPPROVED_ASSET");
    });
  return [...errors];
}
