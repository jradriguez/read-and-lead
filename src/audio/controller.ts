export type Player = {
  play(): void | Promise<void>;
  stop(): void;
  dispose(): void;
};
// Resolves at the end of a clip (or cancellation), allowing ordered spoken cues.
export type AudioController = { play(id: string): Promise<void>; stop(): void };
export function createAudioController(
  load: (id: string) => Promise<Player>,
): AudioController {
  let generation = 0;
  let current: Player | undefined;
  const release = (p: Player) => {
    try {
      p.stop();
    } finally {
      p.dispose();
    }
  };
  const stop = () => {
    generation++;
    if (current) {
      const old = current;
      current = undefined;
      release(old);
    }
  };
  return {
    stop,
    async play(id) {
      stop();
      const mine = generation;
      const player = await load(id);
      if (mine !== generation) {
        release(player);
        return;
      }
      current = player;
      try {
        await player.play();
      } catch (e) {
        if (mine === generation) stop();
        throw e;
      } finally {
        if (mine === generation && current === player) {
          current = undefined;
          release(player);
        }
      }
    },
  };
}
