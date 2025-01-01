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
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Solway:wght@300;400;500;700;800&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
  }
];

let cache: Record<string, any> = {};
export let loader: LoaderFunction = async ({ request }) => {
  const settingsCacheKey = `settings`;

  const cachedSettings = cache[settingsCacheKey];

  const url = new URL(request.url);

  const baseUrl = `${url.origin}`;
  const full_url = `${url.origin}${url.pathname}`;

  const CACHE_EXPIRATION_TIME = 2 * 60 * 1000;
  setTimeout(() => {
    delete cache[settingsCacheKey];
    console.error('Setting cache clear');
  }, CACHE_EXPIRATION_TIME);

  if (cachedSettings) {
    return json({ settings: cachedSettings, full_url, });
  }

  try {
    let settings;
    if (!cachedSettings) {
      const setting = await fetch(config.apiBaseURL + 'setting');
      if (!setting.ok) { throw setting; }
      settings = await setting.json();
      cache[settingsCacheKey] = settings;
    }

    return json({ settings, full_url, });
  } catch (error) {
    throw error;
  }
};

export function ErrorBoundary() {
  const error = useRouteError() as { status: number; statusText: string; data?: { message?: string } };
  useEffect(() => {
    // Create the link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Solway:wght@300;400;500;700;800&display=swap'; // URL of the stylesheet you want to add

    // Append the link tag to the head
    document.head.appendChild(link);

    // Cleanup when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []); // Empty dependency array ensures this runs only once
  return (
    <>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Solway:wght@300;400;500;700;800&display=swap" />
      </head>
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
                  backgroundColor: '#079946',
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
  const { settings, full_url }: any = useLoaderData();

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
          <link rel="icon" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} type="image/x-icon" />
          {/* <!-- Apple Touch Icon --> */}
          <link rel="apple-touch-icon" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} />
          <link rel="apple-touch-icon" sizes="180x180" href={config.imgBaseURL + 'setting/favicon/' + settings?.data?.favicon} />

          <Meta />
          <meta name="og:site_name" content={settings?.data?.title} />
          <meta name="twitter:site" content={settings?.data?.title} />

          {/* // Canonical URL */}
          <link rel="canonical" href={full_url} />
          <Links />
          {/* Google Analytics Script */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${other_details?.google_analytics_id}`}></script>
          <script>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", ${other_details?.google_analytics_id});  // Replace with your GA4 Tracking ID
          `}
          </script>
          
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
          <Footer settings={settings?.data} />

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
