import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
export default function QueryProvider({ children }) {
    const [client] = useState(() => new QueryClient());
    return _jsx(QueryClientProvider, { client: client, children: children });
}
