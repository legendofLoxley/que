import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quickbaseApp } from './quickbase';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('quickbaseApp', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('creates an app successfully', async () => {
    const mockResponse = {
      id: 'bpqe82s1',
      name: 'Test App',
      description: 'Test Description',
      created: '2020-03-27T18:34:12Z',
      updated: '2020-04-03T19:12:20Z',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'create',
      name: 'Test App',
      description: 'Test Description',
    });

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.quickbase.com/v1/apps',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'QB-Realm-Hostname': 'demo.quickbase.com',
          'Authorization': 'QB-USER-TOKEN test_token',
          'User-Agent': 'Chatcraft-Quickbase-Integration',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('gets an app successfully', async () => {
    const mockResponse = {
      id: 'bpqe82s1',
      name: 'Test App',
      description: 'Test Description',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'get',
      appId: 'bpqe82s1',
    });

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.quickbase.com/v1/apps/bpqe82s1',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'QB-Realm-Hostname': 'demo.quickbase.com',
          'Authorization': 'QB-USER-TOKEN test_token',
          'User-Agent': 'Chatcraft-Quickbase-Integration',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('updates an app successfully', async () => {
    const mockResponse = {
      id: 'bpqe82s1',
      name: 'Updated App',
      description: 'Updated Description',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'update',
      appId: 'bpqe82s1',
      name: 'Updated App',
      description: 'Updated Description',
    });

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.quickbase.com/v1/apps/bpqe82s1',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'QB-Realm-Hostname': 'demo.quickbase.com',
          'Authorization': 'QB-USER-TOKEN test_token',
          'User-Agent': 'Chatcraft-Quickbase-Integration',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('deletes an app successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'bpqe82s1' }),
    });

    const result = await quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'delete',
      appId: 'bpqe82s1',
      name: 'App to Delete',
    });

    expect(result).toEqual({
      name: 'App to Delete',
      id: 'bpqe82s1',
    });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.quickbase.com/v1/apps/bpqe82s1',
      expect.objectContaining({
        method: 'DELETE',
        headers: {
          'QB-Realm-Hostname': 'demo.quickbase.com',
          'Authorization': 'QB-USER-TOKEN test_token',
          'User-Agent': 'Chatcraft-Quickbase-Integration',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('throws error when required parameters are missing', async () => {
    await expect(quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'create',
      // Missing required 'name' parameter
    })).rejects.toThrow('name is required for create operation');
  });

  it('throws error when API request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    await expect(quickbaseApp({
      realmHostname: 'demo.quickbase.com',
      authToken: 'test_token',
      operation: 'create',
      name: 'Test App',
    })).rejects.toThrow('Quickbase API Error: Failed to create app: 400 Bad Request');
  });
});
