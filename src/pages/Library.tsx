import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Music, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SongCard } from "@/components/song/SongCard";
import { LibrarySkeleton } from "@/components/ui/loading-shimmer";
import { IconButton } from "@/components/ui/icon-button";
import { useSongs } from "@/hooks/useSongs";
import { useAutoPreload } from "@/hooks/useAudioPreload";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

const genres = ["All", "Pop", "Soul", "R&B", "Jazz", "Rock", "Acoustic", "Electronic", "Classical", "Gospel"];
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
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch songs from database
  const { data: songs, isLoading, error } = useSongs();
  
  // Auto-preload the first 2 songs when library loads
  useAutoPreload(songs, 2);

  // Filter songs
  const filteredSongs = useMemo(() => {
    if (!songs) return [];
    
    return songs.filter((song) => {
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
  }, [songs, searchQuery, activeFilters]);

  const hasActiveFilters = activeFilters.genre || activeFilters.difficulty;

  return (
    <div className="min-h-screen">
      <Header title="Library" showSearch={false} />

      <div className="px-4 pb-8">
        {/* Search Bar */}
        <div className="sticky top-14 z-30 py-3 -mx-4 px-4 glass-card rounded-none border-x-0 backdrop-blur-xl">
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
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                  "transition-all duration-300"
                )}
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
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
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-3 space-y-3"
            >
              {/* Genre filters */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Genre</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <motion.button
                      key={genre}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter("genre", genre === "All" ? null : genre)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                        activeFilters.genre === genre || (genre === "All" && !activeFilters.genre)
                          ? "gradient-bg text-white shadow-lg"
                          : "bg-glass border border-glass-border text-muted-foreground hover:text-foreground hover:border-glass-border-hover"
                      )}
                    >
                      {genre}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulty filters */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <motion.button
                      key={difficulty}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter("difficulty", difficulty === "All" ? null : difficulty)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                        activeFilters.difficulty === difficulty || (difficulty === "All" && !activeFilters.difficulty)
                          ? "gradient-bg text-white shadow-lg"
                          : "bg-glass border border-glass-border text-muted-foreground hover:text-foreground hover:border-glass-border-hover"
                      )}
                    >
                      {difficulty}
                    </motion.button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearFilters}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 mb-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading songs...
              </span>
            ) : (
              `${filteredSongs.length} ${filteredSongs.length === 1 ? "song" : "songs"} found`
            )}
          </p>
        </div>

        {/* Error state */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <p className="text-destructive mb-2">Failed to load songs</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          </motion.div>
        )}

        {/* Song Grid */}
        {isLoading ? (
          <LibrarySkeleton count={6} />
        ) : filteredSongs.length === 0 && !error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-muted/50 flex items-center justify-center"
            >
              <Music className="w-10 h-10 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground mb-2">No songs found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
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
