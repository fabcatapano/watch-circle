export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      movies: {
        Row: {
          id: string;
          tmdb_id: number;
          media_type: "movie" | "tv";
          title: string;
          overview: string | null;
          poster_path: string | null;
          backdrop_path: string | null;
          release_date: string | null;
          vote_average: number | null;
          genres: string[] | null;
          runtime: number | null;
          number_of_seasons: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tmdb_id: number;
          media_type: "movie" | "tv";
          title: string;
          overview?: string | null;
          poster_path?: string | null;
          backdrop_path?: string | null;
          release_date?: string | null;
          vote_average?: number | null;
          genres?: string[] | null;
          runtime?: number | null;
          number_of_seasons?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tmdb_id?: number;
          media_type?: "movie" | "tv";
          title?: string;
          overview?: string | null;
          poster_path?: string | null;
          backdrop_path?: string | null;
          release_date?: string | null;
          vote_average?: number | null;
          genres?: string[] | null;
          runtime?: number | null;
          number_of_seasons?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          score: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          score: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          score?: number;
          comment?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ratings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ratings_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
        ];
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: "pending" | "accepted" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "accepted" | "rejected";
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_addressee_id_fkey";
            columns: ["addressee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
        ];
      };
      episodes: {
        Row: {
          id: string;
          movie_id: string;
          season_number: number;
          episode_number: number;
          name: string | null;
          overview: string | null;
          air_date: string | null;
          still_path: string | null;
          runtime: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: string;
          season_number: number;
          episode_number: number;
          name?: string | null;
          overview?: string | null;
          air_date?: string | null;
          still_path?: string | null;
          runtime?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          overview?: string | null;
          air_date?: string | null;
          still_path?: string | null;
          runtime?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "friend_request" | "friend_accepted" | "new_episode" | "new_rating";
          title: string;
          body: string | null;
          data: Json;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "friend_request" | "friend_accepted" | "new_episode" | "new_rating";
          title: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      are_friends: {
        Args: { user_a: string; user_b: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
