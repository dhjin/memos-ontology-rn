import client from './client';
import { Memo, EpistemicStatus } from '../types';

function userFriendlyError(e: unknown): string {
  if (e instanceof Error && 'isAxiosError' in e) {
    const axiosErr = e as any;
    if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
      return 'Authentication failed. Please log in again.';
    }
    if (axiosErr.response?.status >= 500) {
      return 'Server error. Please try again later.';
    }
    if (axiosErr.code === 'ECONNREFUSED' || axiosErr.code === 'ERR_NETWORK') {
      return 'Cannot connect to server. Check your server URL in settings.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

export const memosApi = {
  async login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return client.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },

  async logout() {
    try {
      await client.post('/logout');
    } catch {
      // Ignore logout errors — clear local state regardless
    }
  },

  async getMemos(): Promise<Memo[]> {
    const response = await client.get('/api/v1/memos');
    return response.data;
  },

  async getMemo(id: string): Promise<Memo | null> {
    const response = await client.get(`/api/v1/memos/${id}`);
    return response.data?.memo || null;
  },

  async saveMemo(title: string, content: string, epistemicStatus: EpistemicStatus, id?: string) {
    return client.post('/api/v1/save', { title, content, epistemic_status: epistemicStatus, id });
  },

  async searchMemos(query: string): Promise<Memo[]> {
    const response = await client.post('/api/v1/search', { query });
    return response.data;
  },

  async deleteMemo(id: string) {
    return client.delete(`/api/v1/delete/${id}`);
  },

  async nlQuery(question: string) {
    const params = new URLSearchParams();
    params.append('query', question);
    const response = await client.post('/nl_query', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  userFriendlyError,
};
