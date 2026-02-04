import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USAMap } from "@/components/medical/USAMap";
import { DoctorList } from "@/components/medical/DoctorList";
import { VenueList } from "@/components/medical/VenueList";
import { EMTBadge } from "@/components/medical/EMTBadge";
import { mockCities } from "@/data/mockCities";
import { mockDoctors } from "@/data/mockDoctors";
import { mockVenues } from "@/data/mockVenues";
import { City } from "@/types";

export default function VocalHealth() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const filteredDoctors = selectedCity
    ? mockDoctors.filter((d) => d.cityId === selectedCity.id)
    : mockDoctors;

  const filteredVenues = selectedCity
    ? mockVenues.filter((v) => v.cityId === selectedCity.id)
    : mockVenues.slice(0, 6);

  const handleCitySelect = (city: City | null) => {
    setSelectedCity(city);
  };

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
                <p className="text-xs text-muted-foreground">Find ENT doctors near your venue</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Map Section */}
        <section className="px-4 py-6">
          <div className="medical-card rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Select a City</h2>
              {selectedCity && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedCity(null)}
                  className="text-xs text-accent-medical hover:underline"
                >
                  Clear Selection
                </motion.button>
              )}
            </div>
            <USAMap
              cities={mockCities}
              selectedCity={selectedCity}
              onCitySelect={handleCitySelect}
            />
          </div>
        </section>

        {/* Selected City Info */}
        <AnimatePresence mode="wait">
          {selectedCity && (
            <motion.section
              key={selectedCity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 pb-4"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-medical/10 border border-accent-medical/20">
                <MapPin className="w-4 h-4 text-accent-medical" />
                <span className="text-sm font-medium text-foreground">
                  {selectedCity.name}, {selectedCity.abbreviation}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {selectedCity.doctorCount} doctors • {selectedCity.venueCount} venues
                </span>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Venues Section */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedCity ? `Venues in ${selectedCity.name}` : "Major Venues"}
          </h2>
          <VenueList venues={filteredVenues} />
        </section>

        {/* Doctors Section */}
        <section className="px-4 py-4 pb-32">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedCity ? `Specialists in ${selectedCity.name}` : "Top Vocal Health Specialists"}
          </h2>
          <DoctorList doctors={filteredDoctors} />
        </section>
      </div>
    </div>
  );
}
