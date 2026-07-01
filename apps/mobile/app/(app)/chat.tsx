import { useAuth, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  background: '#0A0912',
  card: '#12102A',
  cardRaised: '#1B1840',
  foreground: '#EAE8FF',
  brand: '#8F6FFF',
  health: '#00EDD0',
  textSecondary: '#9890BC',
  textTertiary: '#5E5880',
  border: 'rgba(143, 111, 255, 0.12)',
  muted: 'rgba(255, 255, 255, 0.06)',
} as const;

const PROMPTS = [
  'How am I progressing this week?',
  'What should I eat after today\'s workout?',
  'Why these specific macro numbers?',
  'How can I improve consistency?',
];

const AI_REPLIES: Record<string, string> = {
  'How am I progressing this week?': "Great question — here's your week at a glance:\n\n✅ 2/4 workouts completed\n📈 Bench press +2.5kg from last session\n🔥 14-day streak — your longest yet\n🥗 Nutrition at 78% adherence\n\nYou're trending well. The big lever right now is protein — you need 43g more before the day's done. How are you feeling energy-wise?",
  'What should I eat after today\'s workout?': "After Push Day A, your muscles need fast-absorbing protein + carbs within 60 minutes:\n\n🍗 Option 1: Chicken breast (150g) + white rice (200g cooked)\n🥤 Option 2: Whey protein shake + banana + rice cakes\n🥗 Option 3: Greek yogurt parfait + granola + honey\n\nAim for ~40g protein + 60g carbs. The faster you eat after training, the better the recovery signal. What do you have available?",
};

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
}

export default function ChatScreen(): React.JSX.Element {
  const { user } = useUser();
  const firstName = user?.firstName ?? 'there';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      text: `Hey ${firstName} 👋 I'm Arc — your AI fitness coach. I have full context on your workouts, nutrition, habits, and progress.\n\nWhat's on your mind today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((p) => [...p, newMsg]);
    setInput('');
    setShowPrompts(false);
    setTyping(true);
    
    setTimeout(() => {
      setTyping(false);
      const reply =
        AI_REPLIES[text] ||
        "That's a great question. Based on your current plan and data, I'd say the most important thing is consistency — you're already doing that. Your 14-day streak shows real commitment.\n\nWant me to dig into any specific area — nutrition, training, or recovery?";
      setMessages((p) => [...p, { id: Date.now() + 1, role: 'ai', text: reply }]);
    }, 1600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#7C5CFC', '#A07AF8']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>✨</Text>
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Arc Coach</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Knows your data · Always available</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.historyBtn}>
            <Text style={styles.historyIcon}>⏱</Text>
          </Pressable>
        </View>

        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showPrompts && (
            <View style={styles.promptsContainer}>
              <Text style={styles.promptsTitle}>TRY ASKING</Text>
              <View style={styles.promptList}>
                {PROMPTS.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => send(p)}
                    style={({ pressed }) => [styles.promptCard, pressed && styles.pressed]}
                  >
                    <Text style={styles.promptText}>{p}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.msgRow, msg.role === 'user' ? styles.msgUserRow : styles.msgAiRow]}
            >
              {msg.role === 'ai' && (
                <LinearGradient colors={['#7C5CFC', '#A07AF8']} style={styles.aiAvatarSmall}>
                  <Text style={{ fontSize: 12 }}>✨</Text>
                </LinearGradient>
              )}
              <View
                style={[
                  styles.msgBubble,
                  msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            </View>
          ))}

          {typing && (
            <View style={[styles.msgRow, styles.msgAiRow]}>
              <LinearGradient colors={['#7C5CFC', '#A07AF8']} style={styles.aiAvatarSmall}>
                <Text style={{ fontSize: 12 }}>✨</Text>
              </LinearGradient>
              <View style={[styles.msgBubble, styles.bubbleAi, styles.typingBubble]}>
                <Text style={styles.typingDot}>●</Text>
                <Text style={[styles.typingDot, { opacity: 0.6 }]}>●</Text>
                <Text style={[styles.typingDot, { opacity: 0.3 }]}>●</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Arc anything..."
              placeholderTextColor={C.textTertiary}
              multiline
            />
            <Pressable
              disabled={!input.trim()}
              onPress={() => send(input)}
              style={({ pressed }) => [
                styles.sendBtn,
                !input.trim() && { opacity: 0.5 },
                pressed && styles.pressed,
              ]}
            >
              <LinearGradient
                colors={['#8F6FFF', '#A07AF8']}
                style={styles.sendBtnGradient}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatarGradient: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: C.foreground, marginBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.health },
  statusText: { fontSize: 11, color: C.textTertiary },
  historyBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.muted,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: { fontSize: 16 },

  chatArea: { padding: 16, paddingBottom: 24, gap: 16 },
  promptsContainer: { marginBottom: 16 },
  promptsTitle: { fontSize: 11, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 10 },
  promptList: { gap: 8 },
  promptCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  promptText: { fontSize: 13, fontWeight: '500', color: C.foreground },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  msgUserRow: { justifyContent: 'flex-end' },
  msgAiRow: { justifyContent: 'flex-start', gap: 8 },
  aiAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  msgBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: C.brand,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: C.card,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  msgText: { fontSize: 15, color: '#FFF', lineHeight: 22 },
  typingBubble: { flexDirection: 'row', gap: 4, paddingVertical: 14 },
  typingDot: { fontSize: 10, color: C.textSecondary },

  inputArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: C.cardRaised,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    color: C.foreground,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 40,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    marginLeft: 8,
    overflow: 'hidden',
  },
  sendBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 20, color: '#FFF', fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
