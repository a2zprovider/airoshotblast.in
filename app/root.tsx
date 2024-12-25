import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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
  const full_url = `${url.origin}${url.pathname}`;

  const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;
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
      if (!setting.ok) {
        throw new Error(`Failed to fetch settings: ${setting.statusText}`);
      }
      settings = await setting.json();
      cache[settingsCacheKey] = settings;
    }

    return json({ settings, full_url, });
  } catch (error) {
    console.error('Error during loader execution:', error);
    return json({ error: 'An error occurred while fetching data.' }, { status: 500 });
  }
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Error!</title>
      </head>
      <body>
        <h1>Application Error</h1>
        <p>{error ? error.message : ''}</p>
      </body>
    </html>
  );
}

export default function App() {
  const { settings, full_url }: any = useLoaderData();

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
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
          <script>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');  // Replace with your GA4 Tracking ID
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
