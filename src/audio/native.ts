import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { createAudioController } from "./controller";
import { draftSources } from "./draft-sources";
export const nativeAudio = createAudioController(async (id) => {
  const source = draftSources[id];
  if (!source) throw new Error("MISSING_BUNDLED_AUDIO");
  await setAudioModeAsync({
    playsInSilentMode: true,
    allowsRecording: false,
    shouldPlayInBackground: false,
    interruptionMode: "doNotMix",
  });
  const player = createAudioPlayer(source);
  return {
    play() {
      player.play();
    },
    stop() {
      player.pause();
    },
    dispose() {
      player.remove();
    },
  };
});
