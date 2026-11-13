import Link from 'next/link';
import Image from 'next/image';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { getActiveTools } from '@/lib/seoConfigs';

export function Footer() {
  const activeTools = getActiveTools();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 — Product */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 group mb-3" aria-label="KrocPDF Home">
              <div className="relative w-7 h-7 rounded-lg flex items-center justify-center">
                <Image
                  src="/brand/logo-without-bg.png"
                  alt="KrocPDF Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain group-hover:scale-105 transition-transform duration-200 brightness-110"
                />
              </div>
              <span className="text-base font-bold tracking-tight">
                <span className="text-zinc-100 font-extrabold">Kroc</span>
                <span className="text-zinc-400">PDF</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Privacy-first document conversion.
              Every file processed securely — locally in your browser or via encrypted cloud workers.
            </p>
          </div>

          {/* Column 2 — Tools */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Tools</h3>
            <ul className="space-y-2">
              {activeTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Features */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Features</h3>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>Local In-Browser WASM</li>
              <li>Encrypted Cloud Batch</li>
              <li>No File Watermarking</li>
              <li>Auto-Delete Privacy</li>
            </ul>
          </div>

          {/* Column 4 — Open Source */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/alokprashar864/jpg_to_pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors inline-flex items-center space-x-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/alokprashar864/jpg_to_pdf/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  Report an Issue
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/alokprashar864/jpg_to_pdf/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-2 sm:space-y-0">
          <p>© {currentYear} KrocPDF. Open source software.</p>
          <div className="flex items-center space-x-4">
            <span>Client-side WASM &amp; Go Engine</span>
            <span>•</span>
            <a
              href="https://github.com/alokprashar864/jpg_to_pdf/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
