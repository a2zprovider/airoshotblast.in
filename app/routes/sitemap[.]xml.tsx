import { LoaderFunction } from "@remix-run/node";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const baseUrl = `https://${url.host}`;

    // Static pages you want to include in the sitemap
    const staticPages = [
        { slug: "" }, // Homepage
        { slug: "about-us" },
        { slug: "products" },
        { slug: "blogs" },
        { slug: "careers" },
        { slug: "contact" },
        { slug: "videos" },
        { slug: "faqs" },
    ];

    // Fetch API data
    const category = await fetch(config.apiBaseURL + 'category');
    const categories = await category.json();

    const blogcategory = await fetch(config.apiBaseURL + 'blogcategory');
    const blogcategories = await blogcategory.json();

    const blog = await fetch(config.apiBaseURL + 'blogs');
    const blogs = await blog.json();

    const product = await fetch(config.apiBaseURL + 'products');
    const products = await product.json();

    const tag = await fetch(config.apiBaseURL + 'tags');
    const tags = await tag.json();

    const career = await fetch(config.apiBaseURL + 'careers');
    const careers = await career.json();

    const page = await fetch(config.apiBaseURL + 'pages?parent=null');
    const pages = await page.json();

    // Combine all pages and add createdAt for each entry
    const allPages = [
        ...staticPages,
        ...categories.data.data.map((cat: any) => ({
            slug: `category/${cat.slug}`, // Categories
            createdAt: cat.createdAt, // Assuming createdAt exists in the category response
        })),
        ...blogs.data.data.map((blog: any) => ({
            slug: `blog/${blog.slug}`, // Blogs
            createdAt: blog.createdAt, // Assuming createdAt exists in the blog response
        })),
        ...products.data.data.map((product: any) => ({
            slug: `product/${product.slug}`, // Products
            createdAt: product.createdAt, // Assuming createdAt exists in the product response
        })),
        ...blogcategories.data.data.map((bcat: any) => ({
            slug: `blog-category/${bcat.slug}`, // Blog Categories
            createdAt: bcat.createdAt, // Assuming createdAt exists in the blog category response
        })),
        ...careers.data.data.map((career: any) => ({
            slug: `career/${career.slug}`, // Careers
            createdAt: career.createdAt, // Assuming createdAt exists in the career response
        })),
        ...tags.data.data.map((tag: any) => ({
            slug: `tag/${tag.slug}`, // Tags
            createdAt: tag.createdAt, // Assuming createdAt exists in the tag response
        })),
        ...pages.data.data.filter((page: any) => page.slug !== 'about-us').map((page: any) => ({
            slug: `page/${page.slug}`, // Pages
            createdAt: page.createdAt, // Assuming createdAt exists in the page response
        })),
    ];

    // Generate the XML for the sitemap
    const sitemapUrls = allPages
        .map((p) => {
            const lastmod = p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(); // Use createdAt or fallback to current date
            return `<url>
        <loc>${baseUrl}/${p.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>1.0</priority>
      </url>`;
        })
        .join("\n");

    // Return the sitemap XML as a response
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapUrls}
  </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
