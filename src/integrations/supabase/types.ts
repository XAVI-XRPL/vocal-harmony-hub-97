export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      checklist_items: {
        Row: {
          category: Database["public"]["Enums"]["checklist_category"]
          created_at: string
          description: string
          id: string
          item_order: number
          label: string
        }
        Insert: {
          category: Database["public"]["Enums"]["checklist_category"]
          created_at?: string
          description: string
          id: string
          item_order: number
          label: string
        }
        Update: {
          category?: Database["public"]["Enums"]["checklist_category"]
          created_at?: string
          description?: string
          id?: string
          item_order?: number
          label?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          abbreviation: string
          created_at: string
          doctor_count: number | null
          id: string
          name: string
          state: string
          svg_x: number
          svg_y: number
          venue_count: number | null
        }
        Insert: {
          abbreviation: string
          created_at?: string
          doctor_count?: number | null
          id: string
          name: string
          state: string
          svg_x: number
          svg_y: number
          venue_count?: number | null
        }
        Update: {
          abbreviation?: string
          created_at?: string
          doctor_count?: number | null
          id?: string
          name?: string
          state?: string
          svg_x?: number
          svg_y?: number
          venue_count?: number | null
        }
        Relationships: []
      }
      gear_products: {
        Row: {
          affiliate_url: string
          brand_id: string
          category: Database["public"]["Enums"]["gear_category"]
          created_at: string
          description: string
          id: string
          image_url: string
          is_featured: boolean | null
          name: string
          price: number
          specs: Json | null
        }
        Insert: {
          affiliate_url: string
          brand_id: string
          category: Database["public"]["Enums"]["gear_category"]
          created_at?: string
          description: string
          id: string
          image_url: string
          is_featured?: boolean | null
          name: string
          price: number
          specs?: Json | null
        }
        Update: {
          affiliate_url?: string
          brand_id?: string
          category?: Database["public"]["Enums"]["gear_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_featured?: boolean | null
          name?: string
          price?: number
          specs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gear_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "partner_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_providers: {
        Row: {
          accepts_emergency: boolean | null
          address: string
          bio: string
          city_id: string
          created_at: string
          credentials: string
          id: string
          image_url: string
          name: string
          phone: string
          practice: string
          rating: number | null
          review_count: number | null
          specialty: Database["public"]["Enums"]["doctor_specialty"]
          touring_artist_friendly: boolean | null
          website: string
        }
        Insert: {
          accepts_emergency?: boolean | null
          address: string
          bio: string
          city_id: string
          created_at?: string
          credentials: string
          id: string
          image_url: string
          name: string
          phone: string
          practice: string
          rating?: number | null
          review_count?: number | null
          specialty: Database["public"]["Enums"]["doctor_specialty"]
          touring_artist_friendly?: boolean | null
          website: string
        }
        Update: {
          accepts_emergency?: boolean | null
          address?: string
          bio?: string
          city_id?: string
          created_at?: string
          credentials?: string
          id?: string
          image_url?: string
          name?: string
          phone?: string
          practice?: string
          rating?: number | null
          review_count?: number | null
          specialty?: Database["public"]["Enums"]["doctor_specialty"]
          touring_artist_friendly?: boolean | null
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_providers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_brands: {
        Row: {
          created_at: string
          description: string
          discount_code: string
          discount_percent: number | null
          id: string
          logo_url: string
          name: string
          website_url: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_code: string
          discount_percent?: number | null
          id: string
          logo_url: string
          name: string
          website_url: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_code?: string
          discount_percent?: number | null
          id?: string
          logo_url?: string
          name?: string
          website_url?: string
        }
        Relationships: []
      }
      playlist_songs: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          position: number
          song_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          position?: number
          song_id: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          position?: number
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          loops_practiced: number | null
          song_id: string
          started_at: string
          tempo_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          loops_practiced?: number | null
          song_id: string
          started_at?: string
          tempo_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          loops_practiced?: number | null
          song_id?: string
          started_at?: string
          tempo_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_url: string
          brand: string
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string
          discount_code: string | null
          id: string
          image_url: string
          is_coming_soon: boolean | null
          is_featured: boolean | null
          is_partner_brand: boolean | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          tags: string[] | null
        }
        Insert: {
          affiliate_url: string
          brand: string
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description: string
          discount_code?: string | null
          id: string
          image_url: string
          is_coming_soon?: boolean | null
          is_featured?: boolean | null
          is_partner_brand?: boolean | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
        }
        Update: {
          affiliate_url?: string
          brand?: string
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string
          discount_code?: string | null
          id?: string
          image_url?: string
          is_coming_soon?: boolean | null
          is_featured?: boolean | null
          is_partner_brand?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      songs: {
        Row: {
          artist: string
          bpm: number | null
          cover_art: string
          created_at: string
          difficulty: string
          duration: number
          full_mix_url: string | null
          genre: string
          id: string
          is_premium: boolean
          key: string | null
          title: string
        }
        Insert: {
          artist: string
          bpm?: number | null
          cover_art: string
          created_at?: string
          difficulty: string
          duration: number
          full_mix_url?: string | null
          genre: string
          id: string
          is_premium?: boolean
          key?: string | null
          title: string
        }
        Update: {
          artist?: string
          bpm?: number | null
          cover_art?: string
          created_at?: string
          difficulty?: string
          duration?: number
          full_mix_url?: string | null
          genre?: string
          id?: string
          is_premium?: boolean
          key?: string | null
          title?: string
        }
        Relationships: []
      }
      stems: {
        Row: {
          audio_path: string
          color: string
          created_at: string
          id: string
          name: string
          position: number
          song_id: string
          type: string
        }
        Insert: {
          audio_path: string
          color: string
          created_at?: string
          id: string
          name: string
          position?: number
          song_id: string
          type: string
        }
        Update: {
          audio_path?: string
          color?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          song_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stems_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_checklist_progress: {
        Row: {
          checked_at: string | null
          checklist_item_id: string
          created_at: string
          id: string
          is_checked: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          checklist_item_id: string
          created_at?: string
          id?: string
          is_checked?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_at?: string | null
          checklist_item_id?: string
          created_at?: string
          id?: string
          is_checked?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checklist_progress_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_checklist_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_song_progress: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          last_practiced_at: string | null
          song_id: string
          times_practiced: number | null
          total_practice_time: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          last_practiced_at?: string | null
          song_id: string
          times_practiced?: number | null
          total_practice_time?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          last_practiced_at?: string | null
          song_id?: string
          times_practiced?: number | null
          total_practice_time?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_song_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          capacity: number
          city_id: string
          created_at: string
          id: string
          image_url: string
          name: string
          type: Database["public"]["Enums"]["venue_type"]
        }
        Insert: {
          address: string
          capacity: number
          city_id: string
          created_at?: string
          id: string
          image_url: string
          name: string
          type: Database["public"]["Enums"]["venue_type"]
        }
        Update: {
          address?: string
          capacity?: number
          city_id?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          type?: Database["public"]["Enums"]["venue_type"]
        }
        Relationships: [
          {
            foreignKeyName: "venues_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_premium_access: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      checklist_category: "vocal" | "gear" | "mental" | "physical"
      doctor_specialty:
        | "ENT"
        | "Laryngologist"
        | "Voice Therapist"
        | "Vocal Coach"
      gear_category:
        | "iem"
        | "microphone"
        | "in-ear-monitor"
        | "cable"
        | "case"
        | "accessories"
      product_category:
        | "throat-care"
        | "hydration"
        | "vitamins"
        | "accessories"
        | "apparel"
        | "essential-oils"
        | "tea-honey"
        | "nasal-sinus"
        | "allergy-wellness"
      venue_type: "arena" | "stadium" | "theater" | "club"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      checklist_category: ["vocal", "gear", "mental", "physical"],
      doctor_specialty: [
        "ENT",
        "Laryngologist",
        "Voice Therapist",
        "Vocal Coach",
      ],
      gear_category: [
        "iem",
        "microphone",
        "in-ear-monitor",
        "cable",
        "case",
        "accessories",
      ],
      product_category: [
        "throat-care",
        "hydration",
        "vitamins",
        "accessories",
        "apparel",
        "essential-oils",
        "tea-honey",
        "nasal-sinus",
        "allergy-wellness",
      ],
      venue_type: ["arena", "stadium", "theater", "club"],
    },
  },
} as const
