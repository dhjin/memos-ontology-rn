import client from './client';
import { Memo } from '../types';

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await client.post('/login', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  // Flask login redirects on success (302) or returns HTML — treat non-401/403 as success
  return response;
};

export const getMemos = async (): Promise<Memo[]> => {
  const response = await client.get('/api/v1/memos');
  return response.data.memos ?? [];
};

export const saveMemo = async (memo: Partial<Memo>) => {
  const response = await client.post('/api/v1/save', memo, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const deleteMemo = async (id: string) => {
  const response = await client.delete(`/api/v1/delete/${id}`);
  return response.data;
};

export const nlQuery = async (query: string) => {
  const params = new URLSearchParams();
  params.append('nl_query', query);
  const response = await client.post('/nl_query', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const sparqlDirect = async (query: string) => {
  // The sparql_direct endpoint on the memos server handles Fuseki internally.
  // fusekiUrl is managed server-side; we do NOT forward it from the client
  // to avoid SSRF exposure.
  const params = new URLSearchParams();
  params.append('sparql_query', query);
  const response = await client.post('/sparql_direct', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};
