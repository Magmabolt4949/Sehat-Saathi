import type { AngleCheck, Landmark, PoseDefinition, PoseEvaluation } from "./types";

const MIN_VISIBILITY = 0.4;

export const POSE_CONNECTIONS: [number, number][] = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
  [27, 29],
  [27, 31],
  [28, 30],
  [28, 32],
];

export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const magAB = Math.hypot(abx, aby);
  const magCB = Math.hypot(cbx, cby);
  if (magAB === 0 || magCB === 0) return NaN;
  const cos = Math.min(1, Math.max(-1, (abx * cbx + aby * cby) / (magAB * magCB)));
  return (Math.acos(cos) * 180) / Math.PI;
}

function isVisible(landmarks: Landmark[], index: number): boolean {
  const point = landmarks[index];
  if (!point) return false;
  return point.visibility === undefined || point.visibility >= MIN_VISIBILITY;
}

function evaluateChecks(landmarks: Landmark[], checks: AngleCheck[]): PoseEvaluation {
  const issues: string[] = [];
  const failingLandmarks = new Set<number>();
  let applicable = 0;
  let passed = 0;

  for (const check of checks) {
    if (!isVisible(landmarks, check.a) || !isVisible(landmarks, check.b) || !isVisible(landmarks, check.c)) {
      continue;
    }
    const angle = calculateAngle(landmarks[check.a], landmarks[check.b], landmarks[check.c]);
    if (Number.isNaN(angle)) continue;

    applicable += 1;
    if (angle >= check.min && angle <= check.max) {
      passed += 1;
    } else {
      issues.push(check.hint);
      failingLandmarks.add(check.a).add(check.b).add(check.c);
    }
  }

  if (applicable === 0) {
    return {
      score: 0,
      correct: false,
      issues: ["Make sure your full body is visible in the camera."],
      failingLandmarks,
    };
  }

  const score = passed / applicable;
  return { score, correct: score >= 0.8, issues, failingLandmarks };
}

export function evaluatePose(landmarks: Landmark[], pose: PoseDefinition): PoseEvaluation {
  let best: PoseEvaluation | null = null;
  for (const variant of pose.variants) {
    const result = evaluateChecks(landmarks, variant.checks);
    if (!best || result.score > best.score) best = result;
  }
  return best ?? { score: 0, correct: false, issues: [], failingLandmarks: new Set() };
}
