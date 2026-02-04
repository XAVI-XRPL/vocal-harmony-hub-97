import recordsWallBackground from "@/assets/records-wall-background.png";

export function RecordsWallBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Records wall image with slow zoom animation */}
      <img
        src={recordsWallBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
      />

      {/* Dark overlay for card readability */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Gradient overlay for color blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
    </div>
  );
}
