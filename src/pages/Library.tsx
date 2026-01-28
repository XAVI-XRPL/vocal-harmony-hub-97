import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SongCard } from "@/components/song/SongCard";
import { LibrarySkeleton } from "@/components/ui/loading-shimmer";
import { IconButton } from "@/components/ui/icon-button";
import { mockSongs } from "@/data/mockSongs";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

const genres = ["All", "Pop", "Soul", "R&B", "Jazz", "Rock", "Acoustic", "Electronic", "Classical"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Library() {
  const { searchQuery, setSearchQuery, activeFilters, setFilter, clearFilters } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter songs
  const filteredSongs = useMemo(() => {
    return mockSongs.filter((song) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.genre.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Genre filter
      if (activeFilters.genre && activeFilters.genre !== "All") {
        if (song.genre !== activeFilters.genre) return false;
      }

      // Difficulty filter
      if (activeFilters.difficulty && activeFilters.difficulty !== "All") {
        if (song.difficulty !== activeFilters.difficulty.toLowerCase()) return false;
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

  const hasActiveFilters = activeFilters.genre || activeFilters.difficulty;

  return (
    <div className="min-h-screen">
      <Header title="Library" showSearch={false} />

      <div className="px-4 pb-8">
        {/* Search Bar */}
        <div className="sticky top-14 z-30 py-3 -mx-4 px-4 glass-card rounded-none border-x-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full h-11 pl-10 pr-4 rounded-xl",
                  "bg-glass border border-glass-border",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:border-glass-border-hover focus:bg-glass-hover",
                  "transition-all duration-200"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <IconButton
              icon={Filter}
              variant="accent"
              active={showFilters || !!hasActiveFilters}
              onClick={() => setShowFilters(!showFilters)}
              label="Toggle filters"
            />
          </div>

          {/* Filter chips */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-3"
            >
              {/* Genre filters */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Genre</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setFilter("genre", genre === "All" ? null : genre)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        activeFilters.genre === genre || (genre === "All" && !activeFilters.genre)
                          ? "gradient-bg text-white"
                          : "bg-glass border border-glass-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty filters */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setFilter("difficulty", difficulty === "All" ? null : difficulty)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        activeFilters.difficulty === difficulty || (difficulty === "All" && !activeFilters.difficulty)
                          ? "gradient-bg text-white"
                          : "bg-glass border border-glass-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 mb-3">
          <p className="text-sm text-muted-foreground">
            {filteredSongs.length} {filteredSongs.length === 1 ? "song" : "songs"} found
          </p>
        </div>

        {/* Song Grid */}
        {isLoading ? (
          <LibrarySkeleton count={6} />
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No songs found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredSongs.map((song) => (
              <motion.div key={song.id} variants={itemVariants}>
                <SongCard song={song} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
