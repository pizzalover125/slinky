import type { Customization } from "@/lib/types";

/**
 * Hand-maintained mirror of supabase/migrations. Regenerate with
 * `supabase gen types typescript` once the schema starts moving.
 *
 * These are `type` aliases, not interfaces, on purpose: postgrest-js
 * constrains every table's Row/Insert/Update to `Record<string, unknown>`,
 * and only type aliases get TypeScript's implicit index signature. Declared
 * as interfaces the constraint fails, the schema silently resolves to
 * `never`, and every query result degrades to `never` with no clear error.
 */

export type PageRow = {
  id: string;
  user_id: string;
  username: string;
  theme_id: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  customization: Customization;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkRow = {
  id: string;
  page_id: string;
  title: string;
  url: string;
  active: boolean;
  position: number;
  click_count: number;
  created_at: string;
};

/**
 * Shaped to match what `supabase gen types typescript` emits — the client's
 * generics look for `Relationships` and the `graphql_public`/`__InternalSupabase`
 * markers, and silently resolve rows to `never` without them.
 */
export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      pages: {
        Row: PageRow;
        Insert: Omit<PageRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PageRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      links: {
        Row: LinkRow;
        Insert: Omit<LinkRow, "id" | "created_at" | "click_count"> & {
          id?: string;
          created_at?: string;
          click_count?: number;
        };
        Update: Partial<Omit<LinkRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      increment_link_click: {
        Args: { link_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
