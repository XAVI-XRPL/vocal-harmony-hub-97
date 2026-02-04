import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistItem } from "@/types";

export function useChecklistItems() {
  return useQuery({
    queryKey: ["checklist-items"],
    queryFn: async (): Promise<ChecklistItem[]> => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .order("item_order");

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        label: item.label,
        category: item.category as ChecklistItem["category"],
        description: item.description,
        order: item.item_order,
      }));
    },
  });
}
