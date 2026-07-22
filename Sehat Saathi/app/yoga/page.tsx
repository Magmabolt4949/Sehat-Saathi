import NavBar from "@/components/NavBar";
import YogaSession from "@/components/yoga/YogaSession";

export const metadata = {
  title: "Yoga Pose Corrector — Sehat Saathi",
  description: "A timer-guided yoga session with real-time, in-browser pose form feedback.",
};

export default function YogaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-teal-50 to-white px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-teal-900">🩺 Sehat Saathi</h1>
        <NavBar />
      </header>

      <YogaSession />

      <p className="max-w-2xl px-2 text-center text-xs text-teal-400">
        The yoga corrector gives assistive form guidance only, not physiotherapy or medical advice. Stop
        immediately if you feel pain, and consult a doctor before starting a new exercise routine if you
        have a medical condition.
      </p>
    </main>
  );
}
