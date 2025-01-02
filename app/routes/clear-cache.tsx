import { json } from "@remix-run/node";

let cache: Record<string, any> = {}; // Cache object to clear

export let loader = async ({ request }: any) => {
    // Clear cache
    cache = {};

    // Return a response, perhaps a redirect to a clean page or a success message
    return json({ message: "Cache cleared successfully!" });
};
