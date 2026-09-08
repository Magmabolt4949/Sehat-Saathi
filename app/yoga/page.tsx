import YogaPageClient from "./YogaPageClient";

export const metadata = {
  title: "Yoga Pose Corrector — Sehat Saathi",
  description: "A timer-guided yoga session with real-time, in-browser pose form feedback.",
};

export default function YogaPage() {
  return <YogaPageClient />;
}
