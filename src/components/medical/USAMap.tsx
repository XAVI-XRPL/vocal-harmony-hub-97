import React, { useState, useMemo, useCallback } from "react";
import { US_STATES, type StateData } from "@/data/usStateData";

interface USAMapProps {
  selectedState: StateData | null;
  onStateSelect: (state: StateData) => void;
  searchQuery?: string;
}

// Small NE states: use smaller label font to avoid overlap
const SMALL_STATES = new Set(["09", "10", "11", "24", "25", "33", "34", "44", "50"]);

export function USAMap({
  selectedState,
  onStateSelect,
  searchQuery = "",
}: USAMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // IDs of states matching current search
  const matchingIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      US_STATES
        .filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.abbr.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
        )
        .map(s => s.id)
    );
  }, [searchQuery]);

  const getFill = useCallback((state: StateData) => {
    const isSelected = selectedState?.id === state.id;
    const isHovered = hoveredState === state.id;
    const isMatch = searchQuery && matchingIds.has(state.id);

    if (isSelected) return "hsl(168 76% 39%)";     // teal - matches --map-fill-selected
    if (isMatch) return "hsl(38 92% 50%)";         // amber - matches --map-fill-search
    if (isHovered) return "hsl(197 93% 63%)";      // lighter blue - matches --map-fill-hover
    return "hsl(201 68% 59%)";                     // default blue - matches --map-fill
  }, [selectedState, hoveredState, searchQuery, matchingIds]);

  const getStroke = useCallback((state: StateData) => {
    const isSelected = selectedState?.id === state.id;
    const isHovered = hoveredState === state.id;

    if (isSelected) return "rgba(255,255,255,0.95)";
    if (isHovered) return "rgba(255,255,255,0.9)";
    return "rgba(255,255,255,0.65)";
  }, [selectedState, hoveredState]);

  const getStrokeWidth = useCallback((state: StateData) => {
    if (selectedState?.id === state.id) return 2;
    if (hoveredState === state.id) return 1.5;
    return 0.8;
  }, [selectedState, hoveredState]);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 960 620"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive map of the United States"
      >
        <defs>
          {/* Glow filter for selected state */}
          <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle drop shadow for map depth */}
          <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>

        <g filter="url(#map-shadow)">
          {/* Render all state shapes */}
          {US_STATES.map((state) => {
            const isSelected = selectedState?.id === state.id;
            return (
              <path
                key={state.id}
                d={state.d}
                fill={getFill(state)}
                stroke={getStroke(state)}
                strokeWidth={getStrokeWidth(state)}
                strokeLinejoin="round"
                className="cursor-pointer"
                style={{
                  transition: "fill 0.2s ease, stroke 0.2s ease, stroke-width 0.15s ease",
                  filter: isSelected ? "url(#state-glow)" : "none",
                }}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateSelect(state)}
              >
                <title>{state.name}</title>
              </path>
            );
          })}

          {/* State abbreviation labels (skip Hawaii for now due to small inset) */}
          {US_STATES.filter(s => s.id !== "15").map((state) => {
            const isSmall = SMALL_STATES.has(state.id);
            const isActive = selectedState?.id === state.id || hoveredState === state.id;
            const fontSize = isSmall ? 7 : 10;

            return (
              <text
                key={`lbl-${state.id}`}
                x={state.cx}
                y={state.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fontSize}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight={isActive ? 700 : 600}
                fill={isActive ? "#ffffff" : "rgba(255,255,255,0.85)"}
                className="pointer-events-none select-none"
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  transition: "fill 0.2s ease",
                }}
              >
                {state.abbr}
              </text>
            );
          })}
        </g>
      </svg>

      {/* Floating tooltip on hover */}
      {hoveredState && (() => {
        const state = US_STATES.find(s => s.id === hoveredState);
        if (!state) return null;
        return (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-lg text-sm font-semibold pointer-events-none whitespace-nowrap"
            style={{
              background: "rgba(2, 8, 16, 0.92)",
              border: "1px solid hsl(var(--glass-border))",
              color: "hsl(var(--foreground))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {state.name}
            <span className="text-muted-foreground ml-2">
              {state.region}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

export default USAMap;
