import { LoaderFunction } from "@remix-run/node";
import config from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const baseUrl = `https://${url.host}`;

    // Static pages you want to include in the sitemap
    const staticPages = [
        { slug: "", title: "Homepage", description: "Welcome to our homepage." }, // Homepage
        { slug: "about-us", title: "About Us", description: "Learn more about our company." },
        { slug: "products", title: "Our Products", description: "Explore our wide range of products." },
        { slug: "blogs", title: "Blogs", description: "Read our latest blog posts." },
        { slug: "careers", title: "Careers", description: "Join our team." },
        { slug: "contact", title: "Contact Us", description: "Get in touch with us." },
        { slug: "videos", title: "Videos", description: "Watch our latest videos." },
        { slug: "faqs", title: "FAQs", description: "Frequently asked questions." },
    ];

    // Fetch data from your API or data sources
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

    // Combine all pages and image data
    const allPages = [
        ...staticPages,
        ...categories.data.data.map((cat: any) => ({
            slug: `category/${cat.slug}`,
            image: `${cat.image}`,
            title: cat.title || "Category",
            description: cat.description || "Category description",
        })),
        ...blogs.data.data.map((blog: any) => ({
            slug: `blog/${blog.slug}`,
            image: `${blog.image}`,
            title: blog.title || "Blog Post",
            description: blog.description || "Blog post description",
        })),
        ...products.data.data.map((product: any) => ({
            slug: `product/${product.slug}`,
            image: `${product.image}`,
            title: product.title || "Product",
            description: product.description || "Product description",
        })),
        ...blogcategories.data.data.map((bcat: any) => ({
            slug: `blog-category/${bcat.slug}`,
            image: `${bcat.image}`,
            title: bcat.title || "Blog Category",
            description: bcat.description || "Blog category description",
        })),
        ...careers.data.data.map((career: any) => ({
            slug: `career/${career.slug}`,
            image: `${career.image}`,
            title: career.title || "Career",
            description: career.description || "Career description",
        })),
        ...tags.data.data.map((tag: any) => ({
            slug: `tag/${tag.slug}`,
            image: `${tag.image}`,
            title: tag.title || "Tag",
            description: tag.description || "Tag description",
        })),
        ...pages.data.data.filter((page: any) => page.slug !== 'about-us').map((page: any) => ({
            slug: `page/${page.slug}`,
            title: page.title || "Page",
            description: page.description || "Page description",
        })),
    ];

    // Generate the XML for the sitemap including image data
    const sitemapUrls = allPages
        .map((p) => {
            const imageTag = p.image
                ? `<image:image>
                    <image:loc>${p.image}</image:loc>
                    <image:title>${p.title}</image:title>
                    <image:caption>${p.description}</image:caption>
                </image:image>`
                : "";  // If there's no image, skip the image tag

            return `<url>
        <loc>${baseUrl}/${p.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.8</priority>
        <title>${p.title}</title>
        <description>${p.description}</description>
        ${imageTag}
      </url>`;
        })
        .join("\n");

    // Return the sitemap XML as a response
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${sitemapUrls}
  </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
