export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_inventory_items: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          inventory_item_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          inventory_item_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          inventory_item_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_inventory_items_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "garden_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_inventory_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_activities: {
        Row: {
          action: string | null
          activity_order: number | null
          activity_time: string | null
          category_id: string | null
          completed: boolean | null
          created_at: string
          depth_level: number | null
          description: string | null
          has_children: boolean | null
          id: string
          outcome_log: string | null
          outcome_rating: number | null
          parent_activity_id: string | null
          priority: string | null
          scheduled_date: string
          status: string | null
          title: string
          track: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: string | null
          activity_order?: number | null
          activity_time?: string | null
          category_id?: string | null
          completed?: boolean | null
          created_at?: string
          depth_level?: number | null
          description?: string | null
          has_children?: boolean | null
          id?: string
          outcome_log?: string | null
          outcome_rating?: number | null
          parent_activity_id?: string | null
          priority?: string | null
          scheduled_date: string
          status?: string | null
          title: string
          track?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string | null
          activity_order?: number | null
          activity_time?: string | null
          category_id?: string | null
          completed?: boolean | null
          created_at?: string
          depth_level?: number | null
          description?: string | null
          has_children?: boolean | null
          id?: string
          outcome_log?: string | null
          outcome_rating?: number | null
          parent_activity_id?: string | null
          priority?: string | null
          scheduled_date?: string
          status?: string | null
          title?: string
          track?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_activities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garden_activities_parent_activity_id_fkey"
            columns: ["parent_activity_id"]
            isOneToOne: false
            referencedRelation: "garden_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garden_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_layouts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          layout_data: string
          name: string
          preview: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          layout_data: string
          name: string
          preview?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          layout_data?: string
          name?: string
          preview?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          brand: string | null
          condition: string | null
          created_at: string
          description: string | null
          expiration_date: string | null
          id: string
          name: string
          notes: string | null
          purchase_date: string | null
          quantity: number
          shelf_id: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          name: string
          notes?: string | null
          purchase_date?: string | null
          quantity?: number
          shelf_id: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          purchase_date?: string | null
          quantity?: number
          shelf_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_shelf_id_fkey"
            columns: ["shelf_id"]
            isOneToOne: false
            referencedRelation: "inventory_shelves"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_shelves: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          position: number | null
          type: Database["public"]["Enums"]["shelf_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          position?: number | null
          type: Database["public"]["Enums"]["shelf_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          position?: number | null
          type?: Database["public"]["Enums"]["shelf_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plants: {
        Row: {
          antagonists: string[] | null
          benefits: string[] | null
          companions: string[] | null
          created_at: string
          description: string | null
          growing_zones: string[] | null
          id: string
          image_url: string | null
          name: string
          planting_season: string[] | null
          scientific_name: string | null
          updated_at: string
        }
        Insert: {
          antagonists?: string[] | null
          benefits?: string[] | null
          companions?: string[] | null
          created_at?: string
          description?: string | null
          growing_zones?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          planting_season?: string[] | null
          scientific_name?: string | null
          updated_at?: string
        }
        Update: {
          antagonists?: string[] | null
          benefits?: string[] | null
          companions?: string[] | null
          created_at?: string
          description?: string | null
          growing_zones?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          planting_season?: string[] | null
          scientific_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          calendar_default_view: string
          created_at: string
          id: string
          location: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          calendar_default_view?: string
          created_at?: string
          id: string
          location?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          calendar_default_view?: string
          created_at?: string
          id?: string
          location?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      seed_calendar_uk: {
        Row: {
          created_at: string
          harvest_period: string[] | null
          id: string
          sow_indoors: string[] | null
          sow_outdoors: string[] | null
          transplant_outdoors: string[] | null
          updated_at: string
          vegetable: string
        }
        Insert: {
          created_at?: string
          harvest_period?: string[] | null
          id?: string
          sow_indoors?: string[] | null
          sow_outdoors?: string[] | null
          transplant_outdoors?: string[] | null
          updated_at?: string
          vegetable: string
        }
        Update: {
          created_at?: string
          harvest_period?: string[] | null
          id?: string
          sow_indoors?: string[] | null
          sow_outdoors?: string[] | null
          transplant_outdoors?: string[] | null
          updated_at?: string
          vegetable?: string
        }
        Relationships: []
      }
      user_seed_calendar: {
        Row: {
          created_at: string
          harvest_period: string[] | null
          id: string
          sow_indoors: string[] | null
          sow_outdoors: string[] | null
          transplant_outdoors: string[] | null
          updated_at: string
          user_id: string
          vegetable: string
        }
        Insert: {
          created_at?: string
          harvest_period?: string[] | null
          id?: string
          sow_indoors?: string[] | null
          sow_outdoors?: string[] | null
          transplant_outdoors?: string[] | null
          updated_at?: string
          user_id: string
          vegetable: string
        }
        Update: {
          created_at?: string
          harvest_period?: string[] | null
          id?: string
          sow_indoors?: string[] | null
          sow_outdoors?: string[] | null
          transplant_outdoors?: string[] | null
          updated_at?: string
          user_id?: string
          vegetable?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      shelf_type: "seeds" | "plants" | "tools"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      shelf_type: ["seeds", "plants", "tools"],
    },
  },
} as const
