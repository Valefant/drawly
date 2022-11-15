export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      selected_categories: {
        Row: {
          category: string | null;
          created_at: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      v_selected_categories: {
        Row: {
          category: string | null;
          created_at: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
