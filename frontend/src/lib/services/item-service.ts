import { apiFetch } from '../api';

export interface Item {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  currentHighestBid: number;
  auctionEndTime: string;
  status: 'ACTIVE' | 'CLOSED';
  organizerUsername: string;
  winnerId?: number;
  winnerUsername?: string;
  // UI-only properties (optional)
  category?: string;
  image?: string;
  bidCount?: number;
}

export const itemService = {
  async getItems(page = 0, size = 10): Promise<{ content: Item[], totalPages: number }> {
    const response = await apiFetch(`/items?page=${page}&size=${size}`);
    const data = await response.json();
    return data;
  },

  async getItemById(id: number | string): Promise<Item> {
    const response = await apiFetch(`/items/${id}`);
    const item = await response.json();
    return item;
  },

  async searchItems(query: string, page = 0, size = 10): Promise<{ content: Item[], totalPages: number }> {
    const response = await apiFetch(`/items/search?query=${query}&page=${page}&size=${size}`);
    const data = await response.json();
    return data;
  },

  async createItem(item: { name: string, description: string, startingPrice: number, auctionEndTime: string }) {
    const response = await apiFetch('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.json();
  },

  async updateItem(id: number, item: Partial<Item>) {
    const response = await apiFetch(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return response.json();
  },

  async placeBid(itemId: number, amount: number) {
    const response = await apiFetch(`/items/${itemId}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },

  async getWinner(itemId: number) {
    const response = await apiFetch(`/items/${itemId}/winner`);
    return response.json();
  },

  async getWonItems(page = 0, size = 10): Promise<{ content: Item[], totalPages: number }> {
    const response = await apiFetch(`/users/me/won-items?page=${page}&size=${size}`);
    const data = await response.json();
    return data;
  },

  async getItemBids(itemId: number, page = 0, size = 10) {
    const response = await apiFetch(`/items/${itemId}/bids?page=${page}&size=${size}`);
    return response.json();
  }
};
