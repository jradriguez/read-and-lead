// Exercise the native adapter with only Expo's player boundary replaced.
jest.unmock("../../src/audio/native");
jest.mock(
  "../../src/audio/draft-sources",
  () => ({ draftSources: { cue: 1 } }),
  { virtual: true },
);
const mockRemoveListener = jest.fn();
let mockStatus: (status: { didJustFinish: boolean }) => void;
const mockPlayer = {
  addListener: jest.fn((_: string, callback: typeof mockStatus) => {
    mockStatus = callback;
    return { remove: mockRemoveListener };
  }),
  play: jest.fn(),
  pause: jest.fn(),
  remove: jest.fn(),
};
jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(async () => {}),
  createAudioPlayer: jest.fn(() => mockPlayer),
}));
import { nativeAudio } from "../../src/audio/native";
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  nativeAudio.stop();
  jest.useRealTimers();
});
async function start() {
  const playing = nativeAudio.play("cue");
  // Audio mode, source load and playback each use the promise queue.
  await Promise.resolve();
  await Promise.resolve();
  return { playing };
}
test("a native finished event resolves playback and removes its listener and player", async () => {
  const { playing } = await start();
  expect(mockPlayer.play).toHaveBeenCalledTimes(1);
  mockStatus({ didJustFinish: false });
  expect(mockPlayer.remove).not.toHaveBeenCalled();
  mockStatus({ didJustFinish: true });
  await playing;
  expect(mockRemoveListener).toHaveBeenCalledTimes(1);
  expect(mockPlayer.remove).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});
test("stop settles interrupted playback and a stalled player fails visibly", async () => {
  const first = await start();
  nativeAudio.stop();
  await first.playing;
  expect(mockPlayer.pause).toHaveBeenCalledTimes(1);
  const second = await start();
  const rejection = expect(second.playing).rejects.toThrow(
    "AUDIO_PLAYBACK_TIMEOUT",
  );
  jest.advanceTimersByTime(45000);
  await rejection;
  expect(mockPlayer.remove).toHaveBeenCalledTimes(2);
  expect(jest.getTimerCount()).toBe(0);
});
