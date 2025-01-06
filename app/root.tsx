import {
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { type LinksFunction, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import "./tailwind.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import config from "./config";
import { ModalProvider } from "./components/Modalcontext";
import Enquiry from "./components/Enquiry";
import QuickView from "./components/QuickView";
import StatusShow from "./components/StatusShow";
import Loader from "./components/loader";
import Layout from "./components/Layout";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Solway:wght@300;400;500;700;800&display=swap" },
  { rel: 'stylesheet', href: '/fontawesome/css/all.min.css' },
];

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
  try {
    const settingsCacheKey = `settings`;
    const pagesCacheKey = `pages`;

    const cachedSettings = cache[settingsCacheKey];
    const cachedPages = cache[pagesCacheKey];

    const url = new URL(request.url);

    const baseUrl = `https://${url.host}`;
    const full_url = `https://${url.host}${url.pathname}`;

    const CACHE_EXPIRATION_TIME = 1 * 60 * 60 * 1000;
    setTimeout(() => {
      delete cache[settingsCacheKey];
      delete cache[cachedPages];
      console.error('Setting cache clear');
    }, CACHE_EXPIRATION_TIME);

    let settings;
    if (!cachedSettings) {
      const setting = await fetch(config.apiBaseURL + 'setting');
      if (!setting.ok) { throw setting; }
      settings = await setting.json();
      cache[settingsCacheKey] = settings;
    } else {
      settings = cachedSettings;
    }

    let pages;
    if (!cachedPages) {
      const page = await fetch(config.apiBaseURL + 'pages?limit=100&parent=null');
      if (!page.ok) { throw page; }
      pages = await page.json();
      cache[pagesCacheKey] = pages;
    } else {
      pages = cachedPages;
    }

    return json({ settings, pages, full_url });
  } catch (error) {
    throw error;
  }
};

export const meta: MetaFunction = ({ data }: any) => {
  if (!data || data.error) {
    return [
      { charSet: "UTF-8" },
      { title: "Error - Not found" },
      { name: "description", content: "We couldn't find you're looking for." },
    ];
  }

  return [
    { charSet: "UTF-8" },
  ];
};

export function ErrorBoundary() {
  const error = useRouteError() as { status: number; statusText: string; data?: { message?: string } };
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Solway:wght@300;400;500;700;800&display=swap" />
      <div style={{ backgroundColor: '#E9F1F799', fontFamily: 'Solway', height: '100vh', position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 500, fontSize: '9rem', marginBottom: '1.25rem' }}>
              {error.status}
            </div>
            <div style={{ fontWeight: 500, fontSize: '3rem', marginBottom: '1.25rem', fontFamily: 'Solway' }}>
              {error.statusText}
            </div>
            <p>
              {error && error?.data && error.data.message ? error.data.message : 'Sorry, something went wrong.'}
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem' }}>
              <Link
                to="/"
                style={{
                  backgroundColor: '#07642E',
                  color: 'white',
                  borderRadius: '0.375rem',
                  padding: '1.25rem',
                  fontWeight: 500,
                  fontSize: '1.25rem',
                }}
              >
                Go To Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const { settings, pages, full_url }: any = useLoaderData();

  const other_details = settings?.data?.other_details ? JSON.parse(settings?.data?.other_details) : {};

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ModalProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* <!-- Favicon --> */}
          <link rel="icon" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} type="image/webp" />
          {/* <!-- Apple Touch Icon --> */}
          <link rel="apple-touch-icon" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} />
          <link rel="apple-touch-icon" sizes="180x180" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} />

          <Meta />

          {/* // Canonical URL */}
          <link rel="canonical" href={full_url} />
          <Links />
          {/* Google Analytics Script */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${other_details?.google_analytics_id}`} defer />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag("js", new Date());
                gtag("config", "${other_details?.google_analytics_id}");
              `,
            }}
          />
          <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        </head>
        <body className="text-[#131B23]">
          <Header settings={settings?.data} />
          <Layout>
            {loading ? (
              <Loader />
            ) : (
              <Outlet />
            )}
          </Layout>
          <Footer settings={settings?.data} pages={pages?.data?.data} />

          <StatusShow />
          <Enquiry />
          <QuickView />

          <ScrollRestoration />
          <Scripts />
          {/* Conditionally include LiveReload if Vite is not in use */}
          {/* {process.env.NODE_ENV === "development" && <LiveReload />} */}

        </body>
      </html>
    </ModalProvider>
  );
}
