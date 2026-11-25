import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { APP_BASE_URL, BEFORE_PAGE, opensInSafari, staysInApp } from './links';
import { loadPageHtml } from './page';

const BACKGROUND = '#04051A';

/** A grown-ups-only question before anything leaves the app (Apple asks this of apps for children). */
function askGrownUp(url: string) {
  const a = 12 + Math.floor(Math.random() * 8);
  const b = 3 + Math.floor(Math.random() * 6);
  Alert.prompt(
    'Grown-ups only',
    `This opens a page outside the app. What is ${a} × ${b}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open',
        onPress: (answer?: string) => {
          if (Number((answer ?? '').trim()) === a * b) void Linking.openURL(url);
          else Alert.alert("That answer isn't right", 'Please ask a grown-up.');
        },
      },
    ],
    'plain-text',
    '',
    'number-pad',
  );
}

export default function App() {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const webView = useRef<WebView<object>>(null);

  const load = useCallback(() => {
    setFailed(false);
    loadPageHtml().then(setHtml, () => setFailed(true));
  }, []);
  useEffect(load, [load]);

  const onShouldStart = useCallback((req: ShouldStartLoadRequest) => {
    if (req.isTopFrame === false || staysInApp(req.url)) return true;
    if (opensInSafari(req.url)) askGrownUp(req.url);
    return false;
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {html ? (
          <WebView<object>
            ref={webView}
            style={styles.screen}
            source={{ html, baseUrl: APP_BASE_URL }}
            originWhitelist={['*']}
            injectedJavaScriptBeforeContentLoaded={BEFORE_PAGE}
            onShouldStartLoadWithRequest={onShouldStart}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType="grant"
            allowsBackForwardNavigationGestures={false}
            setSupportMultipleWindows={false}
            contentInsetAdjustmentBehavior="never"
            onContentProcessDidTerminate={() => webView.current?.reload()}
            onError={() => setFailed(true)}
          />
        ) : failed ? (
          <View style={styles.center}>
            <Text style={styles.text}>You Noah Lab could not open.</Text>
            <Pressable accessibilityRole="button" onPress={load} style={styles.button}>
              <Text style={styles.text}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.center}>
            <ActivityIndicator color="#ffffff" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BACKGROUND, gap: 16 },
  text: { color: '#ffffff', fontSize: 17 },
  button: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ffffff55' },
});
