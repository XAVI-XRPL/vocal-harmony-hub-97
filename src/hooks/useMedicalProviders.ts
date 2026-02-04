import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types";

interface UseMedicalProvidersOptions {
  cityId?: string;
  specialty?: string;
}

export function useMedicalProviders(options: UseMedicalProvidersOptions = {}) {
  const { cityId, specialty } = options;

  return useQuery({
    queryKey: ["medical-providers", cityId, specialty],
    queryFn: async (): Promise<Doctor[]> => {
      let query = supabase.from("medical_providers").select("*");

      if (cityId) {
        query = query.eq("city_id", cityId);
      }

      if (specialty) {
        query = query.eq("specialty", specialty as "ENT" | "Laryngologist" | "Voice Therapist" | "Vocal Coach");
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;

      return (data || []).map((d) => ({
        id: d.id,
        name: d.name,
        credentials: d.credentials,
        specialty: d.specialty as Doctor["specialty"],
        practice: d.practice,
        cityId: d.city_id,
        address: d.address,
        phone: d.phone,
        website: d.website,
        bio: d.bio,
        imageUrl: d.image_url,
        acceptsEmergency: d.accepts_emergency ?? false,
        touringArtistFriendly: d.touring_artist_friendly ?? false,
        rating: d.rating ?? undefined,
        reviewCount: d.review_count ?? undefined,
      }));
    },
  });
}
