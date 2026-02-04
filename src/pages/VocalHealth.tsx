import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USAMap } from "@/components/medical/USAMap";
import { DoctorList } from "@/components/medical/DoctorList";
import { VenueList } from "@/components/medical/VenueList";
import { EMTBadge } from "@/components/medical/EMTBadge";
import { mockDoctors } from "@/data/mockDoctors";
import { mockVenues } from "@/data/mockVenues";
import { US_STATES, type StateData } from "@/data/usStateData";
import { Input } from "@/components/ui/input";

export default function VocalHealth() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // For demo purposes, map state abbr to city IDs that exist in mockDoctors
  // This bridges the gap until we add state_fips to the database
  const stateToMockCityMap: Record<string, string[]> = {
    "CA": ["los-angeles", "san-francisco"],
    "NY": ["new-york"],
    "TN": ["nashville"],
    "TX": ["austin", "dallas", "houston"],
    "IL": ["chicago"],
    "GA": ["atlanta"],
    "FL": ["miami"],
    "NV": ["las-vegas"],
    "WA": ["seattle"],
    "MA": ["boston"],
    "CO": ["denver"],
    "AZ": ["phoenix"],
    "PA": ["philadelphia"],
  };

  const filteredDoctors = useMemo(() => {
    if (!selectedState) return mockDoctors.slice(0, 6);
    const cityIds = stateToMockCityMap[selectedState.abbr] || [];
    const filtered = mockDoctors.filter(d => cityIds.includes(d.cityId));
    return filtered.length > 0 ? filtered : mockDoctors.slice(0, 3);
  }, [selectedState]);

  const filteredVenues = useMemo(() => {
    if (!selectedState) return mockVenues.slice(0, 6);
    const cityIds = stateToMockCityMap[selectedState.abbr] || [];
    const filtered = mockVenues.filter(v => cityIds.includes(v.cityId));
    return filtered.length > 0 ? filtered : mockVenues.slice(0, 3);
  }, [selectedState]);

  const handleStateSelect = (state: StateData) => {
    setSelectedState(prev => prev?.id === state.id ? null : state);
  };

  const handleClearSelection = () => {
    setSelectedState(null);
    setSearchQuery("");
  };

  // Filter states for search highlighting on the map
  const matchingStates = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return US_STATES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.abbr.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen">
      {/* Medical Theme Background */}
      <div className="fixed inset-0 medical-bg" />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background/95" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 px-4 py-4 header-glass"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/hub")}
              className="p-2 rounded-xl hover:bg-accent-medical/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <EMTBadge size="md" />
              <div>
                <h1 className="text-xl font-bold medical-gradient-text">Vocal Health</h1>
                <p className="text-xs text-muted-foreground">Find ENT & Vocal Specialists</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Search Bar */}
        <section className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by state, abbreviation, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 bg-card/50 border-glass-border focus:border-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Search results hint */}
          {searchQuery && matchingStates.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mt-2"
            >
              {matchingStates.length} state{matchingStates.length !== 1 ? 's' : ''} highlighted • Tap to select
            </motion.p>
          )}
        </section>

        {/* Map Section */}
        <section className="px-4 py-2">
          <div className="medical-card rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Select a State</h2>
              {selectedState && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleClearSelection}
                  className="text-xs text-accent-medical hover:underline"
                >
                  Clear Selection
                </motion.button>
              )}
            </div>
            <USAMap
              selectedState={selectedState}
              onStateSelect={handleStateSelect}
              searchQuery={searchQuery}
            />
          </div>
        </section>

        {/* Selected State Info */}
        <AnimatePresence mode="wait">
          {selectedState && (
            <motion.section
              key={selectedState.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 pb-4"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-medical/10 border border-accent-medical/20">
                <MapPin className="w-4 h-4 text-accent-medical" />
                <span className="text-sm font-medium text-foreground">
                  {selectedState.name}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {selectedState.region}
                </span>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Venues Section */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedState ? `Venues in ${selectedState.name}` : "Major Venues"}
          </h2>
          <VenueList venues={filteredVenues} />
        </section>

        {/* Doctors Section */}
        <section className="px-4 py-4 pb-32">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedState ? `Specialists in ${selectedState.name}` : "Top Vocal Health Specialists"}
          </h2>
          <DoctorList doctors={filteredDoctors} />
        </section>
      </div>
    </div>
  );
}
