export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStage =
  | "new"
  | "contacted"
  | "interested"
  | "visit_scheduled"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type LeadSource =
  | "facebook"
  | "meta"
  | "tiktok"
  | "linkedin"
  | "pagina_web"
  | "inbox"
  | "mailing"
  | "wati"
  | "referido"
  | "visita_inedita"
  | "senaletica"
  | "valla"
  | "pbx"
  | "prospeccion"
  | "activacion"
  | "evento"
  | "friends_and_family"
  | "other";

export type ProjectType = "vertical" | "horizontal" | "mixed-use";

export type ProjectStatus =
  | "active"
  | "nearly_sold_out"
  | "sold_out"
  | "delivered"
  | "under_construction"
  | "frozen";

export type Currency = "GTQ" | "USD";

export type UserRole = "admin" | "editor";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          slug: string;
          project_type: ProjectType;
          currency: Currency;
          description: string | null;
          location_description: string | null;
          latitude: number | null;
          longitude: number | null;
          total_units: number;
          towers: number | null;
          floors_per_tower: number | null;
          status: ProjectStatus;
          hero_image_url: string | null;
          hero_video_url: string | null;
          logo_url: string | null;
          starting_price: number | null;
          starting_price_display: string | null;
          enganche_percent: number | null;
          reserva_amount: number | null;
          reserva_display: string | null;
          cuotas_enganche: number | null;
          max_plazo_years: number | null;
          bank_rate_display: string | null;
          special_features: string[] | null;
          bedroom_range: string | null;
          area_range_m2: string | null;
          sort_order: number;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          abbreviation: string;
          slug: string;
          project_type: ProjectType;
          currency: Currency;
          description?: string | null;
          location_description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          total_units: number;
          towers?: number | null;
          floors_per_tower?: number | null;
          status: ProjectStatus;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          logo_url?: string | null;
          starting_price?: number | null;
          starting_price_display?: string | null;
          enganche_percent?: number | null;
          reserva_amount?: number | null;
          reserva_display?: string | null;
          cuotas_enganche?: number | null;
          max_plazo_years?: number | null;
          bank_rate_display?: string | null;
          special_features?: string[] | null;
          bedroom_range?: string | null;
          area_range_m2?: string | null;
          sort_order?: number;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          abbreviation?: string;
          slug?: string;
          project_type?: ProjectType;
          currency?: Currency;
          description?: string | null;
          location_description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          total_units?: number;
          towers?: number | null;
          floors_per_tower?: number | null;
          status?: ProjectStatus;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          logo_url?: string | null;
          starting_price?: number | null;
          starting_price_display?: string | null;
          enganche_percent?: number | null;
          reserva_amount?: number | null;
          reserva_display?: string | null;
          cuotas_enganche?: number | null;
          max_plazo_years?: number | null;
          bank_rate_display?: string | null;
          special_features?: string[] | null;
          bedroom_range?: string | null;
          area_range_m2?: string | null;
          sort_order?: number;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      unit_types: {
        Row: {
          id: string;
          project_id: string;
          type_name: string;
          bedrooms: number;
          bathrooms: number | null;
          interior_area_m2: number | null;
          terrace_area_m2: number | null;
          total_area_m2: number;
          parking_spaces: number | null;
          parking_description: string | null;
          has_bodega: boolean | null;
          bodega_area_m2: number | null;
          list_price: number | null;
          price_display: string | null;
          price_currency: Currency;
          floor_plan_image_url: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type_name: string;
          bedrooms: number;
          bathrooms?: number | null;
          interior_area_m2?: number | null;
          terrace_area_m2?: number | null;
          total_area_m2: number;
          parking_spaces?: number | null;
          parking_description?: string | null;
          has_bodega?: boolean | null;
          bodega_area_m2?: number | null;
          list_price?: number | null;
          price_display?: string | null;
          price_currency: Currency;
          floor_plan_image_url?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          type_name?: string;
          bedrooms?: number;
          bathrooms?: number | null;
          interior_area_m2?: number | null;
          terrace_area_m2?: number | null;
          total_area_m2?: number;
          parking_spaces?: number | null;
          parking_description?: string | null;
          has_bodega?: boolean | null;
          bodega_area_m2?: number | null;
          list_price?: number | null;
          price_display?: string | null;
          price_currency?: Currency;
          floor_plan_image_url?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: Json;
          cover_image_url: string | null;
          category_id: string | null;
          author_name: string | null;
          is_published: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: Json;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_name?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: Json;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_name?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
        };
      };
      news_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: { id?: string; name: string; slug: string };
        Update: { name?: string; slug?: string };
      };
      news_tags: {
        Row: { id: string; name: string; slug: string };
        Insert: { id?: string; name: string; slug: string };
        Update: { name?: string; slug?: string };
      };
      news_article_tags: {
        Row: { article_id: string; tag_id: string };
        Insert: { article_id: string; tag_id: string };
        Update: { article_id?: string; tag_id?: string };
      };
      construction_progress: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          progress_percent: number | null;
          entry_date: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          progress_percent?: number | null;
          entry_date: string;
          is_published?: boolean;
        };
        Update: {
          project_id?: string;
          title?: string;
          description?: string | null;
          progress_percent?: number | null;
          entry_date?: string;
          is_published?: boolean;
        };
      };
      construction_progress_photos: {
        Row: {
          id: string;
          progress_id: string;
          photo_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          progress_id: string;
          photo_url: string;
          caption?: string | null;
          sort_order?: number;
        };
        Update: {
          photo_url?: string;
          caption?: string | null;
          sort_order?: number;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_title: string | null;
          content: string;
          rating: number | null;
          project_id: string | null;
          avatar_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_title?: string | null;
          content: string;
          rating?: number | null;
          project_id?: string | null;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
        };
        Update: {
          client_name?: string;
          client_title?: string | null;
          content?: string;
          rating?: number | null;
          project_id?: string | null;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
        };
      };
      faq_categories: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          created_at: string;
        };
        Insert: { id?: string; name: string; sort_order?: number };
        Update: { name?: string; sort_order?: number };
      };
      faqs: {
        Row: {
          id: string;
          category_id: string | null;
          question: string;
          answer: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          question: string;
          answer: string;
          is_published?: boolean;
          sort_order?: number;
        };
        Update: {
          category_id?: string | null;
          question?: string;
          answer?: string;
          is_published?: boolean;
          sort_order?: number;
        };
      };
      leads: {
        Row: {
          id: string;
          first_name: string;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          source: LeadSource;
          source_detail: string | null;
          stage: LeadStage;
          project_interest_id: string | null;
          assigned_to: string | null;
          message: string | null;
          is_newsletter_subscriber: boolean;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          source?: LeadSource;
          source_detail?: string | null;
          stage?: LeadStage;
          project_interest_id?: string | null;
          assigned_to?: string | null;
          message?: string | null;
          is_newsletter_subscriber?: boolean;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          first_name?: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          source?: LeadSource;
          source_detail?: string | null;
          stage?: LeadStage;
          project_interest_id?: string | null;
          assigned_to?: string | null;
          message?: string | null;
          is_newsletter_subscriber?: boolean;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          author_id: string;
          content: string;
        };
        Update: { content?: string };
      };
      lead_activity_log: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string | null;
          action: string;
          old_value: string | null;
          new_value: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id?: string | null;
          action: string;
          old_value?: string | null;
          new_value?: string | null;
        };
        Update: {
          action?: string;
          old_value?: string | null;
          new_value?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          is_active: boolean;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          is_active?: boolean;
          unsubscribed_at?: string | null;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_by?: string | null;
        };
        Update: {
          value?: Json;
          updated_by?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      lead_stage: LeadStage;
      lead_source: LeadSource;
    };
  };
}
