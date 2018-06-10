import I18n from 'react-native-i18n';
import en from './locales/en';
import zhHant from './locales/zh-Hant';

I18n.fallbacks = true;
// zh-Hant->zh-Hant-US

I18n.translations = {
  en,
  // 'en-US': en,
  'zh-Hant': zhHant,
  // 'zh-Hant-US': zhHant,
  // 'zh-Hant-TW': zhHant,
};

export default I18n;
