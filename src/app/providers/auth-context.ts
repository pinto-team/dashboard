import { createContext } from "react";
import { AuthCtx } from "./auth-types";

export const Ctx = createContext<AuthCtx | null>(null);
