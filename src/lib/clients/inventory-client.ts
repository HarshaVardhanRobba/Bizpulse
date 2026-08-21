import { apiClient } from "@/lib/api-client";

export interface Sku {
  id: number;
  tenantId: number | null;
  name: string;
  skuCode: string;
  quantity: number;
  reorderThreshold: number;
  createdAt: string;
}

export interface CreateSkuInput {
  tenantId?: number | null;
  name: string;
  skuCode: string;
  quantity?: number;
  reorderThreshold?: number;
}

export const inventoryClient = {
  createSku: (input: CreateSkuInput) => apiClient.post<Sku>("/inventory/sku", input),
  listSkus: () => apiClient.get<Sku[]>("/inventory/sku"),
  getSku: (id: number) => apiClient.get<Sku>(`/inventory/sku/${id}`),
  adjustStock: (id: number, delta: number) =>
    apiClient.patch<Sku>(`/inventory/sku/${id}/adjust`, { delta }),
};
