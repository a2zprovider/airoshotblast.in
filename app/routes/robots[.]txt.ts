import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // const robotsContent = `
    // User-agent: *
    // Allow: /
    // Sitemap: ${baseUrl}/sitemap.xml`;
    const robotsContent = `
    User-agent: *
    Disallow: /`;

    return new Response(robotsContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};
