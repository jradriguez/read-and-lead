import type { Activity } from "../content/types";
import type { Outcome, Response } from "./types";
export function evaluate(activity: Activity, response: Response): Outcome {
  if (response.skipped) return "skipped";
  if (
    response.selected.length !== activity.answer.length ||
    response.selected.some((id, i) => id !== activity.answer[i])
  )
    return "incorrect";
  return response.hints === 0 ? "independent" : "assisted";
}
