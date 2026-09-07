import { Suspense } from "react";
import HandoffContent from "./HandoffContent";

export const metadata = {
  title: "Referral Summary — Sehat Saathi",
  description: "An AI-assistive health referral summary shared via Sehat Saathi.",
};

export default function HandoffPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-teal-50" />}>
      <HandoffContent />
    </Suspense>
  );
}
