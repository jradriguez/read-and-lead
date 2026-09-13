export function makeChallenge(left: number, right: number) {
  return {
    prompt: `For grown-ups: what is ${left} × ${right}?`,
    answer: left * right,
  };
}
export function checkGate(input: string, expected: number): boolean {
  return /^\d+$/.test(input.trim()) && Number(input.trim()) === expected;
}
export function gateActive(
  lastActivity: number,
  now: number,
  foreground: boolean,
): boolean {
  return foreground && now >= lastActivity && now - lastActivity < 60000;
}
