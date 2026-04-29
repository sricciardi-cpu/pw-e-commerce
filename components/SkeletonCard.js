export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-700 overflow-hidden flex flex-col animate-pulse">
      <div className="h-52 bg-zinc-800" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-zinc-700 rounded-full w-1/4" />
        <div className="h-4 bg-zinc-700 rounded-full w-3/4" />
        <div className="flex gap-1">
          <div className="h-5 w-8 bg-zinc-700 rounded" />
          <div className="h-5 w-8 bg-zinc-700 rounded" />
          <div className="h-5 w-8 bg-zinc-700 rounded" />
        </div>
        <div className="h-5 bg-zinc-700 rounded-full w-1/3 mt-1" />
        <div className="h-9 bg-zinc-700 rounded-lg mt-1" />
      </div>
    </div>
  );
}
