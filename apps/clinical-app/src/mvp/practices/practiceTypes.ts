export type Brand = {
  systemName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  color: string;
};

export type TemplateDefinition = {
  heading: string;
  body: string;
  footer: string;
  layout: 'STANDARD' | 'COMPACT';
  includeAddress: boolean;
};

export type PracticeSettings = {
  id: string;
  name: string;
  version: number;
  branding: Partial<Brand>;
  subscription: {
    plan: string;
    state: string;
    effectiveState: string;
    version: number;
    seatLimit: number;
  };
  members: {
    userId: string;
    role: string;
    active: boolean;
    version: number;
    user: { username: string; name: string };
  }[];
};

export type PracticeTemplate = {
  kind: string;
  definition: TemplateDefinition;
  version: number;
  publishedVersion: number | null;
};
