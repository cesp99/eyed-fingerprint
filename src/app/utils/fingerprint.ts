type Fingerprint = {
  userAgent: string;
  browserVersion: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  language: string;
  platform: string;
  screenOrientation: string;
  cookies: boolean;
  codecs: string[];
  fonts: string[];
};

export async function collectFingerprint(): Promise<Fingerprint> {
  const fingerprint: Fingerprint = {
    userAgent: navigator.userAgent,
    browserVersion: getBrowserVersion(),
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: detectPlatform(),
    screenOrientation: getScreenOrientation(),
    cookies: navigator.cookieEnabled,
    codecs: await getCodecs(),
    fonts: await getFonts(),
  };

  return fingerprint;
}

function detectPlatform(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "Macintosh";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("like Mac")) return "iOS";
  return "Unknown";
}

function getScreenOrientation(): string {
  if (screen.orientation) {
    return screen.orientation.type;
  }
  return 'Unknown';
}

function getBrowserVersion(): string {
  const userAgent = navigator.userAgent;
  const versionMatch = userAgent.match(/(?:Chrome|Firefox|Safari|Edge|MSIE|Trident)\/(\d+\.\d+)/);
  return versionMatch ? versionMatch[1] : 'Unknown';
}

// Fetching video and audio codecs available on the system
async function getCodecs(): Promise<string[]> {
  const codecs: string[] = [];
  const videoTest = document.createElement('video');

  // Checking video codecs
  if (videoTest.canPlayType('video/webm; codecs="vp8"')) codecs.push('VP8');
  if (videoTest.canPlayType('video/webm; codecs="vp9"')) codecs.push('VP9');
  if (videoTest.canPlayType('video/mp4; codecs="avc1.42E01E"')) codecs.push('H.264');
  if (videoTest.canPlayType('video/ogg; codecs="theora"')) codecs.push('Theora');

  // Checking audio codecs
  const audioTest = document.createElement('audio');
  if (audioTest.canPlayType('audio/mp4; codecs="mp4a.40.2"')) codecs.push('AAC');
  if (audioTest.canPlayType('audio/ogg; codecs="vorbis"')) codecs.push('Vorbis');

  return codecs;
}

// Fetching installed fonts
async function getFonts(): Promise<string[]> {
  const fonts: string[] = [];

  // Font list
  const testFonts = ['Arial', 'Courier', 'Georgia', 'Verdana', 'Times New Roman', 'Tahoma', 'Trebuchet MS'];

  testFonts.forEach(font => {
    const testDiv = document.createElement('div');
    testDiv.style.fontFamily = font;
    testDiv.textContent = 'abcdefghijklmnopqrstuvwxyz';

    if (testDiv.style.fontFamily === font) {
      fonts.push(font);
    }
  });

  return fonts;
}

export function calculatePrivacyScore(fingerprint: Fingerprint): number {
  let score = 0;

  // User Agent (important)
  if (fingerprint.userAgent.includes('Windows') || fingerprint.userAgent.includes('Mac')) {
    score -= 10;
  } else if (fingerprint.userAgent.includes('Mozilla/5.0')) {
    score += 15;
  }  

  // Resolution (common)
  if (fingerprint.screenResolution === '1920x1080') {
    score += 5;
  } else {
    score -= 10;
  }
  
  // Color depth (important)
  if (fingerprint.colorDepth === 24) {
    score += 15;
  } else {
    score -= 15;
  }

  // Timezone (common)
  if (fingerprint.timezone === 'UTC') {
    score += 5;
  } else {
    score -= 10;
  }

  // Language (common)
  if (fingerprint.language === 'en-US') {
    score += 10;
  } else {
    score -= 5;
  }

  // Platform (semi-important)
  if (fingerprint.platform === 'Windows' || fingerprint.platform === 'Macintosh') {
    score -= 10;
  } else {
    score += 10;
  }

  // Screen Orientation (critical)
  if (fingerprint.screenOrientation === 'portrait-primary' || fingerprint.screenOrientation === 'landscape-primary') {
    score += 10;
  } else {
    score -= 20;
  }

  // Cookies (semi-critical)
  if (fingerprint.cookies) {
    score += 10;
  } else {
    score -= 20;
  }
 
  // Codecs (important)
  if (fingerprint.codecs.length >= 3) {
    score += 10;
  } else {
    score -= 10;
  }

  // Fonts (important)
  if (fingerprint.fonts.length >= 5) {
    score += 10;
  } else {
    score -= 10;
  }

  //min-max (-120 100)
  return Math.min(Math.max(score, 0), 100); 
}


export function getPrivacyRecommendations(fingerprint: Fingerprint, score: number): string[] {
  const recommendations: string[] = [];

  // Subtle suggestion for using Eyed Out browser
  if (score < 80) {
    recommendations.push("For enhanced privacy and a more anonymous browsing experience, you might want to explore the Eyed Out browser.");
  }

  if (fingerprint.userAgent.includes('Chrome')) {
    recommendations.push("Browsers like Eyed Out offer features to mask your user agent, providing an additional layer of privacy.");
  }

  if (fingerprint.timezone !== 'UTC') {
    recommendations.push("Using a browser that can spoof your timezone, like Eyed Out, could help make your browsing activities less identifiable.");
  }

  if (fingerprint.screenResolution !== '1920x1080') {
    recommendations.push("Some browsers, including Eyed Out, can help by spoofing your screen resolution to reduce the likelihood of tracking.");
  }

  if (fingerprint.colorDepth !== 24) {
    recommendations.push("If you'd like to reduce fingerprinting risks, consider using tools that can spoof color depth, such as the Eyed Out browser.");
  }

  if (fingerprint.language !== 'en-US') {
    recommendations.push("Browsers like Eyed Out allow you to adjust your language settings to avoid revealing your actual location and preferences.");
  }

  if (fingerprint.platform === 'Windows' || fingerprint.platform === 'Macintosh') {
    recommendations.push("Spoofing your platform can further protect your privacy. Eyed Out offers platform spoofing to reduce exposure.");
  }

  if (!fingerprint.cookies) {
    recommendations.push("If you prefer more control over cookies, using privacy tools can help manage or block tracking cookies while still allowing essential ones.");
  }

  if (fingerprint.codecs.length < 3) {
    recommendations.push("Browsers like Eyed Out can help spoof or limit access to video and audio codecs, reducing the risk of being tracked.");
  }

  if (fingerprint.fonts.length < 5) {
    recommendations.push("To reduce font-based tracking, consider using a browser like Eyed Out that can spoof the list of fonts available on your system.");
  }

  return recommendations;
}
