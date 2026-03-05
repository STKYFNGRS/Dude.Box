"use client";

import { useEffect, useRef, useState } from "react";

export interface TimelineEvent {
  id: string;
  date: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  label?: string;
}

interface EventTimelineProps {
  events?: TimelineEvent[];
  className?: string;
}

const TYPE_COLORS: Record<string, string> = {
  conflict: "#ef4444",
  military: "#f97316",
  political: "#a855f7",
  protest: "#eab308",
  disaster: "#3b82f6",
  cyber: "#06b6d4",
  default: "#6b7280",
};

const SEVERITY_RADIUS: Record<TimelineEvent["severity"], number> = {
  CRITICAL: 7,
  HIGH: 5.5,
  MEDIUM: 4,
  LOW: 3,
};

export default function EventTimeline({ events = [], className = "" }: EventTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 140 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width: Math.max(width, 200), height: 140 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || events.length === 0) return;

    import("d3").then((d3) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const { width, height } = dimensions;
      const margin = { top: 20, right: 20, bottom: 28, left: 20 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const xScale = d3
        .scaleTime()
        .domain([sevenDaysAgo, now])
        .range([0, innerW]);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xAxis = d3
        .axisBottom(xScale)
        .ticks(7)
        .tickFormat((d) => d3.timeFormat("%-m/%d")(d as Date));

      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(xAxis)
        .call((sel) => {
          sel.select(".domain").attr("stroke", "#374151");
          sel.selectAll(".tick line").attr("stroke", "#374151");
          sel.selectAll(".tick text").attr("fill", "#6b7280").attr("font-size", "10px");
        });

      g.selectAll(".grid-line")
        .data(xScale.ticks(7))
        .join("line")
        .attr("class", "grid-line")
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", 0)
        .attr("y2", innerH)
        .attr("stroke", "#1f2937")
        .attr("stroke-dasharray", "2,4");

      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", innerH / 2)
        .attr("y2", innerH / 2)
        .attr("stroke", "#374151")
        .attr("stroke-width", 1);

      const filtered = events.filter((e) => {
        const d = new Date(e.date);
        return d >= sevenDaysAgo && d <= now;
      });

      const yJitter = (i: number) => {
        const base = innerH / 2;
        const offset = ((i % 5) - 2) * (innerH / 8);
        return base + offset;
      };

      const tooltip = d3
        .select(containerRef.current)
        .append("div")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "#111827")
        .style("border", "1px solid #374151")
        .style("border-radius", "6px")
        .style("padding", "6px 10px")
        .style("font-size", "11px")
        .style("color", "#e5e7eb")
        .style("opacity", 0)
        .style("z-index", 50);

      g.selectAll(".event-dot")
        .data(filtered)
        .join("circle")
        .attr("class", "event-dot")
        .attr("cx", (d) => xScale(new Date(d.date)))
        .attr("cy", (_, i) => yJitter(i))
        .attr("r", (d) => SEVERITY_RADIUS[d.severity])
        .attr("fill", (d) => TYPE_COLORS[d.type] ?? TYPE_COLORS.default)
        .attr("opacity", 0.85)
        .attr("stroke", (d) => TYPE_COLORS[d.type] ?? TYPE_COLORS.default)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.4)
        .style("cursor", "pointer")
        .style("filter", (d) =>
          d.severity === "CRITICAL"
            ? `drop-shadow(0 0 4px ${TYPE_COLORS[d.type] ?? TYPE_COLORS.default})`
            : "none"
        )
        .on("mouseenter", function (event, d) {
          d3.select(this).transition().duration(100).attr("r", (SEVERITY_RADIUS[d.severity] ?? 4) + 2);
          tooltip
            .html(
              `<strong>${d.label ?? d.type}</strong><br/><span style="color:${TYPE_COLORS[d.type] ?? TYPE_COLORS.default}">${d.severity}</span> · ${d3.timeFormat("%b %d, %H:%M")(new Date(d.date))}`
            )
            .style("left", `${event.offsetX + 12}px`)
            .style("top", `${event.offsetY - 10}px`)
            .transition()
            .duration(100)
            .style("opacity", 1);
        })
        .on("mouseleave", function (_, d) {
          d3.select(this).transition().duration(100).attr("r", SEVERITY_RADIUS[d.severity]);
          tooltip.transition().duration(100).style("opacity", 0);
        });

      return () => {
        tooltip.remove();
      };
    });
  }, [events, dimensions]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-[140px] text-sm text-gray-600">
          No events in the last 7 days
        </div>
      ) : (
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
          style={{ background: "transparent" }}
        />
      )}
    </div>
  );
}
