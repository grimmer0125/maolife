import I18n from 'react-native-i18n';
import en from './locales/en';
import zhHant from './locales/zh-Hant';

// zh-Hant-US/TW -> zh-Hant, en-US-> en
I18n.fallbacks = true;

I18n.translations = {
  en,
  'zh-Hant': zhHant, // iOS
  'zh-TW': zhHant, // Android
};

export default I18n;
