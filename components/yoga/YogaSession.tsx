"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PoseLandmarker as PoseLandmarkerType } from "@mediapipe/tasks-vision";
import Avatar, { AvatarState } from "@/components/Avatar";
import { POSE_LIBRARY } from "@/lib/yoga/poses";
import { POSE_CONNECTIONS, evaluatePose } from "@/lib/yoga/angles";
import { speak, stopSpeaking } from "@/lib/yoga/speech";
import type { Landmark } from "@/lib/yoga/types";

const MEDIAPIPE_VERSION = "0.10.35";
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_ASSET_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

const DETECT_INTERVAL_MS = 100;
const REST_SECONDS = 4;
const STABILITY_WINDOW = 6;
const VOICE_HINT_DEBOUNCE_MS = 4000;
const VOICE_PRAISE_DEBOUNCE_MS = 1500;

type Phase = "idle" | "loading" | "active" | "rest" | "complete" | "error";

interface PoseResult {
  poseId: string;
  name: string;
  heldFullDuration: boolean;
  avgAccuracy: number;
}

function formatSeconds(ms: number) {
  return Math.max(0, Math.ceil(ms / 1000));
}

function poseHoldMs(index: number) {
  return POSE_LIBRARY[index].holdSeconds * 1000;
}

function accuracyTextColor(pct: number) {
  if (pct >= 80) return "text-teal-600";
  if (pct >= 50) return "text-amber-600";
  return "text-rose-600";
}

function accuracyBarColor(pct: number) {
  if (pct >= 80) return "bg-teal-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function accuracyBadgeColor(pct: number) {
  if (pct >= 80) return "bg-teal-600 text-white";
  if (pct >= 50) return "bg-amber-500 text-amber-950";
  return "bg-rose-500 text-white";
}

export default function YogaSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarkerType | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectRef = useRef(0);
  const lastFrameTsRef = useRef<number | null>(null);
  const detectLoopRef = useRef<(timestamp: number) => void>(() => {});

  const phaseRef = useRef<Phase>("idle");
  const poseIndexRef = useRef(0);
  const holdMsRef = useRef(0);
  const recentScoresRef = useRef<number[]>([]);
  const accuracySumRef = useRef(0);
  const accuracyCountRef = useRef(0);
  const resultsRef = useRef<PoseResult[]>([]);
  const restRemainingRef = useRef(0);
  const voiceEnabledRef = useRef(true);
  const lastSpokenKeyRef = useRef<string | null>(null);
  const lastSpokenAtRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [poseIndex, setPoseIndex] = useState(0);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState(REST_SECONDS);
  const [issues, setIssues] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [liveAccuracy, setLiveAccuracy] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<PoseResult[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const currentPose = POSE_LIBRARY[poseIndex];

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    if (!voiceEnabled) stopSpeaking();
  }, [voiceEnabled]);

  const cleanupMedia = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    stopSpeaking();
  }, []);

  useEffect(() => cleanupMedia, [cleanupMedia]);

  function drawFrame(landmarks: Landmark[] | null, failing: Set<number>) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const width = video.clientWidth;
    const height = video.clientHeight;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (!landmarks) return;

    ctx.lineWidth = 3;
    for (const [i, j] of POSE_CONNECTIONS) {
      const a = landmarks[i];
      const b = landmarks[j];
      if (!a || !b) continue;
      const bad = failing.has(i) || failing.has(j);
      ctx.strokeStyle = bad ? "#f43f5e" : "#14b8a6";
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    }

    for (let i = 11; i <= 32; i++) {
      const point = landmarks[i];
      if (!point) continue;
      ctx.fillStyle = failing.has(i) ? "#f43f5e" : "#0d9488";
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const beginPose = useCallback((index: number) => {
    const pose = POSE_LIBRARY[index];
    holdMsRef.current = 0;
    recentScoresRef.current = [];
    accuracySumRef.current = 0;
    accuracyCountRef.current = 0;
    lastSpokenKeyRef.current = null;
    lastSpokenAtRef.current = 0;

    setHoldSecondsLeft(pose.holdSeconds);
    setIssues([]);
    setIsCorrect(false);
    setLiveAccuracy(0);

    if (voiceEnabledRef.current) {
      speak(`${pose.name}. ${pose.instructions[0]}`);
    }
  }, []);

  const finalizePoseAndAdvance = useCallback(
    (completed: boolean): boolean => {
      const pose = POSE_LIBRARY[poseIndexRef.current];
      const avgAccuracy = accuracyCountRef.current > 0 ? accuracySumRef.current / accuracyCountRef.current : 0;
      const outcome: PoseResult = { poseId: pose.id, name: pose.name, heldFullDuration: completed, avgAccuracy };
      resultsRef.current = [...resultsRef.current, outcome];
      setResults(resultsRef.current);

      const nextIndex = poseIndexRef.current + 1;

      if (nextIndex >= POSE_LIBRARY.length) {
        cleanupMedia();
        phaseRef.current = "complete";
        setPhase("complete");

        if (voiceEnabledRef.current) {
          const completedResults = resultsRef.current.filter((r) => r.heldFullDuration);
          if (completedResults.length > 0) {
            const overallPct = Math.round(
              (completedResults.reduce((sum, r) => sum + r.avgAccuracy, 0) / completedResults.length) * 100
            );
            speak(`Session complete! Your average form accuracy was ${overallPct} percent. Great work today.`);
          } else {
            speak("Session complete!");
          }
        }
        return true;
      }

      const nextPose = POSE_LIBRARY[nextIndex];
      poseIndexRef.current = nextIndex;
      setPoseIndex(nextIndex);
      restRemainingRef.current = REST_SECONDS * 1000;
      setRestSecondsLeft(REST_SECONDS);
      phaseRef.current = "rest";
      setPhase("rest");

      if (voiceEnabledRef.current) {
        speak(completed ? `Great! Move up to ${nextPose.name}.` : `Skipping ahead. Move up to ${nextPose.name}.`);
      }
      return false;
    },
    [cleanupMedia]
  );

  const detectLoop = useCallback(
    (timestamp: number) => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (phaseRef.current === "rest") {
        if (lastFrameTsRef.current === null) lastFrameTsRef.current = timestamp;
        const delta = timestamp - lastFrameTsRef.current;
        lastFrameTsRef.current = timestamp;
        restRemainingRef.current = Math.max(0, restRemainingRef.current - delta);
        setRestSecondsLeft(formatSeconds(restRemainingRef.current));
        if (restRemainingRef.current <= 0) {
          phaseRef.current = "active";
          setPhase("active");
          beginPose(poseIndexRef.current);
        }
        rafRef.current = requestAnimationFrame(detectLoopRef.current);
        return;
      }

      if (phaseRef.current !== "active" || !video || !landmarker || video.readyState < 2) {
        lastFrameTsRef.current = timestamp;
        rafRef.current = requestAnimationFrame(detectLoopRef.current);
        return;
      }

      if (lastFrameTsRef.current === null) lastFrameTsRef.current = timestamp;
      const delta = timestamp - lastFrameTsRef.current;
      lastFrameTsRef.current = timestamp;

      if (timestamp - lastDetectRef.current >= DETECT_INTERVAL_MS) {
        lastDetectRef.current = timestamp;
        const result = landmarker.detectForVideo(video, timestamp);
        const landmarks = result.landmarks?.[0] as Landmark[] | undefined;

        if (landmarks && landmarks.length > 0) {
          const pose = POSE_LIBRARY[poseIndexRef.current];
          const evaluation = evaluatePose(landmarks, pose);

          recentScoresRef.current.push(evaluation.score);
          if (recentScoresRef.current.length > STABILITY_WINDOW) recentScoresRef.current.shift();
          const smoothedScore =
            recentScoresRef.current.reduce((sum, s) => sum + s, 0) / recentScoresRef.current.length;
          const smoothedCorrect = smoothedScore >= 0.8;
          const smoothedPct = Math.round(smoothedScore * 100);

          accuracySumRef.current += smoothedScore;
          accuracyCountRef.current += 1;

          setIssues(evaluation.issues.slice(0, 2));
          setIsCorrect(smoothedCorrect);
          setLiveAccuracy(smoothedPct);
          drawFrame(landmarks, evaluation.failingLandmarks);

          if (smoothedCorrect) {
            holdMsRef.current += delta;
          }

          if (voiceEnabledRef.current) {
            if (smoothedCorrect) {
              if (
                lastSpokenKeyRef.current !== "correct" &&
                timestamp - lastSpokenAtRef.current > VOICE_PRAISE_DEBOUNCE_MS
              ) {
                speak("Perfect, hold it there.");
                lastSpokenKeyRef.current = "correct";
                lastSpokenAtRef.current = timestamp;
              }
            } else {
              const topIssue = evaluation.issues[0];
              if (
                topIssue &&
                topIssue !== lastSpokenKeyRef.current &&
                timestamp - lastSpokenAtRef.current > VOICE_HINT_DEBOUNCE_MS
              ) {
                speak(topIssue);
                lastSpokenKeyRef.current = topIssue;
                lastSpokenAtRef.current = timestamp;
              }
            }
          }
        } else {
          setIssues(["We can't see you fully — step back so your whole body is in frame."]);
          setIsCorrect(false);
          setLiveAccuracy(0);
          drawFrame(null, new Set());

          if (
            voiceEnabledRef.current &&
            lastSpokenKeyRef.current !== "visibility" &&
            timestamp - lastSpokenAtRef.current > VOICE_HINT_DEBOUNCE_MS
          ) {
            speak("I can't see you fully. Please step back so your whole body is in frame.");
            lastSpokenKeyRef.current = "visibility";
            lastSpokenAtRef.current = timestamp;
          }
        }

        setHoldSecondsLeft(formatSeconds(poseHoldMs(poseIndexRef.current) - holdMsRef.current));

        if (holdMsRef.current >= POSE_LIBRARY[poseIndexRef.current].holdSeconds * 1000) {
          const finished = finalizePoseAndAdvance(true);
          if (finished) return;
        }
      }

      rafRef.current = requestAnimationFrame(detectLoopRef.current);
    },
    [beginPose, finalizePoseAndAdvance]
  );

  useEffect(() => {
    detectLoopRef.current = detectLoop;
  }, [detectLoop]);

  async function startSession() {
    setErrorMessage(null);
    setPhase("loading");
    phaseRef.current = "loading";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);

      let landmarker: PoseLandmarkerType;
      try {
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_ASSET_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 1,
        });
      } catch {
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_ASSET_URL, delegate: "CPU" },
          runningMode: "VIDEO",
          numPoses: 1,
        });
      }
      landmarkerRef.current = landmarker;

      poseIndexRef.current = 0;
      resultsRef.current = [];
      lastFrameTsRef.current = null;
      lastDetectRef.current = 0;

      setPoseIndex(0);
      setResults([]);

      phaseRef.current = "active";
      setPhase("active");
      beginPose(0);
      rafRef.current = requestAnimationFrame(detectLoop);
    } catch (err) {
      cleanupMedia();
      phaseRef.current = "error";
      setPhase("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Couldn't start the camera or load the pose model. Please check camera permissions and try again."
      );
    }
  }

  function endSession() {
    cleanupMedia();
    phaseRef.current = "idle";
    setPhase("idle");
  }

  function skipPose() {
    finalizePoseAndAdvance(false);
  }

  const avatarState: AvatarState =
    phase === "loading"
      ? "thinking"
      : phase === "active"
        ? isCorrect
          ? "talking"
          : "concerned"
        : "idle";

  const avatarCaption =
    phase === "loading"
      ? "Starting your camera and loading the pose model..."
      : phase === "active"
        ? isCorrect
          ? `Great form — ${liveAccuracy}% match, hold it there!`
          : `${liveAccuracy}% match — ${issues[0] ?? "Adjusting..."}`
        : phase === "rest"
          ? "Nice work. Rest a moment before the next pose."
          : phase === "complete"
            ? "Session complete — well done!"
            : "Ready when you are.";

  return (
    <div className="w-full max-w-2xl space-y-5">
      <Avatar state={avatarState} caption={avatarCaption} />

      {phase === "idle" && (
        <div className="rounded-3xl border border-teal-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-teal-900">Yoga Pose Corrector</h2>
          <p className="mt-2 text-sm text-teal-600">
            A {POSE_LIBRARY.length}-pose, timer-guided session with real-time form feedback and spoken
            coaching using your camera. All pose detection runs locally in your browser — no video is
            uploaded.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-left text-sm text-teal-800 sm:grid-cols-3">
            {POSE_LIBRARY.map((pose) => (
              <li key={pose.id} className="rounded-xl border border-teal-100 px-3 py-2">
                <span className="mr-1">{pose.emoji}</span>
                {pose.name}
              </li>
            ))}
          </ul>

          <label className="mt-4 flex items-center justify-center gap-2 text-sm text-teal-700">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
            />
            Spoken coaching (tells you when to hold and when to move up)
          </label>

          <button
            type="button"
            onClick={startSession}
            className="mt-5 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Start session
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm text-rose-700">{errorMessage}</p>
          <button
            type="button"
            onClick={startSession}
            className="mt-4 rounded-xl border border-rose-300 bg-white px-5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            Try again
          </button>
        </div>
      )}

      {(phase === "loading" || phase === "active" || phase === "rest") && (
        <div className="space-y-4">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border border-teal-100 bg-black/5">
            <video ref={videoRef} muted playsInline className="h-full w-full scale-x-[-1] object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full scale-x-[-1]" />

            {phase === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-teal-700">
                Loading camera and pose model...
              </div>
            )}

            {phase === "rest" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/80 text-teal-800">
                <span className="text-3xl font-bold">{restSecondsLeft}</span>
                <span className="text-sm">Get ready for {POSE_LIBRARY[poseIndex]?.name}</span>
              </div>
            )}

            {phase === "active" && (
              <>
                <div
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-lg font-bold shadow ${accuracyBadgeColor(liveAccuracy)}`}
                >
                  {liveAccuracy}%
                </div>
                <div
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    isCorrect ? "bg-teal-500 text-white" : "bg-amber-400 text-amber-950"
                  }`}
                >
                  {isCorrect ? "Hold it!" : "Adjust"}
                </div>
              </>
            )}
          </div>

          {phase === "active" && currentPose && (
            <div className="rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-teal-900">
                  {currentPose.emoji} {currentPose.name}{" "}
                  <span className="text-sm font-normal text-teal-500">({currentPose.sanskritName})</span>
                </h3>
                <span className="text-sm font-medium text-teal-600">
                  Pose {poseIndex + 1} / {POSE_LIBRARY.length}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-teal-400">
                    Hold timer
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-teal-100">
                    <div
                      className="h-full bg-teal-500 transition-all"
                      style={{
                        width: `${Math.min(100, (1 - holdSecondsLeft / currentPose.holdSeconds) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-semibold text-teal-700">
                    {holdSecondsLeft}s
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-teal-400">
                    Form accuracy
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-teal-100">
                    <div
                      className={`h-full transition-all ${accuracyBarColor(liveAccuracy)}`}
                      style={{ width: `${liveAccuracy}%` }}
                    />
                  </div>
                  <span className={`w-10 shrink-0 text-right text-sm font-semibold ${accuracyTextColor(liveAccuracy)}`}>
                    {liveAccuracy}%
                  </span>
                </div>
              </div>

              {currentPose.cameraNote && <p className="mt-2 text-xs text-amber-600">{currentPose.cameraNote}</p>}

              <ul className="mt-3 space-y-1 text-sm text-teal-700">
                {currentPose.instructions.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>

              {issues.length > 0 && !isCorrect && (
                <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {issues.map((issue, i) => (
                    <p key={i}>{issue}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
            >
              {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
            {phase === "active" && (
              <button
                type="button"
                onClick={skipPose}
                className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
              >
                Skip this pose
              </button>
            )}
            <button
              type="button"
              onClick={endSession}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              End session
            </button>
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-teal-900">Session complete 🎉</h2>

          {(() => {
            const completedResults = results.filter((r) => r.heldFullDuration);
            if (completedResults.length === 0) return null;
            const overallPct = Math.round(
              (completedResults.reduce((sum, r) => sum + r.avgAccuracy, 0) / completedResults.length) * 100
            );
            return (
              <p className={`mt-1 text-sm font-medium ${accuracyTextColor(overallPct)}`}>
                Overall form accuracy: {overallPct}%
              </p>
            );
          })()}

          <div className="mt-4 space-y-2">
            {results.map((result) => (
              <div
                key={result.poseId}
                className="flex items-center justify-between rounded-xl border border-teal-100 px-3 py-2 text-sm"
              >
                <span className="text-teal-900">{result.name}</span>
                <span className={result.heldFullDuration ? accuracyTextColor(Math.round(result.avgAccuracy * 100)) : "text-amber-600"}>
                  {result.heldFullDuration
                    ? `Completed · ${Math.round(result.avgAccuracy * 100)}% form`
                    : "Skipped"}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("idle");
              phaseRef.current = "idle";
            }}
            className="mt-5 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Start another session
          </button>
        </div>
      )}
    </div>
  );
}
