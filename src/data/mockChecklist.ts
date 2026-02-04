import { ChecklistItem } from "@/types";

export const mockChecklist: ChecklistItem[] = [
  {
    id: "check-1",
    label: "Steam for 10 minutes",
    category: "vocal",
    description: "Use a personal steamer to hydrate vocal cords before warmups",
    order: 1,
  },
  {
    id: "check-2",
    label: "Vocal warmup routine",
    category: "vocal",
    description: "Complete your lip trills, scales, and sirens",
    order: 2,
  },
  {
    id: "check-3",
    label: "Hydrate (16oz water)",
    category: "vocal",
    description: "Drink at least 16oz of room temperature water",
    order: 3,
  },
  {
    id: "check-4",
    label: "Test IEMs & backup",
    category: "gear",
    description: "Verify both primary and backup in-ear monitors are working",
    order: 4,
  },
  {
    id: "check-5",
    label: "Check mic & wireless",
    category: "gear",
    description: "Test microphone, wireless pack batteries, and backup batteries",
    order: 5,
  },
  {
    id: "check-6",
    label: "Breath exercises (5 min)",
    category: "mental",
    description: "Box breathing or diaphragmatic exercises to center yourself",
    order: 6,
  },
  {
    id: "check-7",
    label: "Review setlist",
    category: "mental",
    description: "Quick mental run-through of song order and any special notes",
    order: 7,
  },
  {
    id: "check-8",
    label: "Light stretch routine",
    category: "physical",
    description: "Neck rolls, shoulder stretches, and jaw relaxation",
    order: 8,
  },
];
