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
      assistencias: {
        Row: {
          cadastro_completo: boolean | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          data_registro: string
          email: string
          endereco: string | null
          estado: string | null
          id: string
          mensagem_cadastro_exibida: boolean | null
          nome: string
          plano: string | null
          responsavel: string | null
          status: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cadastro_completo?: boolean | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          data_registro?: string
          email: string
          endereco?: string | null
          estado?: string | null
          id?: string
          mensagem_cadastro_exibida?: boolean | null
          nome: string
          plano?: string | null
          responsavel?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cadastro_completo?: boolean | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          data_registro?: string
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          mensagem_cadastro_exibida?: boolean | null
          nome?: string
          plano?: string | null
          responsavel?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistencias_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          assistencia_id: string
          ativo: boolean | null
          cep: string | null
          cidade: string | null
          created_at: string
          data_cadastro: string
          documento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          assistencia_id: string
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          created_at?: string
          data_cadastro?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Update: {
          assistencia_id?: string
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          created_at?: string
          data_cadastro?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_assistencia_id_fkey"
            columns: ["assistencia_id"]
            isOneToOne: false
            referencedRelation: "assistencias"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          assistencia_id: string
          chave: string
          created_at: string
          descricao: string | null
          id: string
          tipo: string | null
          updated_at: string
          valor: string | null
        }
        Insert: {
          assistencia_id: string
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string
          valor?: string | null
        }
        Update: {
          assistencia_id?: string
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_assistencia_id_fkey"
            columns: ["assistencia_id"]
            isOneToOne: false
            referencedRelation: "assistencias"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          assistencia_id: string
          categoria: string
          cliente_id: string | null
          created_at: string
          data: string
          data_pagamento: string | null
          descricao: string
          id: string
          metodo_pagamento: string | null
          observacoes: string | null
          ordem_id: string | null
          pago: boolean | null
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          assistencia_id: string
          categoria: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_pagamento?: string | null
          descricao: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          ordem_id?: string | null
          pago?: boolean | null
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          assistencia_id?: string
          categoria?: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_pagamento?: string | null
          descricao?: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          ordem_id?: string | null
          pago?: boolean | null
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_assistencia_id_fkey"
            columns: ["assistencia_id"]
            isOneToOne: false
            referencedRelation: "assistencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens"
            referencedColumns: ["id"]
          },
        ]
      }
      ordem_itens: {
        Row: {
          created_at: string
          desconto: number | null
          id: string
          ordem_id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          desconto?: number | null
          id?: string
          ordem_id: string
          preco_unitario?: number
          produto_id: string
          quantidade?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          desconto?: number | null
          id?: string
          ordem_id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordem_itens_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens: {
        Row: {
          assistencia_id: string
          cliente_id: string
          created_at: string
          data_abertura: string
          data_conclusao: string | null
          data_previsao: string | null
          descricao: string
          forma_pagamento: string | null
          id: string
          integrado_financeiro: boolean | null
          movimento_financeiro_id: string | null
          numero: string
          observacoes: string | null
          prioridade: string
          responsavel: string | null
          solucao: string | null
          status: string
          updated_at: string
          valor_total: number | null
        }
        Insert: {
          assistencia_id: string
          cliente_id: string
          created_at?: string
          data_abertura?: string
          data_conclusao?: string | null
          data_previsao?: string | null
          descricao: string
          forma_pagamento?: string | null
          id?: string
          integrado_financeiro?: boolean | null
          movimento_financeiro_id?: string | null
          numero: string
          observacoes?: string | null
          prioridade?: string
          responsavel?: string | null
          solucao?: string | null
          status?: string
          updated_at?: string
          valor_total?: number | null
        }
        Update: {
          assistencia_id?: string
          cliente_id?: string
          created_at?: string
          data_abertura?: string
          data_conclusao?: string | null
          data_previsao?: string | null
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          integrado_financeiro?: boolean | null
          movimento_financeiro_id?: string | null
          numero?: string
          observacoes?: string | null
          prioridade?: string
          responsavel?: string | null
          solucao?: string | null
          status?: string
          updated_at?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_assistencia_id_fkey"
            columns: ["assistencia_id"]
            isOneToOne: false
            referencedRelation: "assistencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          assistencia_id: string
          ativo: boolean | null
          categoria: string | null
          codigo: string | null
          created_at: string
          custo: number | null
          descricao: string | null
          estoque: number | null
          estoque_minimo: number | null
          id: string
          marca: string | null
          nome: string
          preco: number
          tipo: string
          unidade: string | null
          updated_at: string
        }
        Insert: {
          assistencia_id: string
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          custo?: number | null
          descricao?: string | null
          estoque?: number | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome: string
          preco?: number
          tipo?: string
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          assistencia_id?: string
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          custo?: number | null
          descricao?: string | null
          estoque?: number | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome?: string
          preco?: number
          tipo?: string
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_assistencia_id_fkey"
            columns: ["assistencia_id"]
            isOneToOne: false
            referencedRelation: "assistencias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          data_vencimento_plano: string | null
          email: string
          empresa: string | null
          id: string
          nome: string
          plano_id: string | null
          status_plano: string | null
          stripe_customer_id: string | null
          telefone: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          data_vencimento_plano?: string | null
          email: string
          empresa?: string | null
          id: string
          nome: string
          plano_id?: string | null
          status_plano?: string | null
          stripe_customer_id?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          data_vencimento_plano?: string | null
          email?: string
          empresa?: string | null
          id?: string
          nome?: string
          plano_id?: string | null
          status_plano?: string | null
          stripe_customer_id?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_assistencia_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
