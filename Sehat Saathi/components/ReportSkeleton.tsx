export default function ReportSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-lg shadow-teal-900/5 sm:p-8">
      <div className="space-y-2.5">
        <div className="h-3 w-20 animate-shimmer rounded-full" />
        <div className="h-4 w-full animate-shimmer rounded-full" />
        <div className="h-4 w-5/6 animate-shimmer rounded-full" />
        <div className="h-4 w-2/3 animate-shimmer rounded-full" />
      </div>

      <div className="space-y-3 border-t border-teal-100 pt-5">
        <div className="h-3 w-40 animate-shimmer rounded-full" />
        <div className="h-16 w-full animate-shimmer rounded-2xl" />
        <div className="h-16 w-full animate-shimmer rounded-2xl" />
      </div>

      <div className="space-y-2.5 border-t border-teal-100 pt-5">
        <div className="h-3 w-32 animate-shimmer rounded-full" />
        <div className="h-3.5 w-full animate-shimmer rounded-full" />
        <div className="h-3.5 w-4/5 animate-shimmer rounded-full" />
      </div>
    </div>
  );
}
