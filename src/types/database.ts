export type ContentType =
  | "photo"
  | "audio"
  | "note"
  | "memory"
  | "capsule"
  | "song";

export interface Group {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  group_id: string;
  name: string;
  country: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  flag_emoji: string | null;
  edit_token: string;
  created_at: string;
}

export type PublicProfile = Omit<Profile, "edit_token">;

export interface ProfileContent {
  id: string;
  profile_id: string;
  type: ContentType;
  content_text: string | null;
  file_path: string | null;
  unlock_at: string | null;
  created_at: string;
}

export type ProfileUpdatePayload = Pick<
  Profile,
  "name" | "country" | "city" | "lat" | "lng" | "flag_emoji"
>;

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: Group;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          country?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          flag_emoji?: string | null;
          edit_token?: string;
          created_at?: string;
        };
        Update: {
          group_id?: string;
          name?: string;
          country?: string | null;
          city?: string | null;
          lat?: number | null;
          lng?: number | null;
          flag_emoji?: string | null;
          edit_token?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_content: {
        Row: ProfileContent;
        Insert: {
          id?: string;
          profile_id: string;
          type: ContentType;
          content_text?: string | null;
          file_path?: string | null;
          unlock_at?: string | null;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          type?: ContentType;
          content_text?: string | null;
          file_path?: string | null;
          unlock_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_content_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      content_type: ContentType;
    };
    CompositeTypes: Record<string, never>;
  };
}
