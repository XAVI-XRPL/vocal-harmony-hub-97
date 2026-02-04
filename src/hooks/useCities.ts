import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { City } from "@/types";

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async (): Promise<City[]> => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");

      if (error) throw error;

      return (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        state: c.state,
        abbreviation: c.abbreviation,
        svgX: c.svg_x,
        svgY: c.svg_y,
        doctorCount: c.doctor_count ?? 0,
        venueCount: c.venue_count ?? 0,
      }));
    },
  });
}
