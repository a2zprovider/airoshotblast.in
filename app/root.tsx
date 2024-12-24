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
import { commitSession } from "./sessions";
import StatusShow from "./components/StatusShow";
import Loader from "./components/loader";
import Layout from "./components/Layout";
// import { ErrorBoundary } from "./components/_error";

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

export let loader: LoaderFunction = async ({ request }) => {
  try {
    const setting = await fetch(config.apiBaseURL + 'setting');
    const settings = await setting.json();

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const full_url = `${url.origin}${url.pathname}`;

    if (!setting.ok) {
      throw new Error('Failed to fetch data');
    }
    const newSettings: any = {
      title: settings.data.title
    }
    const commit = await commitSession(newSettings);
    return json({ settings, full_url }, { headers: { 'Set-Cookie': commit } });
  } catch (error) {
    throw new Error('Network error or API issue');
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
  const [messages, setMessages] = useState<string[]>([]);

  const { settings, full_url }: any = useLoaderData();
  // console.log('settings : ', settings);

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:5173"); // Make sure this URL matches the server

  //   ws.onopen = () => {
  //     console.log("WebSocket connection established");
  //   };

  //   ws.onmessage = (event) => {
  //     setMessages((prevMessages) => [...prevMessages, event.data]);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);
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
          <link rel="icon" href={config.imgBaseURL + 'setting/favicon/' + settings.data.favicon} type="image/x-icon" />
          {/* <!-- Apple Touch Icon --> */}
          <link rel="apple-touch-icon" href={config.imgBaseURL + 'setting/favicon/' + settings.data.favicon} />
          <link rel="apple-touch-icon" sizes="180x180" href={config.imgBaseURL + 'setting/favicon/' + settings.data.favicon} />

          <Meta />
          <meta name="og:site_name" content={settings.data.title} />
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
          <Header settings={settings.data} />
          <Layout>
            {loading ? (
              <Loader />
            ) : (
              <Outlet />
            )}
          </Layout>
          <Footer settings={settings.data} />

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
