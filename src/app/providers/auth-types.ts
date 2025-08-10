// auth-types.ts
export type AuthCtx = {
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    user: { email: string } | null;
    ready?: boolean;
};
