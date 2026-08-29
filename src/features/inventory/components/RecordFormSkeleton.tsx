export function RecordFormSkeleton() {
  return (
    <div className="pb-24 animate-pulse">
      {/* Sticky Header Skeleton */}
      <div className="sticky top-0 bg-white z-30 border-b border-slate-200 pt-3 pb-2 mb-6">
        <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
        <div className="h-7 w-64 bg-slate-200 rounded mb-4" />

        {/* Tab Bar Skeletons */}
        <div className="flex items-center gap-6 overflow-x-auto pt-2 pb-1">
          <div className="h-6 w-24 bg-slate-200 rounded-md shrink-0" />
          <div className="h-6 w-28 bg-slate-200 rounded-md shrink-0" />
          <div className="h-6 w-32 bg-slate-200 rounded-md shrink-0" />
          <div className="h-6 w-24 bg-slate-200 rounded-md shrink-0" />
          <div className="h-6 w-28 bg-slate-200 rounded-md shrink-0" />
        </div>
      </div>

      {/* 5 Form Section Skeletons */}
      {[1, 2, 3, 4, 5].map((sectionIndex) => (
        <div key={sectionIndex} className="mb-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            {/* Left Section Title Sidebar Skeleton */}
            <div className="w-full md:w-56 shrink-0">
              <div className="h-5 w-36 bg-slate-200 rounded" />
              <div className="h-3.5 w-48 bg-slate-100 rounded mt-2" />
            </div>

            {/* Right Inputs Grid Skeleton (6 fields per section) */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="h-3.5 w-24 bg-slate-200 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-lg border border-slate-200/60" />
                </div>
              ))}
            </div>
          </div>

          {/* Dashed Section Divider */}
          {sectionIndex < 5 && (
            <div className="border-t border-dashed border-slate-200 my-8" />
          )}
        </div>
      ))}

      {/* Fixed Sticky Footer Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-3.5 flex items-center justify-end gap-3 z-40">
        <div className="h-9 w-20 bg-slate-200 rounded-lg" />
        <div className="h-9 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

export default RecordFormSkeleton;
