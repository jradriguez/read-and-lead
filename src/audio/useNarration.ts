import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { AudioController } from "./controller";

/** One screen owns speech. New cues, replay, exit and background cancel the queue. */
export function useNarration(audio: AudioController, cues: string[]) {
  const generation = useRef(0);
  const mounted = useRef(false);
  const foreground = useRef(AppState.currentState === "active");
  const [error, setError] = useState(false);
  const cueKey = JSON.stringify(cues);
  const stop = useCallback(() => {
    generation.current++;
    audio.stop();
  }, [audio]);
  const play = useCallback(
    (ids: string[]) => {
      stop();
      if (!foreground.current) return;
      const mine = generation.current;
      setError(false);
      void (async () => {
        for (const id of ids) {
          if (!mounted.current || mine !== generation.current) return;
          await audio.play(id);
        }
      })().catch(() => {
        if (mounted.current && mine === generation.current) setError(true);
      });
    },
    [audio, stop],
  );
  useEffect(() => {
    mounted.current = true;
    play(JSON.parse(cueKey) as string[]);
    const subscription = AppState.addEventListener("change", (state) => {
      foreground.current = state === "active";
      if (state !== "active") stop();
    });
    return () => {
      mounted.current = false;
      subscription.remove();
      stop();
    };
  }, [cueKey, play, stop]);
  return { play, stop, error };
}
