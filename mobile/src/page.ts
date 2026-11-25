import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

import page from '../assets/web/younoahlab.html';

/** Reads the bundled You Noah Lab page (the site's index.html, unchanged) as text, for the WebView. */
export async function loadPageHtml(): Promise<string> {
  const asset = Asset.fromModule(page);
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error('The You Noah Lab page is missing from the app.');
  return new File(asset.localUri).text();
}
