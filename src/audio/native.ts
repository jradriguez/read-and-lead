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
  let finish: (() => void) | undefined;
  let listener: { remove(): void } | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const clear = () => {
    listener?.remove();
    listener = undefined;
    clearTimeout(timeout);
    timeout = undefined;
  };
  return {
    play() {
      return new Promise<void>((resolve, reject) => {
        finish = () => {
          clear();
          resolve();
        };
        listener = player.addListener("playbackStatusUpdate", (status) => {
          if (status.didJustFinish) finish?.();
        });
        // Bundled prompts are short. A stalled native player must not trap a queue.
        timeout = setTimeout(() => {
          clear();
          reject(new Error("AUDIO_PLAYBACK_TIMEOUT"));
        }, 45000);
        player.play();
      });
    },
    stop() {
      finish?.();
      player.pause();
    },
    dispose() {
      clear();
      player.remove();
    },
  };
});
