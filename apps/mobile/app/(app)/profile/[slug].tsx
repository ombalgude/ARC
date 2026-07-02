import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';

export default function ProfileSubScreen() {
  const { slug } = useLocalSearchParams();
  const C = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '700', color: C.foreground, textTransform: 'capitalize' }}>
          {slug?.toString().replace(/-/g, ' ')}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textSecondary }}>Placeholder for {slug}</Text>
      </View>
    </SafeAreaView>
  );
}
