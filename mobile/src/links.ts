/**
 * Which addresses stay inside the app. The page is shown under https://younoahlab.com/ so the browser engine treats it as a secure
 * site (the microphone and speech need that). The lab moves between screens with #hashes, which stay inside. Anything else, such as
 * the privacy page or the How It Works library pages, leaves the app for Safari, and only after a grown-up answers a question.
 */
export const APP_BASE_URL = 'https://younoahlab.com/';

export function staysInApp(url: string): boolean {
  if (/^(about|blob|data):/i.test(url)) return true;
  // The lab page itself, with or without a #screen or ?query: nothing after the first slash but those.
  return /^https:\/\/(www\.)?younoahlab\.com\/?(?:index\.html)?(?:[?#].*)?$/i.test(url);
}

export function opensInSafari(url: string): boolean {
  return /^(https:|mailto:)/i.test(url) && !staysInApp(url);
}

/** Runs in the page before it loads: tells the lab it is inside the app, so it keeps everything on the phone. */
export const BEFORE_PAGE = 'window.YNL_APP = true; true;';
