import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-dvh grid place-items-center p-6 text-center">
            <div>
                <h1 className="text-3xl font-bold mb-2">404</h1>
                <p className="text-muted-foreground mb-4">Page not found.</p>
                <Link to="/" className="inline-block rounded-md border px-3 py-2 hover:bg-muted/50">Go Home</Link>
            </div>
        </div>
    );
}
