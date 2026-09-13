// The real controller is unit-tested; Jest has no native AVAudioPlayer.
jest.mock("../../src/audio/native", () => ({
  nativeAudio: { async play() {}, stop() {} },
}));
