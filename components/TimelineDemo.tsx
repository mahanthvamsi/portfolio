import React from "react";
import { Timeline } from "@/components/timeline";
import { timelineData } from "@/data";

export function TimelineDemo() {
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={timelineData} />
    </div>
  );
}
