export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/4" />
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="flex gap-1">
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="h-5 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-1/3 mt-1" />
        <div className="h-9 bg-gray-200 rounded-lg mt-1" />
      </div>
    </div>
  );
}
