// App.js
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreenComponent from './src/components/SplashScreen';
import { AuthProvider } from './src/context/AuthContext';
import { ReportsProvider } from './src/context/ReportsContext';
import RootNavigator from './src/navigation/RootNavigator';

SplashScreenExpo.preventAutoHideAsync().catch(()=>{});

export default function App(){
  const [splashReady, setSplashReady] = useState(false);

  const onFinishSplash = useCallback(async () => {
    setSplashReady(true);
    try{ await SplashScreenExpo.hideAsync(); }catch(e){}
  },[]);

  if(!splashReady) return <SplashScreenComponent onFinish={onFinishSplash} />;

  return (
    <AuthProvider>
      <ReportsProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ReportsProvider>
    </AuthProvider>
  );
}
