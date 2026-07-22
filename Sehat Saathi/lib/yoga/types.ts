export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface AngleCheck {
  id: string;
  a: number;
  b: number;
  c: number;
  min: number;
  max: number;
  hint: string;
}

export interface PoseVariant {
  checks: AngleCheck[];
}

export interface PoseDefinition {
  id: string;
  name: string;
  sanskritName: string;
  emoji: string;
  holdSeconds: number;
  instructions: string[];
  cameraNote?: string;
  variants: PoseVariant[];
}

export interface PoseEvaluation {
  score: number;
  correct: boolean;
  issues: string[];
  failingLandmarks: Set<number>;
}
