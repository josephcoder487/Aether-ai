import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generateMobileAppZip } from '../utils/apkPackageGenerator';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  QrCode,
  PackageCheck,
  ShieldCheck,
  Loader2,
  Check,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const APKInstallModal: React.FC = () => {
  const { isAPKModalOpen, setIsAPKModalOpen } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'download' | 'guide'>('install');

  if (!isAPKModalOpen) return null;

  const currentUrl = window.location.href;
  const pwaBuilderUrl = `https://www.pwabuilder.com?siteUrl=${encodeURIComponent(window.location.origin)}`;

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zipBlob = await generateMobileAppZip();
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AetherChat-Mobile-APK-Package.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 4000);
    } catch (err) {
      console.error('Failed to generate ZIP package:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header with App Branding */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shadow-inner">
              <img
                src="/pwa-192x192.png"
                alt="App Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">Install on Android (.APK)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-indigo-100/80">Aether AI & Private Messenger Mobile App</p>
            </div>
          </div>
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Direct Install (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Download Package (.zip)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            How APK Works
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Status Banner */}
              {isInstalled ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900 text-sm">App Already Installed!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      You are running Aether Messenger in standalone mobile mode with native performance.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-900">
                    <p className="font-semibold text-sm">Instant Native Android Install</p>
                    <p className="mt-0.5 text-indigo-700">
                      When installed on Android, Google Play Services generates a genuine <strong>native WebAPK</strong> on your phone.
                      It appears with the real app icon in your app drawer and runs full screen without any browser bar.
                    </p>
                  </div>
                </div>
              )}

              {/* 1-Tap Install Button if available */}
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.99]"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>1-Tap Install App onto Device</span>
                </button>
              )}

              {/* Phone scanning & direct link */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Open on your Android Phone
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">Chrome / Samsung Browser</span>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 text-xs text-slate-600 bg-transparent outline-none truncate font-mono"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    {copiedUrl ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                {/* QR Code generator preview */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 shrink-0 shadow-sm flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`}
                      alt="Scan to open on mobile"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" /> Scan with Mobile Camera
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Point your Android phone's camera at this QR code to open directly in Chrome and tap <strong>"Install app"</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* PWABuilder 1-click APK Option */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 text-xs">Want a raw standalone .APK file?</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                        PWABuilder
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      Use Microsoft PWABuilder cloud compiler to generate and download a signed standalone <strong>.apk</strong> file in 30 seconds.
                    </p>
                  </div>
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
                  >
                    Generate APK <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Download Mobile App Bundle (.zip)</h4>
                    <p className="text-xs text-slate-500">
                      Complete source, Android manifest, high-res 512px app icons, and TWA build config
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3 border border-slate-200 text-xs text-slate-600 space-y-2 font-mono">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                    <PackageCheck className="w-4 h-4" /> Package Contents:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                    <li>manifest.json (PWA & Android WebAPK standard)</li>
                    <li>twa-manifest.json (Google Bubblewrap APK config)</li>
                    <li>icon-512x512.png & app-icon.png (Android Launcher icons)</li>
                    <li>icon.svg (Vector brand icon)</li>
                    <li>README_INSTALL_APK.txt (Step-by-step sideload guide)</li>
                  </ul>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99]"
                >
                  {downloadingZip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Packaging Files...
                    </>
                  ) : zipDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" /> Download Complete!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download Mobile Package (.zip)
                    </>
                  )}
                </button>
              </div>

              {/* Developer CLI Option */}
              <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Build APK Locally with Bubblewrap</span>
                  <span className="text-indigo-400 font-mono text-[11px]">CLI</span>
                </div>
                <pre className="text-[11px] font-mono bg-black/40 p-2.5 rounded-lg text-emerald-400 overflow-x-auto select-all">
                  npx @bubblewrap/cli init --manifest={window.location.origin}/manifest.webmanifest{'\n'}
                  npx @bubblewrap/cli build
                </pre>
                <p className="text-[11px] text-slate-400">
                  This compiles a native release <code className="text-indigo-300">app-release-signed.apk</code> ready for direct sideloading or Google Play.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950">
                  <p className="font-semibold">How Modern Android Installs APKs</p>
                  <p className="mt-1 text-indigo-800 leading-relaxed">
                    On modern Android devices, you do not need to download sketchy unknown APKs from third-party sites.
                    Android includes the official <strong>WebAPK Service</strong> directly in Google Play Services.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Open in Chrome or Samsung Internet</h5>
                    <p className="text-slate-500 mt-0.5">
                      Visit this app link on your Android smartphone.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Tap "Install" or 3-Dots Menu</h5>
                    <p className="text-slate-500 mt-0.5">
                      Tap the in-app <strong>"Install on Mobile"</strong> button or tap the browser menu (⋮) and select <strong>"Install app"</strong> / <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Android Mints the Native APK</h5>
                    <p className="text-slate-500 mt-0.5">
                      Android automatically registers the app in your device's application drawer, assigns it an app ID, and launches it like any app from the Google Play Store!
                    </p>
                  </div>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold">Using iPhone / iOS?</p>
                  <p className="text-amber-800">
                    Tap Safari's <strong>Share</strong> button (box with upward arrow) and choose <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PWA & WebAPK Verified</span>
          </div>
          <button
            onClick={() => setIsAPKModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
