import React from "react";

const NotesSkelaton = () => {
  return (
    <div className="flex flex-col bg-base-Cards border border-base-border rounded-2xl overflow-hidden h-full animate-pulse">
      <div className="w-full h-52 bg-base-nav/60" />

      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-16 h-4 bg-base-border rounded-full" />

          <div className="w-3/4 h-6 bg-base-border rounded-md" />

          <div className="space-y-2">
            <div className="w-full h-3.5 bg-base-border rounded" />
            <div className="w-5/6 h-3.5 bg-base-border rounded" />
          </div>
        </div>

        <div className="pt-4 border-t border-base-border flex items-center justify-between">
          <div className="w-24 h-3 bg-base-border rounded" />
          <div className="w-20 h-3 bg-base-border rounded" />
        </div>
      </div>
    </div>
  );
};

export default NotesSkelaton;
