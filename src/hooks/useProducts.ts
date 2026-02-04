import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory } from "@/types";

interface UseProductsOptions {
  category?: ProductCategory | "all";
  featured?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category = "all", featured } = options;

  return useQuery({
    queryKey: ["products", category, featured],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase.from("products").select("*");

      if (category !== "all") {
        query = query.eq("category", category);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      const { data, error } = await query.order("is_featured", { ascending: false });

      if (error) throw error;

      return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: p.price,
        category: p.category as ProductCategory,
        imageUrl: p.image_url,
        affiliateUrl: p.affiliate_url,
        rating: p.rating ?? undefined,
        reviewCount: p.review_count ?? undefined,
        isFeatured: p.is_featured ?? false,
        tags: p.tags ?? undefined,
        discountCode: p.discount_code ?? undefined,
        isComingSoon: p.is_coming_soon ?? false,
        isPartnerBrand: p.is_partner_brand ?? false,
      }));
    },
  });
}

export function useFeaturedProducts() {
  return useProducts({ featured: true });
}
