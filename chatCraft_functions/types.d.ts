interface QuickbaseAppParams {
  realmHostname: string;
  authToken: string;
  operation: 'create' | 'get' | 'update' | 'delete';
  appId?: string;
  name?: string;
  description?: string;
  assignToken?: boolean;
  variables?: Array<{
    name: string;
    value: string;
  }>;
  securityProperties?: {
    hideFromPublic?: boolean;
    mustBeRealmApproved?: boolean;
    allowClone?: boolean;
    useIPFilter?: boolean;
    allowExport?: boolean;
    enableAppTokens?: boolean;
  };
}

interface QuickbaseAppResponse {
  id?: string;
  name: string;
  description?: string;
  created?: string;
  updated?: string;
  dateFormat?: string;
  timeZone?: string;
  variables?: Array<{
    name: string;
    value: string;
  }>;
  hasEveryoneOnTheInternet?: boolean;
  dataClassification?: string;
  securityProperties?: {
    allowClone: boolean;
    allowExport: boolean;
    hideFromPublic: boolean;
    enableAppTokens: boolean;
    useIPFilter: boolean;
    mustBeRealmApproved: boolean;
  };
}
