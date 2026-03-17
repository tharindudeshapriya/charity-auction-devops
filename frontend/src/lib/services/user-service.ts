import { apiFetch } from '../api';

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'ORGANIZER' | 'BIDDER';
}

export const userService = {
  async registerUser(user: { username: string, password: string, role: string }) {
    const payload = {
      ...user,
      role: user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`
    };
    const response = await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async updateUser(id: number, user: Partial<User>) {
    const payload = {
      ...user,
      ...(user.role ? { role: user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}` } : {})
    };
    const response = await apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiFetch('/users/me');
    return response.json();
  },

  async getTotalBidderCount(): Promise<number> {
    const response = await apiFetch('/users/count/bidders');
    return response.json();
  },

  async getMyBids(page = 0, size = 10) {
    const response = await apiFetch(`/users/me/bids?page=${page}&size=${size}`);
    return response.json();
  },

  async getAllUsers(page = 0, size = 10) {
    const response = await apiFetch(`/users?page=${page}&size=${size}`);
    return response.json();
  }
};
