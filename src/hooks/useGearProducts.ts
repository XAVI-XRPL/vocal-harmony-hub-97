import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GearProduct, GearCategory } from "@/types";

interface UseGearProductsOptions {
  category?: GearCategory | "all";
  featured?: boolean;
}

export function useGearProducts(options: UseGearProductsOptions = {}) {
  const { category = "all", featured } = options;

  return useQuery({
    queryKey: ["gear-products", category, featured],
    queryFn: async (): Promise<GearProduct[]> => {
      let query = supabase.from("gear_products").select("*");

      if (category !== "all") {
        query = query.eq("category", category);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      const { data, error } = await query.order("is_featured", { ascending: false });

      if (error) throw error;

      return (data || []).map((g) => ({
        id: g.id,
        name: g.name,
        brandId: g.brand_id,
        category: g.category as GearCategory,
        description: g.description,
        price: g.price,
        imageUrl: g.image_url,
        affiliateUrl: g.affiliate_url,
        isFeatured: g.is_featured ?? false,
        specs: g.specs as Record<string, string> | undefined,
      }));
    },
  });
}

export function useFeaturedGear() {
  return useGearProducts({ featured: true });
}
