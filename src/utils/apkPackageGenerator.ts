import JSZip from 'jszip';

export async function generateMobileAppZip(): Promise<Blob> {
  const zip = new JSZip();

  const manifestContent = {
    id: '/',
    name: 'Aether AI & Private Messenger',
    short_name: 'Aether Chat',
    description: 'AI Chat Assistant with a covert private messenger gambit, disguised news notifications, and media exchange.',
    start_url: window.location.origin + '/',
    scope: window.location.origin + '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0f172a',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };

  const bubblewrapTwaConfig = {
    packageId: 'com.aether.chatmessenger',
    host: window.location.host,
    name: 'Aether AI & Private Messenger',
    launcherName: 'Aether Chat',
    themeColor: '#4f46e5',
    navigationColor: '#0f172a',
    backgroundColor: '#0f172a',
    enableNotifications: true,
    startUrl: '/',
    iconUrl: '/pwa-512x512.png',
    maskableIconUrl: '/pwa-maskable-512x512.png',
    appVersionName: '1.0.0',
    appVersionCode: 1,
    signing: {
      scheme: 'v2+v3',
    },
  };

  const installInstructions = `=========================================================
AETHER AI & PRIVATE MESSENGER - ANDROID INSTALLATION GUIDE
=========================================================

HOW TO INSTALL & USE ON YOUR ANDROID MOBILE:

OPTION 1: INSTANT INSTALL VIA ANDROID CHROME (RECOMMENDED & EASIEST)
-------------------------------------------------------------------
1. Open this link on your Android device's Chrome or Samsung Internet browser:
   ${window.location.href}
2. Tap the "Install on Mobile" button inside the app (or tap the 3 dots menu in Chrome -> "Install app" / "Add to Home screen").
3. Android Google Play Services automatically compiles and mints a native APK ("WebAPK") directly onto your phone!
4. The app icon will appear in your Android App Drawer alongside all your regular apps. It runs in full native fullscreen mode without any browser URL bar.

OPTION 2: GENERATE SIGNED .APK FILE IN 1-CLICK (PWABUILDER)
-------------------------------------------------------------------
1. Visit: https://www.pwabuilder.com
2. Paste your app URL:
   ${window.location.origin}
3. Click "Start" -> "Package for Stores" -> "Android".
4. Click "Generate APK".
5. Download the .apk file directly to your Android mobile and tap to install!

OPTION 3: BUILD APK LOCALLY WITH BUBBLEWRAP (DEVELOPER MODE)
-------------------------------------------------------------------
If you have Node.js and Android SDK installed on your PC:
1. Run:
   npm install -g @bubblewrap/cli
2. Run in this extracted folder:
   bubblewrap init --manifest=${window.location.origin}/manifest.webmanifest
3. Run:
   bubblewrap build
4. Your signed app-release-signed.apk will be generated!

Enjoy private, covert chatting with disguised news notifications!
`;

  // Add files to zip
  zip.file('README_INSTALL_APK.txt', installInstructions);
  zip.file('manifest.json', JSON.stringify(manifestContent, null, 2));
  zip.file('twa-manifest.json', JSON.stringify(bubblewrapTwaConfig, null, 2));

  // Try fetching icons to pack them into the zip
  try {
    const iconRes = await fetch('/pwa-512x512.png');
    if (iconRes.ok) {
      const iconBlob = await iconRes.blob();
      zip.file('icon-512x512.png', iconBlob);
      zip.file('app-icon.png', iconBlob);
    }
  } catch {
    // ignore if fetch fails
  }

  try {
    const iconSvgRes = await fetch('/icon.svg');
    if (iconSvgRes.ok) {
      const svgText = await iconSvgRes.text();
      zip.file('icon.svg', svgText);
    }
  } catch {
    // ignore
  }

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}
