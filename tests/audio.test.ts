import test from "node:test";
import assert from "node:assert/strict";
import { createAudioController, type Player } from "../src/audio/controller.ts";
function player() {
  const events: string[] = [];
  return {
    events,
    play() {
      events.push("play");
    },
    stop() {
      events.push("stop");
    },
    dispose() {
      events.push("dispose");
    },
  };
}
test("late loading of A cannot start over newer prompt B", async () => {
  let resolveA!: (p: Player) => void;
  const a = player(),
    b = player();
  const audio = createAudioController((id) =>
    id === "a"
      ? new Promise((r) => {
          resolveA = r;
        })
      : Promise.resolve(b),
  );
  const first = audio.play("a");
  await audio.play("b");
  resolveA(a);
  await first;
  assert.deepEqual(a.events, ["stop", "dispose"]);
  assert.deepEqual(b.events, ["play", "stop", "dispose"]);
  audio.stop();
  assert.deepEqual(b.events, ["play", "stop", "dispose"]);
});
test("stop while loading prevents playback and can be repeated", async () => {
  let resolve!: (p: Player) => void;
  const p = player();
  const audio = createAudioController(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const pending = audio.play("x");
  audio.stop();
  audio.stop();
  resolve(p);
  await pending;
  assert.deepEqual(p.events, ["stop", "dispose"]);
});
test("failed loading is visible and next replay is still possible", async () => {
  let count = 0;
  const p = player();
  const audio = createAudioController(async () => {
    if (count++ === 0) throw new Error("missing");
    return p;
  });
  await assert.rejects(audio.play("x"));
  await audio.play("x");
  assert.deepEqual(p.events, ["play", "stop", "dispose"]);
});

test("play resolves only when playback finishes and releases once", async () => {
  let finish!: () => void;
  const p = player();
  const audio = createAudioController(async () => ({
    ...p,
    play() {
      p.events.push("play");
      return new Promise<void>((resolve) => {
        finish = resolve;
      });
    },
  }));
  let ended = false;
  const playing = audio.play("x").then(() => {
    ended = true;
  });
  await Promise.resolve();
  assert.equal(ended, false);
  finish();
  await playing;
  assert.equal(ended, true);
  audio.stop();
  assert.deepEqual(p.events, ["play", "stop", "dispose"]);
});

test("a late playback rejection cannot stop the newer player", async () => {
  let rejectA!: (error: Error) => void;
  let finishB!: () => void;
  const a = player(),
    b = player();
  const audio = createAudioController(async (id) =>
    id === "a"
      ? {
          ...a,
          play: () =>
            new Promise<void>((_, reject) => {
              rejectA = reject;
            }),
        }
      : {
          ...b,
          play: () =>
            new Promise<void>((resolve) => {
              finishB = resolve;
            }),
        },
  );
  const first = audio.play("a");
  const rejected = assert.rejects(first, /late/);
  await Promise.resolve();
  const second = audio.play("b");
  await Promise.resolve();
  rejectA(new Error("late"));
  await rejected;
  assert.deepEqual(b.events, []);
  finishB();
  await second;
  assert.deepEqual(a.events, ["stop", "dispose"]);
  assert.deepEqual(b.events, ["stop", "dispose"]);
});
