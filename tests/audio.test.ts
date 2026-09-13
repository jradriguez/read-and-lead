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
  assert.deepEqual(b.events, ["play"]);
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
  assert.deepEqual(p.events, ["play"]);
});
