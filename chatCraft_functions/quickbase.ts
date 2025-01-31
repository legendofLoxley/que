/**
 * Interact with Quickbase apps API to perform CRUD operations on applications.
 * Provides functionality to create, read, update, and delete Quickbase applications through the REST API.
 * Handles authentication, request validation, and proper error handling for all operations.
 * 
 * @param params Configuration parameters for the Quickbase API operation
 * @param params.realmHostname Your Quickbase domain (e.g., demo.quickbase.com)
 * @param params.authToken QB-USER-TOKEN for authentication
 * @param params.operation The operation to perform (create/get/update/delete)
 * @param params.appId The unique identifier of the app (required for get/update/delete)
 * @param params.name The name of the app (required for create, optional for update)
 * @param params.description Optional description for the app
 * @param params.assignToken Whether to assign the app to the user token (create only)
 * @param params.variables Optional app variables (max 10)
 * @param params.securityProperties Optional security settings for the app
 * @returns Promise<QuickbaseAppResponse> The API response containing app details
 * 
 * @example
 * // Create a new app
 * const result = await quickbaseApp({
 *   realmHostname: 'demo.quickbase.com',
 *   authToken: 'your_token',
 *   operation: 'create',
 *   name: 'My New App',
 *   description: 'App description'
 * });
 * 
 * @example
 * // Get an existing app
 * const app = await quickbaseApp({
 *   realmHostname: 'demo.quickbase.com',
 *   authToken: 'your_token',
 *   operation: 'get',
 *   appId: 'bqwriv8bw'
 * });
 */
export async function quickbaseApp(params: QuickbaseAppParams): Promise<QuickbaseAppResponse> {
  const {
    realmHostname,
    authToken,
    operation,
    appId,
    name,
    description,
    assignToken,
    variables,
    securityProperties,
  } = params;

  // Validate required parameters
  if (!realmHostname) {
    throw new Error('realmHostname is required');
  }
  if (!authToken) {
    throw new Error('authToken is required');
  }
  if (!operation) {
    throw new Error('operation is required');
  }

  // Common headers for all requests
  const headers = {
    'QB-Realm-Hostname': realmHostname,
    'Authorization': `QB-USER-TOKEN ${authToken}`,
    'User-Agent': 'Chatcraft-Quickbase-Integration',
    'Content-Type': 'application/json',
  };

  // Base URL for the Quickbase API
  const baseUrl = 'https://api.quickbase.com/v1';

  try {
    switch (operation) {
      case 'create': {
        if (!name) {
          throw new Error('name is required for create operation');
        }

        const response = await fetch(`${baseUrl}/apps`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name,
            description,
            assignToken,
            variables,
            securityProperties,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create app: ${response.status} ${await response.text()}`);
        }

        return await response.json();
      }

      case 'get': {
        if (!appId) {
          throw new Error('appId is required for get operation');
        }

        const response = await fetch(`${baseUrl}/apps/${appId}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to get app: ${response.status} ${await response.text()}`);
        }

        return await response.json();
      }

      case 'update': {
        if (!appId) {
          throw new Error('appId is required for update operation');
        }

        const response = await fetch(`${baseUrl}/apps/${appId}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name,
            description,
            variables,
            securityProperties,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update app: ${response.status} ${await response.text()}`);
        }

        return await response.json();
      }

      case 'delete': {
        if (!appId) {
          throw new Error('appId is required for delete operation');
        }
        if (!name) {
          throw new Error('name is required for delete operation to confirm deletion');
        }

        const response = await fetch(`${baseUrl}/apps/${appId}`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error(`Failed to delete app: ${response.status} ${await response.text()}`);
        }

        return {
          name,
          id: appId,
        };
      }

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    // Enhance error message with more context
    if (error instanceof Error) {
      throw new Error(`Quickbase API Error: ${error.message}`);
    }
    throw error;
  }
}
