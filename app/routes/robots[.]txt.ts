import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const baseUrl = `https://www.${url.host}`;

    const robotsContent = `
    User-agent: *
    Allow: /
    Sitemap: ${baseUrl}/sitemap.xml`;

    return new Response(robotsContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};
