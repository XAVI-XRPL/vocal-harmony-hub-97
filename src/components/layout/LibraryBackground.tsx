import libraryBackground from "@/assets/library-background.png";

export function LibraryBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={libraryBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-background/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
    </div>
  );
}
