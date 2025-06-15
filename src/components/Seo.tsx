
import React from "react";
import { useLocation } from "react-router-dom";

// Default values
const defaultMeta = {
  title: "AnyHire - Kenya's Premier Rental Marketplace",
  description:
    "Find and rent electronics, tools, equipment and more on AnyHire. List your items to earn, browse by category, and connect locally across Kenya. Safe, flexible, trusted by thousands.",
  image: "https://anyhire.lovable.app/og-image.png",
  url: "https://anyhire.lovable.app/",
  siteName: "AnyHire",
};

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  image,
  url
}) => {
  const location = useLocation();
  const pageUrl = url || `${defaultMeta.url.replace(/\/$/, "")}${location.pathname}`;

  // Breadcrumbs structured data for root page
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": defaultMeta.url
      }
    ]
  };

  // Basic Organization structured data
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: defaultMeta.siteName,
    url: defaultMeta.url,
    logo: defaultMeta.image
  };

  return (
    <>
      <title>{title || defaultMeta.title}</title>
      <meta name="description" content={description || defaultMeta.description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={pageUrl} />
      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || defaultMeta.title} />
      <meta property="og:description" content={description || defaultMeta.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={image || defaultMeta.image} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultMeta.title} />
      <meta name="twitter:description" content={description || defaultMeta.description} />
      <meta name="twitter:image" content={image || defaultMeta.image} />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd),
        }}
      />
    </>
  );
};

export default Seo;
