import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';

const SECTIONS = [
  { id: 1, title: "High-Quality Protein Sources", icon: "🥩", color: "#7C5CFC", intro: "Aim for 30–40g of protein per meal to maximize muscle protein synthesis.", items: [{ name: "Chicken Breast", detail: "31g protein per 100g — lean and versatile" }, { name: "Salmon", detail: "25g protein + omega-3 fatty acids" }, { name: "Greek Yogurt", detail: "10g protein per 100g — great for snacks" }, { name: "Eggs", detail: "6g each — complete amino acid profile" }, { name: "Whey Protein", detail: "Fast-absorbing — ideal post-workout" }] },
  { id: 2, title: "Smart Carbohydrate Choices", icon: "🌾", color: "#00D9B8", intro: "Time your carbs around training for performance and recovery.", items: [{ name: "White Rice", detail: "Easily digestible — great post-workout" }, { name: "Sweet Potato", detail: "Sustained energy + fiber + vitamins" }, { name: "Oats", detail: "Perfect pre-workout breakfast" }, { name: "Banana", detail: "Fast energy, potassium for muscle function" }] },
  { id: 3, title: "Healthy Fat Sources", icon: "🥑", color: "#FF6B6B", intro: "Dietary fats support hormone production and joint health.", items: [{ name: "Avocado", detail: "Monounsaturated fats, anti-inflammatory" }, { name: "Olive Oil", detail: "Heart-healthy for cooking or dressings" }, { name: "Nuts & Seeds", detail: "Omega-3s, vitamin E, portable snack" }] },
  { id: 4, title: "Hydration Guidelines", icon: "💧", color: "#06B6D4", intro: "Even mild dehydration reduces performance by up to 15%.", items: [{ name: "Daily intake", detail: "0.5oz per lb of bodyweight (~3L for you)" }, { name: "During workout", detail: "500–750ml per hour of training" }, { name: "Post-workout", detail: "500ml within 30 minutes of finishing" }] },
  { id: 5, title: "Key Supplements", icon: "💊", color: "#FFB300", intro: "Supplements are additions, not replacements for good nutrition.", items: [{ name: "Creatine Monohydrate", detail: "5g/day — most evidence-backed supplement" }, { name: "Vitamin D3", detail: "2,000–4,000 IU/day, especially in winter" }, { name: "Omega-3 Fish Oil", detail: "2–3g EPA+DHA for recovery" }] },
];

function AccordionSection({ section, isOpen, onToggle }: { section: typeof SECTIONS[0], isOpen: boolean, onToggle: () => void }) {
  const C = useAppTheme();

  return (
    <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1.5, borderColor: isOpen ? `${section.color}35` : C.border, overflow: 'hidden', shadowColor: isOpen ? section.color : '#000', shadowOffset: { width: 0, height: isOpen ? 4 : 2 }, shadowOpacity: isOpen ? 0.12 : 0.05, shadowRadius: isOpen ? 20 : 8, elevation: isOpen ? 4 : 1 }}>
      <Pressable onPress={onToggle} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isOpen ? section.color : C.muted, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{section.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: isOpen ? section.color : C.foreground }}>{section.title}</Text>
          <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2, fontWeight: '500' }}>{section.items.length} recommendations</Text>
        </View>
        <View style={{ flexShrink: 0, transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
          <ChevronDown size={20} color={C.textTertiary} />
        </View>
      </Pressable>
      
      {isOpen && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ fontSize: 14, color: C.textSecondary, lineHeight: 22, marginBottom: 16 }}>{section.intro}</Text>
          <View style={{ gap: 10 }}>
            {section.items.map(({ name, detail }) => (
              <View key={name} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, backgroundColor: `${section.color}08`, borderRadius: 12 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: section.color, marginTop: 7 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground }}>{name}</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 4, lineHeight: 18 }}>{detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default function NutritionKnowledgeScreen() {
  const C = useAppTheme();
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>Nutrition Knowledge</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 15, color: C.textSecondary, lineHeight: 22, marginBottom: 24 }}>
          Evidence-based recommendations tailored to your muscle-building goal.
        </Text>
        
        <View style={{ gap: 12 }}>
          {SECTIONS.map((section) => (
            <AccordionSection 
              key={section.id} 
              section={section} 
              isOpen={expanded === section.id} 
              onToggle={() => setExpanded(expanded === section.id ? null : section.id)} 
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
