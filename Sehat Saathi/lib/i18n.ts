export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "te"
  | "ta"
  | "gu"
  | "ur"
  | "kn"
  | "or"
  | "ml"
  | "pa";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  promptName: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", promptName: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", promptName: "Hindi" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", promptName: "Bengali" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", promptName: "Marathi" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", promptName: "Telugu" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", promptName: "Tamil" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", promptName: "Gujarati" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", promptName: "Urdu", rtl: true },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", promptName: "Kannada" },
  { code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ", promptName: "Odia" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം", promptName: "Malayalam" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", promptName: "Punjabi" },
];

export type TranslationKey =
  | "formTitle"
  | "formSubtitle"
  | "languageLabel"
  | "localityLabel"
  | "localityPlaceholder"
  | "symptomsPlaceholder"
  | "addPhoto"
  | "analyze"
  | "analyzing"
  | "avatarIdle"
  | "avatarThinking"
  | "avatarTalking"
  | "avatarConcerned"
  | "reportSummary"
  | "reportRedFlags"
  | "reportConditions"
  | "reportConditionsEmpty"
  | "reportCareUrgent"
  | "reportCareNormal"
  | "reportHomeRemedies"
  | "reportRoutine"
  | "reportTreatment"
  | "reportPharmacy"
  | "reportPharmacyEmpty"
  | "reportPharmacyGeneric"
  | "reportNextSteps"
  | "reportEmergencyBanner"
  | "startNewCheck"
  | "disclaimerFooter"
  | "labelXray"
  | "labelEcg"
  | "labelSkin"
  | "labelOther"
  | "labelPrescription"
  | "likelihoodHigh"
  | "likelihoodModerate"
  | "likelihoodLow";

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    formTitle: "Tell me what's going on",
    formSubtitle:
      "Add photos of scans, X-rays, ECG strips, an injury, or a prescription — and describe your symptoms in your own words.",
    languageLabel: "Language",
    localityLabel: "Your area / locality (optional)",
    localityPlaceholder: "e.g., Andheri West, Mumbai",
    symptomsPlaceholder:
      "Describe your symptoms — e.g. chest pain since this morning, fever for 2 days, an acne breakout...",
    addPhoto: "Add photo",
    analyze: "Analyze with Sehat Saathi",
    analyzing: "Analyzing...",
    avatarIdle: "I'm here whenever you're ready.",
    avatarThinking: "Analyzing your reports...",
    avatarTalking: "Here's what I found.",
    avatarConcerned: "This looks urgent — please read carefully.",
    reportSummary: "Summary",
    reportRedFlags: "Concerning signs noticed",
    reportConditions: "Possible conditions (not a confirmed diagnosis)",
    reportConditionsEmpty: "Not enough information to suggest specific conditions.",
    reportCareUrgent: "What you can do right now",
    reportCareNormal: "Immediate / at-home care",
    reportHomeRemedies: "Home remedies you can try",
    reportRoutine: "Suggested routine",
    reportTreatment: "What proper treatment typically involves",
    reportPharmacy: "Where to get these near you",
    reportPharmacyEmpty: "Add your locality above to see nearby pharmacy suggestions.",
    reportPharmacyGeneric: "Search pharmacies near you",
    reportNextSteps: "Next steps",
    reportEmergencyBanner:
      "This may be a medical emergency. Call 112 (national emergency) or 108 (ambulance) now.",
    startNewCheck: "Start a new check",
    disclaimerFooter:
      "Sehat Saathi gives AI-assisted guidance only. It is not a substitute for professional medical advice, diagnosis, or treatment. In an emergency, call 112 or 108 immediately.",
    labelXray: "X-Ray",
    labelEcg: "ECG",
    labelSkin: "Skin / Injury Photo",
    labelOther: "Other Scan",
    labelPrescription: "Prescription",
    likelihoodHigh: "High",
    likelihoodModerate: "Moderate",
    likelihoodLow: "Low",
  },
  hi: {
    formTitle: "बताइए क्या तकलीफ़ है",
    formSubtitle:
      "स्कैन, एक्स-रे, ईसीजी, चोट या पर्चे की फ़ोटो जोड़ें — और अपने लक्षण अपने शब्दों में बताएं।",
    languageLabel: "भाषा",
    localityLabel: "आपका इलाका (वैकल्पिक)",
    localityPlaceholder: "जैसे, अंधेरी वेस्ट, मुंबई",
    symptomsPlaceholder:
      "अपने लक्षण बताएं — जैसे आज सुबह से सीने में दर्द, 2 दिन से बुखार, चेहरे पर मुंहासे...",
    addPhoto: "फ़ोटो जोड़ें",
    analyze: "सेहत साथी से जांच कराएं",
    analyzing: "जांच हो रही है...",
    avatarIdle: "जब आप तैयार हों, मैं यहीं हूं।",
    avatarThinking: "आपकी रिपोर्ट जांची जा रही है...",
    avatarTalking: "मुझे यह मिला है।",
    avatarConcerned: "यह गंभीर लग रहा है — कृपया ध्यान से पढ़ें।",
    reportSummary: "सारांश",
    reportRedFlags: "चिंताजनक लक्षण",
    reportConditions: "संभावित स्थितियां (यह पक्का निदान नहीं है)",
    reportConditionsEmpty: "विशेष स्थिति बताने के लिए पर्याप्त जानकारी नहीं है।",
    reportCareUrgent: "अभी आप क्या कर सकते हैं",
    reportCareNormal: "तुरंत / घर पर देखभाल",
    reportHomeRemedies: "आजमाए जा सकने वाले घरेलू नुस्खे",
    reportRoutine: "सुझाई गई दिनचर्या",
    reportTreatment: "उचित इलाज में सामान्यतः क्या शामिल होता है",
    reportPharmacy: "आपके पास कहां से मिलेगा",
    reportPharmacyEmpty: "पास की दवा दुकानें देखने के लिए ऊपर अपना इलाका जोड़ें।",
    reportPharmacyGeneric: "अपने पास की दवा दुकानें खोजें",
    reportNextSteps: "आगे क्या करें",
    reportEmergencyBanner:
      "यह मेडिकल इमरजेंसी हो सकती है। अभी 112 (राष्ट्रीय आपातकाल) या 108 (एम्बुलेंस) पर कॉल करें।",
    startNewCheck: "नई जांच शुरू करें",
    disclaimerFooter:
      "सेहत साथी केवल AI-सहायता प्राप्त मार्गदर्शन देता है। यह पेशेवर चिकित्सीय सलाह, निदान या इलाज का विकल्प नहीं है। आपातकाल में तुरंत 112 या 108 पर कॉल करें।",
    labelXray: "एक्स-रे",
    labelEcg: "ईसीजी",
    labelSkin: "त्वचा / चोट की फ़ोटो",
    labelOther: "अन्य स्कैन",
    labelPrescription: "पर्चा (प्रिस्क्रिप्शन)",
    likelihoodHigh: "अधिक संभावना",
    likelihoodModerate: "मध्यम संभावना",
    likelihoodLow: "कम संभावना",
  },
  bn: {
    formTitle: "বলুন কী সমস্যা হচ্ছে",
    formSubtitle:
      "স্ক্যান, এক্স-রে, ইসিজি, আঘাত বা প্রেসক্রিপশনের ছবি যোগ করুন — এবং নিজের ভাষায় উপসর্গ লিখুন।",
    languageLabel: "ভাষা",
    localityLabel: "আপনার এলাকা (ঐচ্ছিক)",
    localityPlaceholder: "যেমন, সল্ট লেক, কলকাতা",
    symptomsPlaceholder:
      "আপনার উপসর্গ লিখুন — যেমন আজ সকাল থেকে বুকে ব্যথা, ২ দিন ধরে জ্বর, মুখে ব্রণ...",
    addPhoto: "ছবি যোগ করুন",
    analyze: "সেহত সাথীর সাথে বিশ্লেষণ করুন",
    analyzing: "বিশ্লেষণ চলছে...",
    avatarIdle: "আপনি প্রস্তুত হলে, আমি এখানেই আছি।",
    avatarThinking: "আপনার তথ্য যাচাই করা হচ্ছে...",
    avatarTalking: "আমি এটি খুঁজে পেয়েছি।",
    avatarConcerned: "এটি জরুরি মনে হচ্ছে — অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন।",
    reportSummary: "সারাংশ",
    reportRedFlags: "উদ্বেগজনক লক্ষণ",
    reportConditions: "সম্ভাব্য অবস্থা (এটি নিশ্চিত রোগনির্ণয় নয়)",
    reportConditionsEmpty: "নির্দিষ্ট অবস্থা বলার মতো যথেষ্ট তথ্য নেই।",
    reportCareUrgent: "এখনই আপনি যা করতে পারেন",
    reportCareNormal: "তাৎক্ষণিক / বাড়িতে যত্ন",
    reportHomeRemedies: "চেষ্টা করার মতো ঘরোয়া প্রতিকার",
    reportRoutine: "প্রস্তাবিত রুটিন",
    reportTreatment: "সঠিক চিকিৎসায় সাধারণত যা থাকে",
    reportPharmacy: "কাছাকাছি কোথায় পাবেন",
    reportPharmacyEmpty: "কাছের ওষুধের দোকান দেখতে উপরে আপনার এলাকা যোগ করুন।",
    reportPharmacyGeneric: "কাছাকাছি ওষুধের দোকান খুঁজুন",
    reportNextSteps: "পরবর্তী পদক্ষেপ",
    reportEmergencyBanner:
      "এটি একটি মেডিকেল ইমার্জেন্সি হতে পারে। এখনই 112 (জাতীয় জরুরি) বা 108 (অ্যাম্বুলেন্স) নম্বরে কল করুন।",
    startNewCheck: "নতুন পরীক্ষা শুরু করুন",
    disclaimerFooter:
      "সেহত সাথী শুধুমাত্র AI-সহায়ক পরামর্শ দেয়। এটি পেশাদার চিকিৎসা পরামর্শ, রোগনির্ণয় বা চিকিৎসার বিকল্প নয়। জরুরি অবস্থায় অবিলম্বে 112 বা 108 নম্বরে কল করুন।",
    labelXray: "এক্স-রে",
    labelEcg: "ইসিজি",
    labelSkin: "ত্বক / আঘাতের ছবি",
    labelOther: "অন্য স্ক্যান",
    labelPrescription: "প্রেসক্রিপশন",
    likelihoodHigh: "বেশি সম্ভাবনা",
    likelihoodModerate: "মাঝারি সম্ভাবনা",
    likelihoodLow: "কম সম্ভাবনা",
  },
  mr: {
    formTitle: "काय त्रास होतोय ते सांगा",
    formSubtitle:
      "स्कॅन, एक्स-रे, ईसीजी, दुखापत किंवा प्रिस्क्रिप्शनचे फोटो जोडा — आणि आपल्या शब्दांत लक्षणे सांगा.",
    languageLabel: "भाषा",
    localityLabel: "तुमचा परिसर (ऐच्छिक)",
    localityPlaceholder: "उदा., कोथरूड, पुणे",
    symptomsPlaceholder:
      "तुमची लक्षणे सांगा — उदा. आज सकाळपासून छातीत दुखणे, 2 दिवसांपासून ताप, चेहऱ्यावर पुरळ...",
    addPhoto: "फोटो जोडा",
    analyze: "सेहत साथीकडून तपासा",
    analyzing: "तपासणी सुरू आहे...",
    avatarIdle: "तुम्ही तयार असाल तेव्हा, मी इथेच आहे.",
    avatarThinking: "तुमचा अहवाल तपासला जात आहे...",
    avatarTalking: "मला हे आढळले.",
    avatarConcerned: "हे गंभीर वाटतंय — कृपया काळजीपूर्वक वाचा.",
    reportSummary: "सारांश",
    reportRedFlags: "चिंताजनक लक्षणे",
    reportConditions: "संभाव्य स्थिती (हे निश्चित निदान नाही)",
    reportConditionsEmpty: "विशिष्ट स्थिती सांगण्यासाठी पुरेशी माहिती नाही.",
    reportCareUrgent: "आत्ता तुम्ही काय करू शकता",
    reportCareNormal: "तात्काळ / घरगुती काळजी",
    reportHomeRemedies: "करून पाहता येतील असे घरगुती उपाय",
    reportRoutine: "सुचवलेली दिनचर्या",
    reportTreatment: "योग्य उपचारात साधारणतः काय समाविष्ट असते",
    reportPharmacy: "तुमच्या जवळ कुठे मिळेल",
    reportPharmacyEmpty: "जवळची औषध दुकाने पाहण्यासाठी वर तुमचा परिसर जोडा.",
    reportPharmacyGeneric: "जवळची औषध दुकाने शोधा",
    reportNextSteps: "पुढील पावले",
    reportEmergencyBanner:
      "ही वैद्यकीय आणीबाणी असू शकते. आत्ताच 112 (राष्ट्रीय आणीबाणी) किंवा 108 (रुग्णवाहिका) वर कॉल करा.",
    startNewCheck: "नवीन तपासणी सुरू करा",
    disclaimerFooter:
      "सेहत साथी फक्त AI-सहाय्यित मार्गदर्शन देते. हे व्यावसायिक वैद्यकीय सल्ला, निदान किंवा उपचाराचा पर्याय नाही. आणीबाणीत ताबडतोब 112 किंवा 108 वर कॉल करा.",
    labelXray: "एक्स-रे",
    labelEcg: "ईसीजी",
    labelSkin: "त्वचा / दुखापतीचा फोटो",
    labelOther: "इतर स्कॅन",
    labelPrescription: "प्रिस्क्रिप्शन",
    likelihoodHigh: "जास्त शक्यता",
    likelihoodModerate: "मध्यम शक्यता",
    likelihoodLow: "कमी शक्यता",
  },
  te: {
    formTitle: "మీకు ఏమి ఇబ్బందిగా ఉందో చెప్పండి",
    formSubtitle:
      "స్కాన్‌లు, ఎక్స్-రేలు, ఈసీజీ, గాయం లేదా ప్రిస్క్రిప్షన్ ఫోటోలను జోడించండి — మరియు మీ లక్షణాలను మీ మాటల్లో వివరించండి.",
    languageLabel: "భాష",
    localityLabel: "మీ ప్రాంతం (ఐచ్ఛికం)",
    localityPlaceholder: "ఉదా., బంజారా హిల్స్, హైదరాబాద్",
    symptomsPlaceholder:
      "మీ లక్షణాలను వివరించండి — ఉదా. ఈరోజు ఉదయం నుండి ఛాతీ నొప్పి, 2 రోజులుగా జ్వరం, మొటిమలు...",
    addPhoto: "ఫోటో జోడించండి",
    analyze: "సేహత్ సాథీతో విశ్లేషించండి",
    analyzing: "విశ్లేషిస్తోంది...",
    avatarIdle: "మీరు సిద్ధంగా ఉన్నప్పుడు, నేను ఇక్కడే ఉన్నాను.",
    avatarThinking: "మీ నివేదికలను విశ్లేషిస్తోంది...",
    avatarTalking: "నాకు ఇది కనిపించింది.",
    avatarConcerned: "ఇది తీవ్రమైనదిగా అనిపిస్తోంది — దయచేసి జాగ్రత్తగా చదవండి.",
    reportSummary: "సారాంశం",
    reportRedFlags: "ఆందోళనకరమైన సంకేతాలు",
    reportConditions: "సాధ్యమైన పరిస్థితులు (ఇది ఖచ్చితమైన నిర్ధారణ కాదు)",
    reportConditionsEmpty: "నిర్దిష్ట పరిస్థితులను సూచించడానికి తగినంత సమాచారం లేదు.",
    reportCareUrgent: "ఇప్పుడు మీరు ఏమి చేయవచ్చు",
    reportCareNormal: "తక్షణ / ఇంటి వద్ద సంరక్షణ",
    reportHomeRemedies: "మీరు ప్రయత్నించగల ఇంటి నివారణలు",
    reportRoutine: "సూచించిన దినచర్య",
    reportTreatment: "సరైన చికిత్సలో సాధారణంగా ఏమి ఉంటుంది",
    reportPharmacy: "మీకు దగ్గరలో ఎక్కడ దొరుకుతుంది",
    reportPharmacyEmpty: "సమీప మందుల దుకాణాలను చూడటానికి పైన మీ ప్రాంతాన్ని జోడించండి.",
    reportPharmacyGeneric: "సమీప మందుల దుకాణాలను వెతకండి",
    reportNextSteps: "తదుపరి దశలు",
    reportEmergencyBanner:
      "ఇది వైద్య అత్యవసర పరిస్థితి కావచ్చు. వెంటనే 112 (జాతీయ అత్యవసర సేవ) లేదా 108 (అంబులెన్స్)కు కాల్ చేయండి.",
    startNewCheck: "కొత్త పరీక్ష ప్రారంభించండి",
    disclaimerFooter:
      "సేహత్ సాథీ కేవలం AI-సహాయక మార్గదర్శకత్వాన్ని మాత్రమే అందిస్తుంది. ఇది వృత్తిపరమైన వైద్య సలహా, నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు. అత్యవసర పరిస్థితిలో వెంటనే 112 లేదా 108కు కాల్ చేయండి.",
    labelXray: "ఎక్స్-రే",
    labelEcg: "ఈసీజీ",
    labelSkin: "చర్మం / గాయం ఫోటో",
    labelOther: "ఇతర స్కాన్",
    labelPrescription: "ప్రిస్క్రిప్షన్",
    likelihoodHigh: "అధిక అవకాశం",
    likelihoodModerate: "మధ్యస్థ అవకాశం",
    likelihoodLow: "తక్కువ అవకాశం",
  },
  ta: {
    formTitle: "என்ன பிரச்சனை என்று சொல்லுங்கள்",
    formSubtitle:
      "ஸ்கேன், எக்ஸ்-ரே, ஈசிஜி, காயம் அல்லது மருந்துச் சீட்டு புகைப்படங்களைச் சேர்க்கவும் — உங்கள் அறிகுறிகளை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்.",
    languageLabel: "மொழி",
    localityLabel: "உங்கள் பகுதி (விருப்பத்தேர்வு)",
    localityPlaceholder: "எ.கா., அடையார், சென்னை",
    symptomsPlaceholder:
      "உங்கள் அறிகுறிகளை விவரிக்கவும் — எ.கா. இன்று காலையிலிருந்து மார்பு வலி, 2 நாட்களாக காய்ச்சல், முகப்பரு...",
    addPhoto: "புகைப்படம் சேர்க்கவும்",
    analyze: "சேகத் சாதியுடன் பகுப்பாய்வு செய்யவும்",
    analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
    avatarIdle: "நீங்கள் தயாராக இருக்கும்போது, நான் இங்கே இருக்கிறேன்.",
    avatarThinking: "உங்கள் அறிக்கைகள் பகுப்பாய்வு செய்யப்படுகின்றன...",
    avatarTalking: "எனக்கு இது கிடைத்தது.",
    avatarConcerned: "இது அவசரமானதாகத் தெரிகிறது — கவனமாகப் படிக்கவும்.",
    reportSummary: "சுருக்கம்",
    reportRedFlags: "கவலைக்குரிய அறிகுறிகள்",
    reportConditions: "சாத்தியமான நிலைமைகள் (இது உறுதி செய்யப்பட்ட நோய் கண்டறிதல் அல்ல)",
    reportConditionsEmpty: "குறிப்பிட்ட நிலைமைகளைக் கூற போதுமான தகவல் இல்லை.",
    reportCareUrgent: "இப்போது நீங்கள் என்ன செய்யலாம்",
    reportCareNormal: "உடனடி / வீட்டு பராமரிப்பு",
    reportHomeRemedies: "நீங்கள் முயற்சிக்கக்கூடிய வீட்டு வைத்தியங்கள்",
    reportRoutine: "பரிந்துரைக்கப்பட்ட வழக்கம்",
    reportTreatment: "சரியான சிகிச்சையில் பொதுவாக என்ன அடங்கும்",
    reportPharmacy: "உங்களுக்கு அருகில் எங்கே கிடைக்கும்",
    reportPharmacyEmpty: "அருகிலுள்ள மருந்தகங்களைப் பார்க்க மேலே உங்கள் பகுதியைச் சேர்க்கவும்.",
    reportPharmacyGeneric: "அருகிலுள்ள மருந்தகங்களைத் தேடுங்கள்",
    reportNextSteps: "அடுத்த படிகள்",
    reportEmergencyBanner:
      "இது ஒரு மருத்துவ அவசரநிலையாக இருக்கலாம். இப்போதே 112 (தேசிய அவசரநிலை) அல்லது 108 (ஆம்புலன்ஸ்) ஐ அழைக்கவும்.",
    startNewCheck: "புதிய பரிசோதனையைத் தொடங்கவும்",
    disclaimerFooter:
      "சேகத் சாதி AI-உதவி வழிகாட்டுதலை மட்டுமே வழங்குகிறது. இது தொழில்முறை மருத்துவ ஆலோசனை, நோய் கண்டறிதல் அல்லது சிகிச்சைக்கு மாற்றாக இல்லை. அவசரநிலையில் உடனடியாக 112 அல்லது 108 ஐ அழைக்கவும்.",
    labelXray: "எக்ஸ்-ரே",
    labelEcg: "ஈசிஜி",
    labelSkin: "தோல் / காயப் புகைப்படம்",
    labelOther: "மற்ற ஸ்கேன்",
    labelPrescription: "மருந்துச் சீட்டு",
    likelihoodHigh: "அதிக வாய்ப்பு",
    likelihoodModerate: "மிதமான வாய்ப்பு",
    likelihoodLow: "குறைந்த வாய்ப்பு",
  },
  gu: {
    formTitle: "શું તકલીફ છે તે જણાવો",
    formSubtitle:
      "સ્કેન, એક્સ-રે, ઈસીજી, ઈજા અથવા પ્રિસ્ક્રિપ્શનના ફોટા ઉમેરો — અને તમારા લક્ષણો તમારા શબ્દોમાં જણાવો.",
    languageLabel: "ભાષા",
    localityLabel: "તમારો વિસ્તાર (વૈકલ્પિક)",
    localityPlaceholder: "દા.ત., નવરંગપુરા, અમદાવાદ",
    symptomsPlaceholder:
      "તમારા લક્ષણો જણાવો — દા.ત. આજે સવારથી છાતીમાં દુખાવો, 2 દિવસથી તાવ, ચહેરા પર ખીલ...",
    addPhoto: "ફોટો ઉમેરો",
    analyze: "સેહત સાથી સાથે તપાસો",
    analyzing: "તપાસ ચાલી રહી છે...",
    avatarIdle: "તમે તૈયાર હો ત્યારે, હું અહીં જ છું.",
    avatarThinking: "તમારા રિપોર્ટ્સનું વિશ્લેષણ થઈ રહ્યું છે...",
    avatarTalking: "મને આ મળ્યું.",
    avatarConcerned: "આ ગંભીર લાગે છે — કૃપા કરીને ધ્યાનથી વાંચો.",
    reportSummary: "સારાંશ",
    reportRedFlags: "ચિંતાજનક લક્ષણો",
    reportConditions: "સંભવિત સ્થિતિઓ (આ ચોક્કસ નિદાન નથી)",
    reportConditionsEmpty: "ચોક્કસ સ્થિતિ જણાવવા માટે પૂરતી માહિતી નથી.",
    reportCareUrgent: "અત્યારે તમે શું કરી શકો",
    reportCareNormal: "તાત્કાલિક / ઘરે સંભાળ",
    reportHomeRemedies: "અજમાવી શકાય તેવા ઘરેલુ ઉપચાર",
    reportRoutine: "સૂચવેલ દિનચર્યા",
    reportTreatment: "યોગ્ય સારવારમાં સામાન્ય રીતે શું સામેલ હોય છે",
    reportPharmacy: "તમારી નજીક ક્યાંથી મળશે",
    reportPharmacyEmpty: "નજીકની દવાની દુકાનો જોવા માટે ઉપર તમારો વિસ્તાર ઉમેરો.",
    reportPharmacyGeneric: "નજીકની દવાની દુકાનો શોધો",
    reportNextSteps: "આગળના પગલાં",
    reportEmergencyBanner:
      "આ મેડિકલ ઈમરજન્સી હોઈ શકે છે. અત્યારે જ 112 (રાષ્ટ્રીય કટોકટી) અથવા 108 (એમ્બ્યુલન્સ) પર કૉલ કરો.",
    startNewCheck: "નવી તપાસ શરૂ કરો",
    disclaimerFooter:
      "સેહત સાથી ફક્ત AI-સહાયિત માર્ગદર્શન આપે છે. તે વ્યાવસાયિક તબીબી સલાહ, નિદાન અથવા સારવારનો વિકલ્પ નથી. કટોકટીમાં તરત જ 112 અથવા 108 પર કૉલ કરો.",
    labelXray: "એક્સ-રે",
    labelEcg: "ઈસીજી",
    labelSkin: "ત્વચા / ઈજાનો ફોટો",
    labelOther: "અન્ય સ્કેન",
    labelPrescription: "પ્રિસ્ક્રિપ્શન",
    likelihoodHigh: "વધુ શક્યતા",
    likelihoodModerate: "મધ્યમ શક્યતા",
    likelihoodLow: "ઓછી શક્યતા",
  },
  ur: {
    formTitle: "بتائیں کیا تکلیف ہے",
    formSubtitle:
      "اسکین، ایکس رے، ای سی جی، چوٹ یا نسخے کی تصاویر شامل کریں — اور اپنی علامات اپنے الفاظ میں بیان کریں۔",
    languageLabel: "زبان",
    localityLabel: "آپ کا علاقہ (اختیاری)",
    localityPlaceholder: "مثلاً، صدر، کراچی",
    symptomsPlaceholder:
      "اپنی علامات بیان کریں — مثلاً آج صبح سے سینے میں درد، 2 دن سے بخار، چہرے پر کیل مہاسے...",
    addPhoto: "تصویر شامل کریں",
    analyze: "سہت ساتھی سے تجزیہ کروائیں",
    analyzing: "تجزیہ ہو رہا ہے...",
    avatarIdle: "جب آپ تیار ہوں، میں یہیں ہوں۔",
    avatarThinking: "آپ کی رپورٹس کا جائزہ لیا جا رہا ہے...",
    avatarTalking: "مجھے یہ ملا۔",
    avatarConcerned: "یہ سنگین لگ رہا ہے — براہ کرم غور سے پڑھیں۔",
    reportSummary: "خلاصہ",
    reportRedFlags: "تشویشناک علامات",
    reportConditions: "ممکنہ کیفیات (یہ حتمی تشخیص نہیں ہے)",
    reportConditionsEmpty: "مخصوص کیفیت بتانے کے لیے کافی معلومات نہیں ہیں۔",
    reportCareUrgent: "ابھی آپ کیا کر سکتے ہیں",
    reportCareNormal: "فوری / گھریلو دیکھ بھال",
    reportHomeRemedies: "آزمانے کے قابل گھریلو ٹوٹکے",
    reportRoutine: "تجویز کردہ معمول",
    reportTreatment: "مناسب علاج میں عام طور پر کیا شامل ہوتا ہے",
    reportPharmacy: "آپ کے قریب کہاں ملے گا",
    reportPharmacyEmpty: "قریبی میڈیکل اسٹورز دیکھنے کے لیے اوپر اپنا علاقہ شامل کریں۔",
    reportPharmacyGeneric: "قریبی میڈیکل اسٹورز تلاش کریں",
    reportNextSteps: "اگلے اقدامات",
    reportEmergencyBanner:
      "یہ طبی ایمرجنسی ہو سکتی ہے۔ ابھی 112 (قومی ایمرجنسی) یا 108 (ایمبولینس) پر کال کریں۔",
    startNewCheck: "نیا معائنہ شروع کریں",
    disclaimerFooter:
      "سہت ساتھی صرف AI کی مدد سے رہنمائی فراہم کرتا ہے۔ یہ پیشہ ورانہ طبی مشورے، تشخیص یا علاج کا متبادل نہیں ہے۔ ایمرجنسی میں فوراً 112 یا 108 پر کال کریں۔",
    labelXray: "ایکس رے",
    labelEcg: "ای سی جی",
    labelSkin: "جلد / چوٹ کی تصویر",
    labelOther: "دیگر اسکین",
    labelPrescription: "نسخہ",
    likelihoodHigh: "زیادہ امکان",
    likelihoodModerate: "درمیانہ امکان",
    likelihoodLow: "کم امکان",
  },
  kn: {
    formTitle: "ಏನು ತೊಂದರೆ ಎಂದು ಹೇಳಿ",
    formSubtitle:
      "ಸ್ಕ್ಯಾನ್, ಎಕ್ಸ್-ರೇ, ಇಸಿಜಿ, ಗಾಯ ಅಥವಾ ಔಷಧಿ ಚೀಟಿಯ ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ — ಮತ್ತು ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.",
    languageLabel: "ಭಾಷೆ",
    localityLabel: "ನಿಮ್ಮ ಪ್ರದೇಶ (ಐಚ್ಛಿಕ)",
    localityPlaceholder: "ಉದಾ., ಇಂದಿರಾನಗರ, ಬೆಂಗಳೂರು",
    symptomsPlaceholder:
      "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ — ಉದಾ. ಇಂದು ಬೆಳಿಗ್ಗೆಯಿಂದ ಎದೆ ನೋವು, 2 ದಿನಗಳಿಂದ ಜ್ವರ, ಮೊಡವೆಗಳು...",
    addPhoto: "ಫೋಟೋ ಸೇರಿಸಿ",
    analyze: "ಸೇಹತ್ ಸಾಥಿಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    avatarIdle: "ನೀವು ಸಿದ್ಧರಾದಾಗ, ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.",
    avatarThinking: "ನಿಮ್ಮ ವರದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    avatarTalking: "ನನಗೆ ಇದು ಸಿಕ್ಕಿತು.",
    avatarConcerned: "ಇದು ತುರ್ತಾಗಿ ಕಾಣುತ್ತಿದೆ — ದಯವಿಟ್ಟು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ.",
    reportSummary: "ಸಾರಾಂಶ",
    reportRedFlags: "ಆತಂಕಕಾರಿ ಲಕ್ಷಣಗಳು",
    reportConditions: "ಸಂಭವನೀಯ ಸ್ಥಿತಿಗಳು (ಇದು ಖಚಿತ ರೋಗನಿರ್ಣಯವಲ್ಲ)",
    reportConditionsEmpty: "ನಿರ್ದಿಷ್ಟ ಸ್ಥಿತಿಗಳನ್ನು ಸೂಚಿಸಲು ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಇಲ್ಲ.",
    reportCareUrgent: "ಈಗ ನೀವು ಏನು ಮಾಡಬಹುದು",
    reportCareNormal: "ತಕ್ಷಣದ / ಮನೆಯ ಆರೈಕೆ",
    reportHomeRemedies: "ಪ್ರಯತ್ನಿಸಬಹುದಾದ ಮನೆಮದ್ದುಗಳು",
    reportRoutine: "ಸೂಚಿಸಿದ ದಿನಚರಿ",
    reportTreatment: "ಸರಿಯಾದ ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಏನಿರುತ್ತದೆ",
    reportPharmacy: "ನಿಮ್ಮ ಹತ್ತಿರ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ",
    reportPharmacyEmpty: "ಹತ್ತಿರದ ಔಷಧಿ ಅಂಗಡಿಗಳನ್ನು ನೋಡಲು ಮೇಲೆ ನಿಮ್ಮ ಪ್ರದೇಶವನ್ನು ಸೇರಿಸಿ.",
    reportPharmacyGeneric: "ಹತ್ತಿರದ ಔಷಧಿ ಅಂಗಡಿಗಳನ್ನು ಹುಡುಕಿ",
    reportNextSteps: "ಮುಂದಿನ ಹಂತಗಳು",
    reportEmergencyBanner:
      "ಇದು ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿ ಆಗಿರಬಹುದು. ಈಗಲೇ 112 (ರಾಷ್ಟ್ರೀಯ ತುರ್ತುಸ್ಥಿತಿ) ಅಥವಾ 108 (ಆಂಬ್ಯುಲೆನ್ಸ್) ಗೆ ಕರೆ ಮಾಡಿ.",
    startNewCheck: "ಹೊಸ ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
    disclaimerFooter:
      "ಸೇಹತ್ ಸಾಥಿ ಕೇವಲ AI-ಸಹಾಯಕ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ಇದು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ಚಿಕಿತ್ಸೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ತುರ್ತುಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 112 ಅಥವಾ 108 ಗೆ ಕರೆ ಮಾಡಿ.",
    labelXray: "ಎಕ್ಸ್-ರೇ",
    labelEcg: "ಇಸಿಜಿ",
    labelSkin: "ಚರ್ಮ / ಗಾಯದ ಫೋಟೋ",
    labelOther: "ಇತರ ಸ್ಕ್ಯಾನ್",
    labelPrescription: "ಔಷಧಿ ಚೀಟಿ",
    likelihoodHigh: "ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ",
    likelihoodModerate: "ಮಧ್ಯಮ ಸಾಧ್ಯತೆ",
    likelihoodLow: "ಕಡಿಮೆ ಸಾಧ್ಯತೆ",
  },
  or: {
    formTitle: "କଣ ଅସୁବିଧା ହେଉଛି କୁହନ୍ତୁ",
    formSubtitle:
      "ସ୍କାନ୍, ଏକ୍ସ-ରେ, ଇସିଜି, ଆଘାତ କିମ୍ବା ପ୍ରେସକ୍ରିପସନର ଫଟୋ ଯୋଡନ୍ତୁ — ଏବଂ ନିଜ ଭାଷାରେ ଲକ୍ଷଣ ବର୍ଣ୍ଣନା କରନ୍ତୁ।",
    languageLabel: "ଭାଷା",
    localityLabel: "ଆପଣଙ୍କ ଅଞ୍ଚଳ (ଇଚ୍ଛାଧୀନ)",
    localityPlaceholder: "ଯଥା, ସାହିଡ଼ ନଗର, ଭୁବନେଶ୍ୱର",
    symptomsPlaceholder:
      "ଆପଣଙ୍କ ଲକ୍ଷଣ ବର୍ଣ୍ଣନା କରନ୍ତୁ — ଯଥା ଆଜି ସକାଳରୁ ଛାତିରେ ଯନ୍ତ୍ରଣା, 2 ଦିନ ଧରି ଜ୍ୱର, ମୁହଁରେ ବ୍ରଣ...",
    addPhoto: "ଫଟୋ ଯୋଡନ୍ତୁ",
    analyze: "ସେହତ ସାଥୀ ସହିତ ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
    analyzing: "ବିଶ୍ଳେଷଣ ହେଉଛି...",
    avatarIdle: "ଆପଣ ପ୍ରସ୍ତୁତ ହେଲେ, ମୁଁ ଏଠାରେ ଅଛି।",
    avatarThinking: "ଆପଣଙ୍କ ରିପୋର୍ଟ ବିଶ୍ଳେଷଣ ହେଉଛି...",
    avatarTalking: "ମୋତେ ଏହା ମିଳିଲା।",
    avatarConcerned: "ଏହା ଗମ୍ଭୀର ଲାଗୁଛି — ଦୟାକରି ଧ୍ୟାନ ଦେଇ ପଢନ୍ତୁ।",
    reportSummary: "ସାରାଂଶ",
    reportRedFlags: "ଚିନ୍ତାଜନକ ଲକ୍ଷଣ",
    reportConditions: "ସମ୍ଭାବ୍ୟ ଅବସ୍ଥା (ଏହା ନିଶ୍ଚିତ ନିଦାନ ନୁହେଁ)",
    reportConditionsEmpty: "ନିର୍ଦ୍ଦିଷ୍ଟ ଅବସ୍ଥା କହିବା ପାଇଁ ଯଥେଷ୍ଟ ସୂଚନା ନାହିଁ।",
    reportCareUrgent: "ବର୍ତ୍ତମାନ ଆପଣ କଣ କରିପାରିବେ",
    reportCareNormal: "ତୁରନ୍ତ / ଘରୋଇ ଯତ୍ନ",
    reportHomeRemedies: "ଚେଷ୍ଟା କରାଯାଇପାରୁଥିବା ଘରୋଇ ଉପଚାର",
    reportRoutine: "ପରାମର୍ଶିତ ଦୈନନ୍ଦିନ ରୁଟିନ୍",
    reportTreatment: "ସଠିକ ଚିକିତ୍ସାରେ ସାଧାରଣତଃ କଣ ଥାଏ",
    reportPharmacy: "ଆପଣଙ୍କ ପାଖରେ କେଉଁଠି ମିଳିବ",
    reportPharmacyEmpty: "ନିକଟସ୍ଥ ଔଷଧ ଦୋକାନ ଦେଖିବାକୁ ଉପରେ ଆପଣଙ୍କ ଅଞ୍ଚଳ ଯୋଡନ୍ତୁ।",
    reportPharmacyGeneric: "ନିକଟସ୍ଥ ଔଷଧ ଦୋକାନ ଖୋଜନ୍ତୁ",
    reportNextSteps: "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ",
    reportEmergencyBanner:
      "ଏହା ଏକ ଚିକିତ୍ସା ଜରୁରୀକାଳୀନ ଅବସ୍ଥା ହୋଇପାରେ। ବର୍ତ୍ତମାନ 112 (ଜାତୀୟ ଜରୁରୀକାଳୀନ) କିମ୍ବା 108 (ଆମ୍ବୁଲାନ୍ସ)କୁ କଲ୍ କରନ୍ତୁ।",
    startNewCheck: "ନୂଆ ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ",
    disclaimerFooter:
      "ସେହତ ସାଥୀ କେବଳ AI-ସହାୟକ ମାର୍ଗଦର୍ଶନ ପ୍ରଦାନ କରେ। ଏହା ବୃତ୍ତିଗତ ଚିକିତ୍ସା ପରାମର୍ଶ, ନିଦାନ କିମ୍ବା ଚିକିତ୍ସାର ବିକଳ୍ପ ନୁହେଁ। ଜରୁରୀକାଳୀନ ଅବସ୍ଥାରେ ତୁରନ୍ତ 112 କିମ୍ବା 108କୁ କଲ୍ କରନ୍ତୁ।",
    labelXray: "ଏକ୍ସ-ରେ",
    labelEcg: "ଇସିଜି",
    labelSkin: "ତ୍ୱଚା / ଆଘାତ ଫଟୋ",
    labelOther: "ଅନ୍ୟ ସ୍କାନ୍",
    labelPrescription: "ପ୍ରେସକ୍ରିପସନ",
    likelihoodHigh: "ଅଧିକ ସମ୍ଭାବନା",
    likelihoodModerate: "ମଧ୍ୟମ ସମ୍ଭାବନା",
    likelihoodLow: "କମ୍ ସମ୍ଭାବନା",
  },
  ml: {
    formTitle: "എന്താണ് ബുദ്ധിമുട്ട് എന്ന് പറയൂ",
    formSubtitle:
      "സ്കാൻ, എക്സ്-റേ, ഇസിജി, പരിക്ക് അല്ലെങ്കിൽ പ്രിസ്ക്രിപ്ഷൻ ഫോട്ടോകൾ ചേർക്കുക — നിങ്ങളുടെ ലക്ഷണങ്ങൾ സ്വന്തം വാക്കുകളിൽ വിവരിക്കുക.",
    languageLabel: "ഭാഷ",
    localityLabel: "നിങ്ങളുടെ പ്രദേശം (ഐച്ഛികം)",
    localityPlaceholder: "ഉദാ., കക്കനാട്, കൊച്ചി",
    symptomsPlaceholder:
      "നിങ്ങളുടെ ലക്ഷണങ്ങൾ വിവരിക്കുക — ഉദാ. ഇന്ന് രാവിലെ മുതൽ നെഞ്ചുവേദന, 2 ദിവസമായി പനി, മുഖക്കുരു...",
    addPhoto: "ഫോട്ടോ ചേർക്കുക",
    analyze: "സേഹത് സാഥിയുമായി വിശകലനം ചെയ്യുക",
    analyzing: "വിശകലനം ചെയ്യുന്നു...",
    avatarIdle: "നിങ്ങൾ തയ്യാറാകുമ്പോൾ, ഞാൻ ഇവിടെയുണ്ട്.",
    avatarThinking: "നിങ്ങളുടെ റിപ്പോർട്ടുകൾ വിശകലനം ചെയ്യുന്നു...",
    avatarTalking: "എനിക്ക് ഇത് കണ്ടെത്തി.",
    avatarConcerned: "ഇത് അടിയന്തിരമായി തോന്നുന്നു — ദയവായി ശ്രദ്ധയോടെ വായിക്കുക.",
    reportSummary: "സംഗ്രഹം",
    reportRedFlags: "ആശങ്കാജനകമായ ലക്ഷണങ്ങൾ",
    reportConditions: "സാധ്യതയുള്ള അവസ്ഥകൾ (ഇത് സ്ഥിരീകരിച്ച രോഗനിർണയമല്ല)",
    reportConditionsEmpty: "നിർദ്ദിഷ്ട അവസ്ഥകൾ നിർദ്ദേശിക്കാൻ മതിയായ വിവരങ്ങളില്ല.",
    reportCareUrgent: "ഇപ്പോൾ നിങ്ങൾക്ക് എന്ത് ചെയ്യാം",
    reportCareNormal: "ഉടനടി / വീട്ടിലെ പരിചരണം",
    reportHomeRemedies: "പരീക്ഷിക്കാവുന്ന വീട്ടുവൈദ്യങ്ങൾ",
    reportRoutine: "നിർദ്ദേശിച്ച ദിനചര്യ",
    reportTreatment: "ശരിയായ ചികിത്സയിൽ സാധാരണയായി എന്തൊക്കെ ഉൾപ്പെടുന്നു",
    reportPharmacy: "നിങ്ങളുടെ അടുത്ത് എവിടെ കിട്ടും",
    reportPharmacyEmpty: "അടുത്തുള്ള മരുന്നുകടകൾ കാണാൻ മുകളിൽ നിങ്ങളുടെ പ്രദേശം ചേർക്കുക.",
    reportPharmacyGeneric: "അടുത്തുള്ള മരുന്നുകടകൾ തിരയുക",
    reportNextSteps: "അടുത്ത ഘട്ടങ്ങൾ",
    reportEmergencyBanner:
      "ഇത് ഒരു മെഡിക്കൽ അടിയന്തരാവസ്ഥ ആയിരിക്കാം. ഇപ്പോൾ തന്നെ 112 (ദേശീയ അടിയന്തരാവസ്ഥ) അല്ലെങ്കിൽ 108 (ആംബുലൻസ്) വിളിക്കുക.",
    startNewCheck: "പുതിയ പരിശോധന ആരംഭിക്കുക",
    disclaimerFooter:
      "സേഹത് സാഥി AI-സഹായ മാർഗ്ഗനിർദ്ദേശം മാത്രമേ നൽകുന്നുള്ളൂ. ഇത് പ്രൊഫഷണൽ മെഡിക്കൽ ഉപദേശത്തിനോ രോഗനിർണയത്തിനോ ചികിത്സയ്ക്കോ പകരമല്ല. അടിയന്തരാവസ്ഥയിൽ ഉടൻ 112 അല്ലെങ്കിൽ 108 വിളിക്കുക.",
    labelXray: "എക്സ്-റേ",
    labelEcg: "ഇസിജി",
    labelSkin: "ചർമ്മം / പരിക്ക് ഫോട്ടോ",
    labelOther: "മറ്റ് സ്കാൻ",
    labelPrescription: "പ്രിസ്ക്രിപ്ഷൻ",
    likelihoodHigh: "ഉയർന്ന സാധ്യത",
    likelihoodModerate: "മിതമായ സാധ്യത",
    likelihoodLow: "കുറഞ്ഞ സാധ്യത",
  },
  pa: {
    formTitle: "ਦੱਸੋ ਕੀ ਤਕਲੀਫ਼ ਹੈ",
    formSubtitle:
      "ਸਕੈਨ, ਐਕਸ-ਰੇ, ਈਸੀਜੀ, ਸੱਟ ਜਾਂ ਨੁਸਖ਼ੇ ਦੀਆਂ ਫ਼ੋਟੋਆਂ ਜੋੜੋ — ਅਤੇ ਆਪਣੇ ਲੱਛਣ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ।",
    languageLabel: "ਭਾਸ਼ਾ",
    localityLabel: "ਤੁਹਾਡਾ ਇਲਾਕਾ (ਵਿਕਲਪਿਕ)",
    localityPlaceholder: "ਜਿਵੇਂ, ਮਾਡਲ ਟਾਊਨ, ਲੁਧਿਆਣਾ",
    symptomsPlaceholder:
      "ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ — ਜਿਵੇਂ ਅੱਜ ਸਵੇਰ ਤੋਂ ਛਾਤੀ ਵਿੱਚ ਦਰਦ, 2 ਦਿਨਾਂ ਤੋਂ ਬੁਖ਼ਾਰ, ਮੁਹਾਸੇ...",
    addPhoto: "ਫ਼ੋਟੋ ਜੋੜੋ",
    analyze: "ਸੇਹਤ ਸਾਥੀ ਨਾਲ ਜਾਂਚ ਕਰਵਾਓ",
    analyzing: "ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
    avatarIdle: "ਜਦੋਂ ਤੁਸੀਂ ਤਿਆਰ ਹੋਵੋ, ਮੈਂ ਇੱਥੇ ਹੀ ਹਾਂ।",
    avatarThinking: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
    avatarTalking: "ਮੈਨੂੰ ਇਹ ਮਿਲਿਆ।",
    avatarConcerned: "ਇਹ ਗੰਭੀਰ ਲੱਗ ਰਿਹਾ ਹੈ — ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
    reportSummary: "ਸਾਰ",
    reportRedFlags: "ਚਿੰਤਾਜਨਕ ਲੱਛਣ",
    reportConditions: "ਸੰਭਾਵਿਤ ਹਾਲਤਾਂ (ਇਹ ਪੱਕਾ ਨਿਦਾਨ ਨਹੀਂ ਹੈ)",
    reportConditionsEmpty: "ਖ਼ਾਸ ਹਾਲਤ ਦੱਸਣ ਲਈ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ।",
    reportCareUrgent: "ਹੁਣੇ ਤੁਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹੋ",
    reportCareNormal: "ਤੁਰੰਤ / ਘਰੇਲੂ ਦੇਖਭਾਲ",
    reportHomeRemedies: "ਅਜ਼ਮਾਏ ਜਾ ਸਕਣ ਵਾਲੇ ਘਰੇਲੂ ਨੁਸਖੇ",
    reportRoutine: "ਸੁਝਾਈ ਗਈ ਰੁਟੀਨ",
    reportTreatment: "ਸਹੀ ਇਲਾਜ ਵਿੱਚ ਆਮ ਤੌਰ 'ਤੇ ਕੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ",
    reportPharmacy: "ਤੁਹਾਡੇ ਨੇੜੇ ਕਿੱਥੋਂ ਮਿਲੇਗਾ",
    reportPharmacyEmpty: "ਨੇੜਲੀਆਂ ਦਵਾਈਆਂ ਦੀਆਂ ਦੁਕਾਨਾਂ ਦੇਖਣ ਲਈ ਉੱਪਰ ਆਪਣਾ ਇਲਾਕਾ ਜੋੜੋ।",
    reportPharmacyGeneric: "ਨੇੜਲੀਆਂ ਦਵਾਈਆਂ ਦੀਆਂ ਦੁਕਾਨਾਂ ਲੱਭੋ",
    reportNextSteps: "ਅਗਲੇ ਕਦਮ",
    reportEmergencyBanner:
      "ਇਹ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਹੋ ਸਕਦੀ ਹੈ। ਹੁਣੇ 112 (ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ) ਜਾਂ 108 (ਐਂਬੂਲੈਂਸ) 'ਤੇ ਕਾਲ ਕਰੋ।",
    startNewCheck: "ਨਵੀਂ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
    disclaimerFooter:
      "ਸੇਹਤ ਸਾਥੀ ਸਿਰਫ਼ AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਮਾਰਗਦਰਸ਼ਨ ਦਿੰਦਾ ਹੈ। ਇਹ ਪੇਸ਼ੇਵਰ ਡਾਕਟਰੀ ਸਲਾਹ, ਨਿਦਾਨ ਜਾਂ ਇਲਾਜ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਰੰਤ 112 ਜਾਂ 108 'ਤੇ ਕਾਲ ਕਰੋ।",
    labelXray: "ਐਕਸ-ਰੇ",
    labelEcg: "ਈਸੀਜੀ",
    labelSkin: "ਚਮੜੀ / ਸੱਟ ਦੀ ਫ਼ੋਟੋ",
    labelOther: "ਹੋਰ ਸਕੈਨ",
    labelPrescription: "ਨੁਸਖ਼ਾ",
    likelihoodHigh: "ਵੱਧ ਸੰਭਾਵਨਾ",
    likelihoodModerate: "ਦਰਮਿਆਨੀ ਸੰਭਾਵਨਾ",
    likelihoodLow: "ਘੱਟ ਸੰਭਾਵਨਾ",
  },
};

export function t(lang: LanguageCode, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.en[key];
}

export function getLanguage(code: string | undefined | null): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
