import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PartnerBrand } from "@/types";

export function usePartnerBrands() {
  return useQuery({
    queryKey: ["partner-brands"],
    queryFn: async (): Promise<PartnerBrand[]> => {
      const { data, error } = await supabase
        .from("partner_brands")
        .select("*")
        .order("name");

      if (error) throw error;

      return (data || []).map((b) => ({
        id: b.id,
        name: b.name,
        logoUrl: b.logo_url,
        description: b.description,
        discountCode: b.discount_code,
        discountPercent: b.discount_percent ?? undefined,
        websiteUrl: b.website_url,
      }));
    },
  });
}
