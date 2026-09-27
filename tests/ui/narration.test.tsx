import { act, renderHook } from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";
import { useNarration } from "../../src/audio/useNarration";

beforeEach(() => {
  jest
    .spyOn(AppState, "addEventListener")
    .mockReturnValue({ remove: jest.fn() });
});

function deferredAudio() {
  const pending: { resolve: () => void; reject: (e: Error) => void }[] = [];
  return {
    pending,
    play: jest.fn(
      () =>
        new Promise<void>((resolve, reject) => {
          pending.push({ resolve, reject });
        }),
    ),
    stop: jest.fn(),
  };
}
test("narration waits for each clip and a changed screen cue cancels the old queue", async () => {
  const audio = deferredAudio();
  const hook = await renderHook<
    ReturnType<typeof useNarration>,
    { cues: string[] }
  >(({ cues }) => useNarration(audio, cues), {
    initialProps: { cues: ["guide", "sound", "word"] },
  });
  expect(audio.play.mock.calls).toEqual([["guide"]]);
  await act(() => audio.pending[0].resolve());
  expect(audio.play.mock.calls).toEqual([["guide"], ["sound"]]);
  await hook.rerender({ cues: ["new"] });
  await act(() => audio.pending[1].resolve());
  expect(audio.play.mock.calls).toEqual([["guide"], ["sound"], ["new"]]);
});
test("manual replay cancels instructions; stale failure cannot replace the current state", async () => {
  const audio = deferredAudio();
  const hook = await renderHook(() =>
    useNarration(audio, ["instructions", "old"]),
  );
  await act(() => hook.result.current.play(["replay"]));
  await act(() => audio.pending[0].reject(new Error("old clip")));
  expect(hook.result.current.error).toBe(false);
  await act(() => audio.pending[1].reject(new Error("missing")));
  expect(hook.result.current.error).toBe(true);
  await act(() => hook.result.current.play(["retry"]));
  expect(hook.result.current.error).toBe(false);
  expect(audio.play.mock.calls).toEqual([
    ["instructions"],
    ["replay"],
    ["retry"],
  ]);
});
test("background and unmount discard remaining cues without automatic restart", async () => {
  const audio = deferredAudio();
  let change!: (state: AppStateStatus) => void;
  const listener = jest
    .spyOn(AppState, "addEventListener")
    .mockImplementation((_, cb) => {
      change = cb;
      return { remove: jest.fn() };
    });
  try {
    const hook = await renderHook(() =>
      useNarration(audio, ["first", "second"]),
    );
    await act(() => change("background"));
    await act(() => {
      audio.pending[0].resolve();
      change("active");
    });
    expect(audio.play).toHaveBeenCalledTimes(1);
    await act(() => hook.result.current.play(["replay", "remaining"]));
    await hook.unmount();
    await act(() => audio.pending[1].resolve());
    expect(audio.play.mock.calls).toEqual([["first"], ["replay"]]);
    expect(audio.stop).toHaveBeenCalled();
  } finally {
    listener.mockRestore();
  }
});

test("a cue change while backgrounded does not start new speech", async () => {
  const audio = deferredAudio();
  let change!: (state: AppStateStatus) => void;
  const listener = jest
    .spyOn(AppState, "addEventListener")
    .mockImplementation((_, cb) => {
      change = cb;
      return { remove: jest.fn() };
    });
  try {
    const hook = await renderHook<
      ReturnType<typeof useNarration>,
      { cues: string[] }
    >(({ cues }) => useNarration(audio, cues), {
      initialProps: { cues: ["answer"] },
    });
    await act(() => change("background"));
    await hook.rerender({ cues: ["saved-and-complete"] });
    expect(audio.play).toHaveBeenCalledTimes(1);
    await act(() => change("active"));
    expect(audio.play).toHaveBeenCalledTimes(1);
    await act(() => hook.result.current.play(["replay"]));
    expect(audio.play.mock.calls).toEqual([["answer"], ["replay"]]);
  } finally {
    listener.mockRestore();
  }
});

test("mounting a screen in the background never starts a clip", async () => {
  AppState.currentState = "background";
  const audio = deferredAudio();
  const hook = await renderHook(() => useNarration(audio, ["welcome"]));
  await act(() => hook.result.current.play(["replay"]));
  expect(audio.play).not.toHaveBeenCalled();
});
