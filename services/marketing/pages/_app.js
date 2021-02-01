import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://cdn.socketkit.com/assets/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://cdn.socketkit.com/assets/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://cdn.socketkit.com/assets/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="https://cdn.socketkit.com/assets/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="https://cdn.socketkit.com/assets/favicon/safari-pinned-tab.svg"
          color="#f97516"
        />
        <link rel="shortcut icon" href="https://cdn.socketkit.com/assets/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta
          name="msapplication-config"
          content="https://cdn.socketkit.com/assets/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <DefaultSeo
        titleTemplate="%s - Socketkit, Inc."
        title="Mobile Analytics & Subscription Tracking Platform"
        description="Socketkit is a security and privacy focused mobile analytics and subscription tracking platform which gives back the power of data to the user."
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://www.socketkit.com/",
          site_name:
            "Socketkit - Mobile Analytics & Subscription Tracking Platform",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
