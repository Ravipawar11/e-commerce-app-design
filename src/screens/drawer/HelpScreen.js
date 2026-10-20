import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes, spacing } from '../../theme';

/* ---------------------------------- Reusable Menu Row ----------------------------------- */
const MenuRow = ({ icon, label, value, onPress, showChevron = true, danger = false }) => (
  <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={onPress}>
    <View
      style={[
        styles.menuIconWrap,
        {
          backgroundColor:
            (danger ? colors.danger || '#e53935' : colors.primary) + '18',
        },
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={danger ? colors.danger || '#e53935' : colors.primary}
      />
    </View>
    <CustomText
      variant="medium"
      size={sizes.sm}
      color={danger ? colors.danger || '#e53935' : colors.textPrimary}
      style={{ flex: 1, marginLeft: spacing.md }}
    >
      {label}
    </CustomText>
    {value ? (
      <CustomText
        variant="regular"
        size={sizes.xs}
        color={colors.textMuted}
        style={{ marginRight: spacing.sm }}
      >
        {value}
      </CustomText>
    ) : null}
    {showChevron && onPress && (
      <Icon name="chevron-forward" size={18} color={colors.textMuted} />
    )}
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

/* ---------------------------------- FAQ Item ----------------------------------- */
const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={styles.faqHeader}
        activeOpacity={0.7}
        onPress={() => setOpen((v) => !v)}
      >
        <CustomText
          variant="semibold"
          size={sizes.sm}
          color={colors.textPrimary}
          style={{ flex: 1, marginRight: spacing.sm }}
        >
          {question}
        </CustomText>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </TouchableOpacity>
      {open && (
        <CustomText
          variant="regular"
          size={sizes.xs}
          color={colors.textSecondary}
          style={styles.faqAnswer}
        >
          {answer}
        </CustomText>
      )}
    </View>
  );
};

/* ---------------------------------- Screen ----------------------------------- */
export const HelpScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messageBeforeDictation = useRef('');

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const spokenText = event.value?.[0];
      if (spokenText) {
        // iOS can send the same result several times as recognition improves.
        // Replace this recording's text instead of appending every callback.
        setMessage(
          messageBeforeDictation.current
            ? `${messageBeforeDictation.current} ${spokenText}`
            : spokenText,
        );
      }
    };

    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (event) => {
      setIsListening(false);
      const errorMessage = event.error?.message;
      if (errorMessage && !errorMessage.includes('No speech detected')) {
        Alert.alert('Voice dictation unavailable', errorMessage);
      }
    };

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  const toggleDictation = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
        return;
      }

      const available = await Voice.isAvailable();
      if (!available) {
        Alert.alert(
          'Voice dictation unavailable',
          'Speech recognition is not available on this device.',
        );
        return;
      }

      messageBeforeDictation.current = message.trim();
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      setIsListening(false);
      Alert.alert(
        'Unable to start dictation',
        error?.message || 'Please allow microphone and speech recognition access.',
      );
    }
  };

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'Go to Profile → My Orders and tap any order to see live tracking.',
    },
    {
      q: 'What is your return policy?',
      a: 'Most items can be returned within 7 days of delivery, unused and in original packaging.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 3–5 business days. Express options are available at checkout.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept UPI, credit/debit cards, net banking, wallets, and cash on delivery.',
    },
  ];

  const handleCall = () => Linking.openURL('tel:+919876543210');
  const handleEmail = () => Linking.openURL('mailto:support@example.com');
  const handleChat = () =>
    Alert.alert('Live Chat', 'Live chat is coming soon. Please email us for now.');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing info', 'Please fill in both subject and message.');
      return;
    }
    Alert.alert('Message sent', 'Our support team will get back to you within 24 hours.');
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ---------- Hero / Intro ---------- */}
      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Icon name="help-buoy-outline" size={36} color={colors.primary} />
        </View>
        <CustomText
          variant="bold"
          size={sizes.lg}
          color={colors.textPrimary}
          style={{ marginTop: spacing.md }}
        >
          How can we help you?
        </CustomText>
        <CustomText
          variant="regular"
          size={sizes.sm}
          color={colors.textMuted}
          style={{ marginTop: spacing.xs, textAlign: 'center' }}
        >
          Browse FAQs, reach out to our team, or send us a message.
        </CustomText>
      </View>

      {/* ---------- Quick Contact ---------- */}
      <CustomText
        variant="semibold"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.sectionTitle}
      >
        QUICK CONTACT
      </CustomText>
      <View style={styles.card}>
        <MenuRow icon="call-outline"   label="Call Support"  value="Mon–Sat, 9am–6pm" onPress={handleCall} />
        <Divider />
        <MenuRow icon="mail-outline"   label="Email Us"      value="support@example.com" onPress={handleEmail} />
        <Divider />
        <MenuRow icon="chatbubbles-outline" label="Live Chat" value="Coming soon" onPress={handleChat} />
      </View>

      {/* ---------- FAQ ---------- */}
      <CustomText
        variant="semibold"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.sectionTitle}
      >
        FREQUENTLY ASKED
      </CustomText>
      <View style={styles.card}>
        {faqs.map((item, i) => (
          <React.Fragment key={i}>
            <FaqItem question={item.q} answer={item.a} />
            {i < faqs.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </View>

      {/* ---------- Send a Message ---------- */}
      <CustomText
        variant="semibold"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.sectionTitle}
      >
        SEND US A MESSAGE
      </CustomText>
      <View style={styles.card}>
        <View style={styles.formWrap}>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <View style={styles.messageInputWrap}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue..."
              placeholderTextColor={colors.textMuted}
              style={styles.messageInput}
              multiline
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={isListening ? 'Stop voice dictation' : 'Start voice dictation'}
              accessibilityHint="Converts your speech into the message field"
              activeOpacity={0.75}
              onPress={toggleDictation}
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            >
              <Icon
                name={isListening ? 'stop' : 'mic'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <CustomText
            variant="regular"
            size={sizes.xs}
            color={isListening ? colors.primary : colors.textMuted}
            style={styles.dictationHint}
          >
            {isListening ? 'Listening… tap stop when you are done.' : 'Tap the microphone to dictate your message.'}
          </CustomText>
        </View>
      </View>

      <CustomButton
        title="Submit"
        icon="paper-plane-outline"
        onPress={handleSubmit}
        style={styles.submitBtn}
      />

      {/* ---------- Footer Links ---------- */}
      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <CustomText variant="medium" size={sizes.xs} color={colors.primary}>
            My Account
          </CustomText>
        </TouchableOpacity>
        <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
          ·
        </CustomText>
        <TouchableOpacity onPress={() => {}}>
          <CustomText variant="medium" size={sizes.xs} color={colors.primary}>
            Privacy Policy
          </CustomText>
        </TouchableOpacity>
        <CustomText variant="regular" size={sizes.xs} color={colors.textMuted}>
          ·
        </CustomText>
        <TouchableOpacity onPress={() => {}}>
          <CustomText variant="medium" size={sizes.xs} color={colors.primary}>
            Terms
          </CustomText>
        </TouchableOpacity>
      </View>

      <CustomText
        variant="regular"
        size={sizes.xs}
        color={colors.textMuted}
        style={styles.version}
      >
        Version 1.0.0
      </CustomText>
    </ScrollView>
  );
};

/* ---------------------------------- Styles ----------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },

  /* Hero */
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Section title */
  sectionTitle: {
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },

  /* Card */
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },

  /* Menu row */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 34 + spacing.md,
  },

  /* FAQ */
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  faqAnswer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    lineHeight: 18,
  },

  /* Form */
  formWrap: { padding: spacing.md },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: sizes.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.family.medium,
    fontSize: sizes.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  messageInputWrap: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: sizes.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: spacing.xs,
  },
  messageInput: {
    flex: 1,
    minHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.family.medium,
    fontSize: sizes.sm,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  voiceButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.primary,
  },
  voiceButtonActive: {
    backgroundColor: colors.danger || '#e53935',
  },
  dictationHint: {
    marginBottom: spacing.sm,
  },

  /* Submit */
  submitBtn: { marginTop: spacing.sm },

  /* Footer links */
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default HelpScreen;
