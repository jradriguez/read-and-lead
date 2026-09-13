// The real controller is unit-tested; Jest has no native AVAudioPlayer.
jest.mock("../../src/audio/native", () => ({
  nativeAudio: { async play() {}, stop() {} },
}));
// Jest has no OS crypto module. Preserve real Node UUID behavior at that boundary.
jest.mock("expo-crypto", () => ({
  ...jest.requireActual("expo-crypto"),
  randomUUID: () => jest.requireActual("node:crypto").randomUUID(),
}));
