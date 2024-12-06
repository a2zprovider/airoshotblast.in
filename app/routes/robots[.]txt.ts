import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    // const robotsContent = `
    // User-agent: *
    // Disallow: /
    // Sitemap: ${process.env.SITE_URL || 'https://example.com'}/sitemap.xml`;
    const robotsContent = `
    User-agent: *
    Disallow: /`;

    return new Response(robotsContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};
