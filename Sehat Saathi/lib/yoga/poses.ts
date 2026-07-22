import type { PoseDefinition } from "./types";

const L_SHOULDER = 11;
const R_SHOULDER = 12;
const L_ELBOW = 13;
const R_ELBOW = 14;
const L_WRIST = 15;
const R_WRIST = 16;
const L_HIP = 23;
const R_HIP = 24;
const L_KNEE = 25;
const R_KNEE = 26;
const L_ANKLE = 27;
const R_ANKLE = 28;

export const POSE_LIBRARY: PoseDefinition[] = [
  {
    id: "tadasana",
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    emoji: "🧍",
    holdSeconds: 15,
    instructions: [
      "Stand tall with your feet together.",
      "Raise both arms straight overhead, close to your ears.",
      "Keep your legs straight and your spine long.",
    ],
    variants: [
      {
        checks: [
          { id: "leftKnee", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 160, max: 185, hint: "Straighten your left knee" },
          { id: "rightKnee", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 160, max: 185, hint: "Straighten your right knee" },
          { id: "leftElbow", a: L_SHOULDER, b: L_ELBOW, c: L_WRIST, min: 150, max: 185, hint: "Straighten your left arm overhead" },
          { id: "rightElbow", a: R_SHOULDER, b: R_ELBOW, c: R_WRIST, min: 150, max: 185, hint: "Straighten your right arm overhead" },
          { id: "leftArmRaise", a: L_ELBOW, b: L_SHOULDER, c: L_HIP, min: 150, max: 185, hint: "Raise your left arm higher, closer to your ear" },
          { id: "rightArmRaise", a: R_ELBOW, b: R_SHOULDER, c: R_HIP, min: 150, max: 185, hint: "Raise your right arm higher, closer to your ear" },
        ],
      },
    ],
  },
  {
    id: "vrikshasana",
    name: "Tree Pose",
    sanskritName: "Vrikshasana",
    emoji: "🌳",
    holdSeconds: 20,
    instructions: [
      "Balance on one leg.",
      "Place the sole of your other foot against your inner thigh or calf.",
      "Bring your hands together at your chest, or raise them overhead.",
    ],
    variants: [
      {
        checks: [
          { id: "standKnee", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 165, max: 185, hint: "Straighten your standing (right) leg" },
          { id: "liftKnee", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 15, max: 100, hint: "Lift your left foot up against your inner thigh" },
        ],
      },
      {
        checks: [
          { id: "standKnee", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 165, max: 185, hint: "Straighten your standing (left) leg" },
          { id: "liftKnee", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 15, max: 100, hint: "Lift your right foot up against your inner thigh" },
        ],
      },
    ],
  },
  {
    id: "trikonasana",
    name: "Triangle Pose",
    sanskritName: "Trikonasana",
    emoji: "📐",
    holdSeconds: 20,
    instructions: [
      "Step your feet wide apart.",
      "Reach one hand down toward your front shin or the floor.",
      "Reach your other arm straight up toward the ceiling.",
    ],
    variants: [
      {
        checks: [
          { id: "frontKnee", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 155, max: 185, hint: "Keep your front (right) knee straight" },
          { id: "sideBend", a: R_SHOULDER, b: R_HIP, c: R_KNEE, min: 80, max: 145, hint: "Bend further sideways from your hip toward your front leg" },
          { id: "topArmUp", a: L_ELBOW, b: L_SHOULDER, c: L_HIP, min: 150, max: 185, hint: "Raise your top (left) arm straight up toward the ceiling" },
        ],
      },
      {
        checks: [
          { id: "frontKnee", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 155, max: 185, hint: "Keep your front (left) knee straight" },
          { id: "sideBend", a: L_SHOULDER, b: L_HIP, c: L_KNEE, min: 80, max: 145, hint: "Bend further sideways from your hip toward your front leg" },
          { id: "topArmUp", a: R_ELBOW, b: R_SHOULDER, c: R_HIP, min: 150, max: 185, hint: "Raise your top (right) arm straight up toward the ceiling" },
        ],
      },
    ],
  },
  {
    id: "virabhadrasana2",
    name: "Warrior II",
    sanskritName: "Virabhadrasana II",
    emoji: "🏹",
    holdSeconds: 20,
    instructions: [
      "Step your feet wide apart, front knee bent to a right angle.",
      "Keep your back leg straight and strong.",
      "Stretch both arms out to shoulder height, gazing over your front hand.",
    ],
    variants: [
      {
        checks: [
          { id: "frontKneeBend", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 80, max: 120, hint: "Bend your front (right) knee to a right angle" },
          { id: "backLegStraight", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 160, max: 185, hint: "Straighten your back (left) leg" },
          { id: "leftArmLevel", a: L_ELBOW, b: L_SHOULDER, c: L_HIP, min: 75, max: 110, hint: "Stretch your arms out to shoulder height" },
          { id: "rightArmLevel", a: R_ELBOW, b: R_SHOULDER, c: R_HIP, min: 75, max: 110, hint: "Stretch your arms out to shoulder height" },
          { id: "leftElbowStraight", a: L_SHOULDER, b: L_ELBOW, c: L_WRIST, min: 150, max: 185, hint: "Straighten your arms fully" },
          { id: "rightElbowStraight", a: R_SHOULDER, b: R_ELBOW, c: R_WRIST, min: 150, max: 185, hint: "Straighten your arms fully" },
        ],
      },
      {
        checks: [
          { id: "frontKneeBend", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 80, max: 120, hint: "Bend your front (left) knee to a right angle" },
          { id: "backLegStraight", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 160, max: 185, hint: "Straighten your back (right) leg" },
          { id: "leftArmLevel", a: L_ELBOW, b: L_SHOULDER, c: L_HIP, min: 75, max: 110, hint: "Stretch your arms out to shoulder height" },
          { id: "rightArmLevel", a: R_ELBOW, b: R_SHOULDER, c: R_HIP, min: 75, max: 110, hint: "Stretch your arms out to shoulder height" },
          { id: "leftElbowStraight", a: L_SHOULDER, b: L_ELBOW, c: L_WRIST, min: 150, max: 185, hint: "Straighten your arms fully" },
          { id: "rightElbowStraight", a: R_SHOULDER, b: R_ELBOW, c: R_WRIST, min: 150, max: 185, hint: "Straighten your arms fully" },
        ],
      },
    ],
  },
  {
    id: "bhujangasana",
    name: "Cobra Pose",
    sanskritName: "Bhujangasana",
    emoji: "🐍",
    holdSeconds: 15,
    cameraNote: "Turn your camera to the side so it can see your body in profile.",
    instructions: [
      "Lie on your front with your hands under your shoulders.",
      "Press through your hands to lift your chest, keeping a slight bend in your elbows.",
      "Draw your shoulders back and down.",
    ],
    variants: [
      {
        checks: [
          { id: "elbowBendLeft", a: L_SHOULDER, b: L_ELBOW, c: L_WRIST, min: 120, max: 178, hint: "Push up through your arms a little more, keeping a slight bend in the elbows" },
          { id: "elbowBendRight", a: R_SHOULDER, b: R_ELBOW, c: R_WRIST, min: 120, max: 178, hint: "Push up through your arms a little more, keeping a slight bend in the elbows" },
          { id: "backbend", a: L_SHOULDER, b: L_HIP, c: L_KNEE, min: 140, max: 180, hint: "Lift your chest and arch your upper back a little more" },
        ],
      },
    ],
  },
  {
    id: "adhomukhasvanasana",
    name: "Downward Dog",
    sanskritName: "Adho Mukha Svanasana",
    emoji: "🐕",
    holdSeconds: 15,
    cameraNote: "Turn your camera to the side so it can see your whole body.",
    instructions: [
      "From all fours, tuck your toes and lift your hips up and back.",
      "Straighten your arms and legs to form an inverted V-shape.",
      "Press your chest gently toward your thighs.",
    ],
    variants: [
      {
        checks: [
          { id: "armsStraightLeft", a: L_SHOULDER, b: L_ELBOW, c: L_WRIST, min: 155, max: 185, hint: "Straighten your arms" },
          { id: "armsStraightRight", a: R_SHOULDER, b: R_ELBOW, c: R_WRIST, min: 155, max: 185, hint: "Straighten your arms" },
          { id: "hipFold", a: L_SHOULDER, b: L_HIP, c: L_KNEE, min: 60, max: 110, hint: "Fold more at the hips — push your hips up and back" },
          { id: "legsStraightLeft", a: L_HIP, b: L_KNEE, c: L_ANKLE, min: 150, max: 185, hint: "Straighten your legs (a slight knee bend is fine if hamstrings are tight)" },
          { id: "legsStraightRight", a: R_HIP, b: R_KNEE, c: R_ANKLE, min: 150, max: 185, hint: "Straighten your legs (a slight knee bend is fine if hamstrings are tight)" },
        ],
      },
    ],
  },
];
