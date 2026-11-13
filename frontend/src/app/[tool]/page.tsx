import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ConverterWidget } from '@/components/ConverterWidget';
import { getSeoConfig, getSiblingTools } from '@/lib/seoConfigs';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return [
    { tool: 'jpg-to-pdf' },
    { tool: 'png-to-pdf' },
    { tool: 'jpeg-to-pdf' },
    { tool: 'merge-pdf' },
    { tool: 'compress-pdf' },
    { tool: 'pdf-to-jpg' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const config = getSeoConfig(tool);
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `https://krocpdf.app/${tool}`,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;

  // Only allow valid routes
  const validTools = ['jpg-to-pdf', 'png-to-pdf', 'jpeg-to-pdf', 'merge-pdf', 'compress-pdf', 'pdf-to-jpg'];
  if (!validTools.includes(tool)) {
    notFound();
  }

  const config = getSeoConfig(tool);
  const siblings = getSiblingTools(tool);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.toolSchemaName,
    "operatingSystem": "WebBrowser",
    "applicationCategory": "UtilitiesApplication",
    "description": config.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Responsive Container */}
      <div className="max-w-7xl w-full relative z-10 space-y-8 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform text-zinc-400 group-hover:text-white" />
            Back to All Tools
          </Link>
        </div>
        
        {/* Tool Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight">
            {config.h1}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">{config.subtitle}</p>
        </div>

        {/* Converter Workspace */}
        <ConverterWidget tool={tool} />

        {/* Sibling Tool Links */}
        {siblings.length > 0 && (
          <div className="pt-10 border-t border-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Other Tools</p>
            <div className="flex flex-wrap gap-2.5">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`/${sibling.slug}`}
                  className="px-4 py-2 text-xs font-medium bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-850 transition-all shadow-sm"
                >
                  {sibling.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
