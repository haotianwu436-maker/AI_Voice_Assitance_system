export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: "admin" | "sales";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          role?: "admin" | "sales";
        };
        Update: {
          name?: string;
          role?: "admin" | "sales";
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          name: string | null;
          note: string | null;
          status: Database["public"]["Enums"]["customer_status"];
          assigned_to: string | null;
          wechat_added: boolean;
          interested: boolean;
          created_at: string;
          updated_at: string;
          phone_normalized: string;
        };
        Insert: {
          phone: string;
          name?: string | null;
          note?: string | null;
          status?: Database["public"]["Enums"]["customer_status"];
          assigned_to?: string | null;
          wechat_added?: boolean;
          interested?: boolean;
        };
        Update: {
          phone?: string;
          name?: string | null;
          note?: string | null;
          status?: Database["public"]["Enums"]["customer_status"];
          assigned_to?: string | null;
          wechat_added?: boolean;
          interested?: boolean;
          updated_at?: string;
        };
      };
      call_logs: {
        Row: {
          id: string;
          customer_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["customer_status"];
          remark: string | null;
          created_at: string;
        };
        Insert: {
          customer_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["customer_status"];
          remark?: string | null;
        };
        Update: {
          status?: Database["public"]["Enums"]["customer_status"];
          remark?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "admin" | "sales";
      customer_status: "未拨打" | "未接通" | "已接通" | "已加微信" | "有意向" | "无意向";
    };
    CompositeTypes: Record<string, never>;
  };
};
