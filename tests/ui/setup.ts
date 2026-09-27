import { AppState } from "react-native";

// Jest has no foreground application. Individual lifecycle tests can override it.
beforeEach(() => {
  AppState.currentState = "active";
});

// The real controller is unit-tested; Jest has no native AVAudioPlayer.
jest.mock("react-native-worklets", () =>
  require("react-native-worklets/lib/module/mock"),
);
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);
jest.mock("../../src/audio/native", () => ({
  nativeAudio: { async play() {}, stop() {} },
}));
// Jest has no OS crypto module. Preserve real Node UUID behavior at that boundary.
jest.mock("expo-crypto", () => ({
  ...jest.requireActual("expo-crypto"),
  randomUUID: () => jest.requireActual("node:crypto").randomUUID(),
}));
