/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import ReactDOM from "react-dom/client";

// --- ICONS (as SVG components) ---
const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const IconDashboard = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);
const IconCertificate = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);
const IconVerify = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);
const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const IconLogs = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);
const IconLogout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);
const IconQR = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v-8h-8v8zm2-6h4v4h-4v-4z"/>
    </svg>
);
const IconCheckCircle = () => (
    <svg className="icon status-verified" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);
const IconErrorCircle = () => (
    <svg className="icon status-tampered" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
);
const IconCamera = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
  >
    <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    <path d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
  </svg>
);
const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);

const IconIntegration = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 10h-4V4h4v6zm-6 10h-4v-4h4v4zm-2-1.41-6.71-6.7-1.41 1.41L10.59 15H8v2h6v-2h-2.59zM18 8h-2V6h2.59L12 12.59 9.41 10 8 11.41l3.29 3.3 1.41-1.41L18 7.41V10z"/></svg>
);

const IconAlerts = () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 16.5c-.38.52-.92.83-1.5.95V18c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1v-2.17c-1.19-.41-2.13-1.34-2.58-2.58H9.17c-.45 1.24-1.39 2.17-2.58 2.58V18c0 .55-.45 1-1 1H4.5c-.55 0-1-.45-1-1v-.5c.58-.12 1.12-.43 1.5-.95L2 12l2.5-4.5c.38-.52.92-.83 1.5-.95V6c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v2.17c1.19.41 2.13 1.34 2.58 2.58h2.67c.45-1.24 1.39-2.17 2.58-2.58V6c0-.55.45-1 1-1h1.1c.55 0 1 .45 1 1v.5c-.58.12-1.12.43-1.5.95L22 12l-2.5 4.5zM12 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
);

const IconCompliance = () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-3.5c1.93 0 3.5 1.57 3.5 3.5V8H8.5V6c0-1.93 1.57-3.5 3.5-3.5z"/></svg>
);

// --- TRANSLATIONS ---
const translations = {
  en: {
    // General
    login: 'Login', logout: 'Logout', settings: 'Settings', cancel: 'Cancel', save: 'Save Changes', remove: 'Remove', actions: 'Actions', status: 'Status',
    // Login Page
    platformTitle: 'NCVET VeriChain', platformSubtitle: 'Blockchain-Enabled Certification Platform', username: 'Username', password: 'Password',
    demoCredentials: 'Demo Credentials:', issuer: 'Issuer', learner: 'Learner', verifier: 'Verifier', admin: 'Admin',
    // Sidebar & Headers
    sidebarTitle: 'VeriChain', dashboard: 'Dashboard', issueCertificates: 'Issue Certificates', myCertificates: 'My Certificates', verifyCredential: 'Verify Credential',
    userManagement: 'User Management', auditLogs: 'Audit Logs', issuerDashboard: 'Issuer Dashboard', learnerDashboard: 'My Certificates',
    verifierDashboard: 'Verify Credential', adminDashboard: 'Admin Dashboard',
    // Admin Settings
    platformSettings: 'Platform Settings', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', backup: 'Database Backup', downloadBackup: 'Download JSON Backup',
    // User Settings
    profileSettings: 'Profile Settings', instituteName: 'Institute Name', contactEmail: 'Contact Email', logo: 'Logo', uploadLogo: 'Upload Logo',
    fullName: 'Full Name', linkDigilocker: 'Link DigiLocker Account', organizationName: 'Organization Name',
    // Issuer Dashboard
    issueNewCertificate: 'Issue New Certificate', learnerName: 'Learner Name', courseName: 'Course Name', grade: 'Grade', issueDate: 'Issue Date',
    issueCertificateBtn: 'Issue Certificate', issuedCertificates: 'Issued Certificates', txId: 'Tx ID',
    // Learner Dashboard
    shareCertificate: 'Share Certificate', viewQR: 'View QR', downloadPDF: 'Download PDF',
    // Verifier Dashboard
    enterCredentialId: 'Enter Credential ID', verify: 'Verify', scan: 'Scan',
  },
  hi: {
    login: 'लॉग इन करें', logout: 'लॉग आउट करें', settings: 'सेटिंग्स', cancel: 'रद्द करना', save: 'बदलाव सहेजें', remove: 'हटाएं', actions: 'कार्रवाई', status: 'स्थिति',
    platformTitle: 'एनसीवीईटी वेरीचेन', platformSubtitle: 'ब्लॉकचेन-सक्षम प्रमाणन प्लेटफ़ॉर्म', username: 'उपयोगकर्ता नाम', password: 'पासवर्ड',
    demoCredentials: 'डेमो क्रेडेंशियल:', issuer: 'जारीकर्ता', learner: 'शिक्षार्थी', verifier: 'सत्यापनकर्ता', admin: 'व्यवस्थापक',
    sidebarTitle: 'वेरीचेन', dashboard: 'डैशबोर्ड', issueCertificates: 'प्रमाणपत्र जारी करें', myCertificates: 'मेरे प्रमाणपत्र', verifyCredential: 'क्रेडेंशियल सत्यापित करें',
    userManagement: 'उपयोगकर्ता प्रबंधन', auditLogs: 'ऑडिट लॉग', issuerDashboard: 'जारीकर्ता डैशबोर्ड', learnerDashboard: 'मेरे प्रमाणपत्र',
    verifierDashboard: 'क्रेडेंशियल सत्यापित करें', adminDashboard: 'एडमिन डैशबोर्ड',
    platformSettings: 'प्लेटफ़ॉर्म सेटिंग्स', language: 'भाषा', theme: 'थीम', light: 'लाइट', dark: 'डार्क', backup: 'डेटाबेस बैकअप', downloadBackup: 'JSON बैकअप डाउनलोड करें',
    profileSettings: 'प्रोफ़ाइल सेटिंग्स', instituteName: 'संस्थान का नाम', contactEmail: 'संपर्क ईमेल', logo: 'लोगो', uploadLogo: 'लोगो अपलोड करें',
    fullName: 'पूरा नाम', linkDigilocker: 'डिजीलॉकर खाता लिंक करें', organizationName: 'संगठन का नाम',
    issueNewCertificate: 'नया प्रमाणपत्र जारी करें', learnerName: 'शिक्षार्थी का नाम', courseName: 'पाठ्यक्रम का नाम', grade: 'ग्रेड', issueDate: 'जारी करने की तारीख',
    issueCertificateBtn: 'प्रमाणपत्र जारी करें', issuedCertificates: 'जारी किए गए प्रमाण पत्र', txId: 'लेन-देन आईडी',
    shareCertificate: 'प्रमाणपत्र साझा करें', viewQR: 'क्यूआर देखें', downloadPDF: 'पीडीएफ डाउनलोड करें',
    enterCredentialId: 'क्रेडेंशियल आईडी दर्ज करें', verify: 'सत्यापित करें', scan: 'स्कैन',
  },
  ml: {
    login: 'ലോഗിൻ ചെയ്യുക', logout: 'ലോഗ് ഔട്ട്', settings: 'ക്രമീകരണങ്ങൾ', cancel: 'റദ്ദാക്കുക', save: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക', remove: 'നീക്കം ചെയ്യുക', actions: 'പ്രവർത്തനങ്ങൾ', status: 'നില',
    platformTitle: 'NCVET വെരിചെയിൻ', platformSubtitle: 'ബ്ലോക്ക്ചെയിൻ-പ്രാപ്‌തമാക്കിയ സർട്ടിഫിക്കേഷൻ പ്ലാറ്റ്ഫോം', username: 'ഉപയോക്തൃനാമം', password: 'പാസ്‌വേഡ്',
    demoCredentials: 'ഡെമോ ക്രെഡൻഷ്യലുകൾ:', issuer: 'ഇഷ്യൂവർ', learner: 'പഠിതാവ്', verifier: 'പരിശോധകൻ', admin: 'അഡ്മിൻ',
    sidebarTitle: 'വെരിചെയിൻ', dashboard: 'ഡാഷ്ബോർഡ്', issueCertificates: 'സർട്ടിഫിക്കറ്റുകൾ നൽകുക', myCertificates: 'എൻ്റെ സർട്ടിഫിക്കറ്റുകൾ', verifyCredential: 'ക്രെഡൻഷ്യൽ പരിശോധിക്കുക',
    userManagement: 'ഉപയോക്തൃ മാനേജ്മെൻ്റ്', auditLogs: 'ഓഡിറ്റ് ലോഗുകൾ', issuerDashboard: 'ഇഷ്യൂവർ ഡാഷ്ബോർഡ്', learnerDashboard: 'എൻ്റെ സർട്ടിഫിക്കറ്റുകൾ',
    verifierDashboard: 'ക്രെഡൻഷ്യൽ പരിശോധിക്കുക', adminDashboard: 'അഡ്മിൻ ഡാഷ്ബോർഡ്',
    platformSettings: 'പ്ലാറ്റ്ഫോം ക്രമീകരണങ്ങൾ', language: 'ഭാഷ', theme: 'തീം', light: 'ലൈറ്റ്', dark: 'ഡാർക്ക്', backup: 'ഡാറ്റാബേസ് ബാക്കപ്പ്', downloadBackup: 'JSON ബാക്കപ്പ് ഡൗൺലോഡ് ചെയ്യുക',
    profileSettings: 'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ', instituteName: 'സ്ഥാപനത്തിൻ്റെ പേര്', contactEmail: 'കോൺടാക്റ്റ് ഇമെയിൽ', logo: 'ലോഗോ', uploadLogo: 'ലോഗോ അപ്‌ലോഡ് ചെയ്യുക',
    fullName: 'പൂർണ്ണമായ പേര്', linkDigilocker: 'ഡിജിലോക്കർ അക്കൗണ്ട് ലിങ്ക് ചെയ്യുക', organizationName: 'സ്ഥാപനത്തിൻ്റെ പേര്',
    issueNewCertificate: 'പുതിയ സർട്ടിഫിക്കറ്റ് നൽകുക', learnerName: 'പഠിതാവിൻ്റെ പേര്', courseName: 'കോഴ്സിൻ്റെ പേര്', grade: 'ഗ്രേഡ്', issueDate: 'നൽകിയ തീയതി',
    issueCertificateBtn: 'സർട്ടിഫിക്കറ്റ് നൽകുക', issuedCertificates: 'നൽകിയ സർട്ടിഫിക്കറ്റുകൾ', txId: 'ഇടപാട് ഐഡി',
    shareCertificate: 'സർട്ടിഫിക്കറ്റ് പങ്കിടുക', viewQR: 'ക്യുആർ കാണുക', downloadPDF: 'PDF ഡൗൺലോഡ് ചെയ്യുക',
    enterCredentialId: 'ക്രെഡൻഷ്യൽ ഐഡി നൽകുക', verify: 'പരിശോധിക്കുക', scan: 'സ്കാൻ ചെയ്യുക',
  },
};

// --- LANGUAGE CONTEXT ---
const LanguageContext = createContext(null);

const LanguageProvider = ({ children }: { children?: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
const useLanguage = () => useContext(LanguageContext);

// --- MOCK BACKEND / API ---

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Mock Database with richer sample data
const db = {
  users: [
    // Admins
    { id: "admin", username: "admin", password: "admin123", role: "Admin", name: "NCVET Admin" },
    // Issuers
    { id: "issuer1", username: "issuer1", password: "pass123", role: "Issuer", name: "SkillCertify India", email: "contact@skillcertify.in", logo: null },
    { id: "issuer2", username: "issuer2", password: "pass123", role: "Issuer", name: "FutureSkills Academy", email: "info@futureskills.com", logo: null },
    { id: "issuer3", username: "issuer3", password: "pass123", role: "Issuer", name: "Vocational Training Hub", email: "support@vth.org", logo: null },
    // Learners
    { id: "learner1", username: "learner1", password: "pass456", role: "Learner", name: "Priya Sharma", email: "priya.sharma@email.com" },
    { id: "learner2", username: "learner2", password: "pass456", role: "Learner", name: "Amit Kumar", email: "amit.kumar@email.com" },
    { id: "learner3", username: "learner3", password: "pass456", role: "Learner", name: "Sunita Devi", email: "sunita.devi@email.com" },
    { id: "learner4", username: "learner4", password: "pass456", role: "Learner", name: "Rohan Gupta", email: "rohan.gupta@email.com" },
    // Verifiers
    { id: "verifier1", username: "verifier1", password: "pass789", role: "Verifier", name: "TechCorp HR", organizationName: "TechCorp" },
    { id: "verifier2", username: "verifier2", password: "pass789", role: "Verifier", name: "Global Solutions Inc.", organizationName: "Global Solutions Inc." },
  ],
  certificates: [
    { id: "NCVET-1715109600000", learnerName: "Priya Sharma", courseName: "Certified Blockchain Developer", grade: "A", issueDate: "2024-05-07", issuerId: "issuer1", issuerName: "SkillCertify India", txId: "0x1a2b3c4d5e6f...", status: "Issued", hash: "a1b2c3d4e5f6..."},
    { id: "NCVET-1712863200000", learnerName: "Amit Kumar", courseName: "Advanced Cloud Computing", grade: "A+", issueDate: "2024-04-11", issuerId: "issuer2", issuerName: "FutureSkills Academy", txId: "0x7g8h9i0j1k2l...", status: "Issued", hash: "f6e5d4c3b2a1..."},
    { id: "NCVET-1710181800000", learnerName: "Sunita Devi", courseName: "Digital Marketing Specialist", grade: "B", issueDate: "2024-03-11", issuerId: "issuer3", issuerName: "Vocational Training Hub", txId: "0x3m4n5o6p7q8r...", status: "Issued", hash: "c3d4e5f6a1b2..."},
    { id: "NCVET-1707685800000", learnerName: "Priya Sharma", courseName: "AI & Machine Learning Foundations", grade: "A", issueDate: "2024-02-11", issuerId: "issuer2", issuerName: "FutureSkills Academy", txId: "0x9s0t1u2v3w4x...", status: "Issued", hash: "d4e5f6a1b2c3..."},
    { id: "NCVET-1704997800000", learnerName: "Rohan Gupta", courseName: "Cybersecurity Analyst", grade: "B+", issueDate: "2024-01-11", issuerId: "issuer1", issuerName: "SkillCertify India", txId: "0x5y6z7a8b9c0d...", status: "Issued", hash: "e5f6a1b2c3d4..."},
    { id: "NCVET-1699727400000", learnerName: "Amit Kumar", courseName: "Data Analytics Essentials", grade: "C", issueDate: "2023-11-11", issuerId: "issuer3", issuerName: "Vocational Training Hub", txId: "0x1e2f3g4h5i6j...", status: "Revoked", hash: "f6a1b2c3d4e5..."},
  ],
  blockchain: [
    { txId: "0x1a2b3c4d5e6f...", credentialId: "NCVET-1715109600000", issuerId: "issuer1", hash: "a1b2c3d4e5f6...", timestamp: "2024-05-07T18:00:00.000Z"},
    { txId: "0x7g8h9i0j1k2l...", credentialId: "NCVET-1712863200000", issuerId: "issuer2", hash: "f6e5d4c3b2a1...", timestamp: "2024-04-11T19:00:00.000Z"},
    { txId: "0x3m4n5o6p7q8r...", credentialId: "NCVET-1710181800000", issuerId: "issuer3", hash: "c3d4e5f6a1b2...", timestamp: "2024-03-11T18:30:00.000Z"},
    { txId: "0x9s0t1u2v3w4x...", credentialId: "NCVET-1707685800000", issuerId: "issuer2", hash: "d4e5f6a1b2c3...", timestamp: "2024-02-11T21:10:00.000Z"},
    { txId: "0x5y6z7a8b9c0d...", credentialId: "NCVET-1704997800000", issuerId: "issuer1", hash: "e5f6a1b2c3d4...", timestamp: "2024-01-11T20:30:00.000Z"},
    { txId: "0x1e2f3g4h5i6j...", credentialId: "NCVET-1699727400000", issuerId: "issuer3", hash: "f6a1b2c3d4e5...", timestamp: "2023-11-11T18:30:00.000Z"},
  ],
  logs: [
      { id: 1, timestamp: "2024-05-08T10:05:00.000Z", action: "User login: admin", user: "admin" },
      { id: 2, timestamp: "2024-05-08T09:30:00.000Z", action: "Verification attempt for NCVET-1715109600000: Success", user: "verifier1" },
      { id: 3, timestamp: "2024-05-07T18:00:05.000Z", action: "Certificate issued: NCVET-1715109600000 to Priya Sharma", user: "issuer1" },
      { id: 4, timestamp: "2024-05-07T17:55:00.000Z", action: "User login: issuer1", user: "issuer1" },
      { id: 5, timestamp: "2024-05-06T14:00:00.000Z", action: "User added: verifier2 (Verifier)", user: "admin" },
      { id: 6, timestamp: "2024-05-06T11:20:00.000Z", action: "Verification attempt for NCVET-FAKE-ID: Failed", user: "verifier2" },
      { id: 7, timestamp: "2024-05-05T16:45:00.000Z", action: "User login: learner1", user: "learner1" },
  ],
};

// Mock API layer
const api = {
  login: async (username, password) => {
    await new Promise(res => setTimeout(res, 500));
    const user = db.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const token = `fake-token-${user.id}-${Date.now()}`;
      db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `User login: ${username}`, user: username });
      return { ...user, token };
    }
    throw new Error("Invalid credentials");
  },
  issueCertificate: async (data, issuer) => {
    await new Promise(res => setTimeout(res, 1000));
    const timestamp = Date.now();
    const certId = `NCVET-${timestamp}`;
    const certToHash = JSON.stringify({
      learnerName: data.learnerName,
      courseName: data.courseName,
      grade: data.grade,
      issueDate: data.issueDate,
    });
    const hash = await sha256(certToHash);
    const txId = `0x${(await sha256(certId + hash)).substring(0, 16)}`;
    
    const newCertificate = {
      id: certId,
      ...data,
      issuerId: issuer.id,
      issuerName: issuer.name,
      txId: txId,
      status: "Issued",
      hash: hash,
    };
    db.certificates.unshift(newCertificate);
    db.blockchain.unshift({ txId, credentialId: certId, issuerId: issuer.id, hash, timestamp: new Date(timestamp).toISOString() });
    db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `Certificate issued: ${certId} to ${data.learnerName}`, user: issuer.username });
    return newCertificate;
  },
  verifyCertificate: async (credentialId) => {
    await new Promise(res => setTimeout(res, 1000));
    const certificate = db.certificates.find(c => c.id === credentialId);
    const chainRecord = db.blockchain.find(b => b.credentialId === credentialId);

    if (!certificate || !chainRecord) {
        db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `Verification attempt for ${credentialId}: Failed (Not Found)`, user: 'verifier' });
        throw new Error("Certificate not found on the blockchain.");
    }
    
    if (certificate.status === 'Revoked') {
        db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `Verification attempt for ${credentialId}: Failed (Revoked)`, user: 'verifier' });
        return {
            isValid: false,
            certificate,
            chainRecord,
            message: "This certificate has been revoked by the issuer."
        };
    }

    const certToHash = JSON.stringify({
      learnerName: certificate.learnerName,
      courseName: certificate.courseName,
      grade: certificate.grade,
      issueDate: certificate.issueDate,
    });
    const recomputedHash = await sha256(certToHash);
    const isValid = recomputedHash === chainRecord.hash;

    db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `Verification attempt for ${credentialId}: ${isValid ? 'Success' : 'Failed'}`, user: 'verifier' });
    
    return {
      isValid,
      certificate,
      chainRecord,
      message: isValid ? "Certificate is authentic and verified." : "Certificate data does not match blockchain record. It may have been tampered with."
    };
  },
  getDataForUser: async (user) => {
      await new Promise(res => setTimeout(res, 500));
      if (!user) return { certificates: [], users: [], logs: [] };
      switch(user.role) {
          case 'Issuer':
              return { certificates: db.certificates.filter(c => c.issuerId === user.id) };
          case 'Learner':
              const learnerUser = db.users.find(u => u.id === user.id);
              return { certificates: db.certificates.filter(c => c.learnerName === learnerUser.name) };
          case 'Admin':
              return { certificates: db.certificates, users: db.users, logs: db.logs };
          default:
              return { certificates: [], users: [], logs: [] };
      }
  },
  addUser: async (user, adminUser) => {
      await new Promise(res => setTimeout(res, 500));
      const newUser = { ...user, id: user.username.toLowerCase() };
      db.users.push(newUser);
      db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `User added: ${newUser.username} (${newUser.role})`, user: adminUser.username });
      return db.users;
  },
  removeUser: async (userId, adminUser) => {
      await new Promise(res => setTimeout(res, 500));
      const userToRemove = db.users.find(u => u.id === userId);
      db.users = db.users.filter(u => u.id !== userId);
      db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `User removed: ${userToRemove.username}`, user: adminUser.username });
      return db.users;
  },
  updateUser: async (userId, updatedData) => {
    await new Promise(res => setTimeout(res, 500));
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
        db.logs.unshift({ id: Date.now(), timestamp: new Date().toISOString(), action: `User profile updated: ${db.users[userIndex].username}`, user: db.users[userIndex].username });
        return db.users[userIndex];
    }
    throw new Error("User not found for update.");
  },
};

// --- QR CODE GENERATOR ---
const QRCode = ({ value, size = 160 }) => {
    const { theme } = useAppContext();
    const createPath = (matrix) => {
        const cellSize = size / matrix.length;
        let path = '';
        matrix.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    path += `M${c * cellSize},${r * cellSize}h${cellSize}v${cellSize}h-${cellSize}z`;
                }
            });
        });
        return path;
    };

    const qrMatrix = useMemo(() => {
        const size = 21;
        const matrix = Array(size).fill(null).map(() => Array(size).fill(false));
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(Math.random() > 0.5) matrix[i][j] = true;
                if((i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7)) {
                    matrix[i][j] = (i % 2 === 0 || j % 2 === 0);
                }
            }
        }
        return matrix;
    }, [value]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'} stroke="none">
            <path d={createPath(qrMatrix)} />
        </svg>
    );
};


// --- UI COMPONENTS ---

const Spinner = () => (
    <div className="spinner-overlay">
        <div className="spinner"></div>
    </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`toast ${type}`}>{message}</div>;
};

const Modal = ({ children, onClose }: { children?: React.ReactNode, onClose: any }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>&times;</button>
      {children}
    </div>
  </div>
);

// --- CONTEXT ---
const AppContext = createContext(null);

const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [auth, setAuth] = useState({ user: null, token: null, isAuthenticated: false });
  const [data, setData] = useState({ certificates: [], users: [], logs: [] });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const user = await api.login(username, password);
      setAuth({ user, token: user.token, isAuthenticated: true });
      window.location.hash = `#/${user.role.toLowerCase()}`;
      showToast("Login successful!");
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    window.location.hash = '#/login';
    showToast("You have been logged out.");
  };
  
  const fetchData = useCallback(async () => {
    if(!auth.user) return;
    setLoading(true);
    try {
        const result = await api.getDataForUser(auth.user);
        setData(d => ({...d, ...result}));
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  const updateAuthUser = (updatedData) => {
    setAuth(prevAuth => ({
        ...prevAuth,
        user: { ...prevAuth.user, ...updatedData }
    }));
  };

  const value = useMemo(() => ({
    auth, data, loading, notification, theme,
    login, logout, showToast, setLoading, setData, fetchData, setTheme, updateAuthUser,
  }), [auth, data, loading, notification, theme, login, fetchData]);

  return (
    <AppContext.Provider value={value}>
      {children}
      {loading && <Spinner />}
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

// --- PAGES / VIEWS ---

const LoginPage = () => {
  const { login } = useAppContext();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleDemoLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  }

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="sidebar-header" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: '0.5rem' }}>
          <IconShield />
          <h1>{t('platformTitle')}</h1>
        </div>
        <p>{t('platformSubtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('username')}</label>
            <input type="text" id="username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input type="password" id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-gradient" style={{ width: '100%' }}>{t('login')}</button>
        </form>
        <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
            <p style={{marginBottom: '1rem'}}>{t('demoCredentials')}</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
                <button className="btn btn-secondary" onClick={() => handleDemoLogin('issuer1', 'pass123')}>{t('issuer')}</button>
                <button className="btn btn-secondary" onClick={() => handleDemoLogin('learner1', 'pass456')}>{t('learner')}</button>
                <button className="btn btn-secondary" onClick={() => handleDemoLogin('verifier1', 'pass789')}>{t('verifier')}</button>
                <button className="btn btn-secondary" onClick={() => handleDemoLogin('admin', 'admin123')}>{t('admin')}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENTS ---

const Header = ({ title, onMenuClick }) => {
    const { logout } = useAppContext();
    const { t } = useLanguage();
    return (
        <header className="header">
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                 <button className="mobile-menu-btn" onClick={onMenuClick}><IconMenu /></button>
                <h1 className="header-title">{title}</h1>
            </div>
            <button onClick={logout} className="btn btn-secondary">
                <IconLogout /> <span className="hide-mobile">{t('logout')}</span>
            </button>
        </header>
    );
};

const Sidebar = ({ currentRoute, isSidebarOpen }) => {
    const { auth } = useAppContext();
    const { t } = useLanguage();
    
    const navLinks = {
        Issuer: [
            { path: '#/issuer', icon: <IconCertificate />, label: t('issueCertificates') },
            { path: '#/issuer/settings', icon: <IconSettings />, label: t('settings') }
        ],
        Learner: [
            { path: '#/learner', icon: <IconCertificate />, label: t('myCertificates') },
            { path: '#/learner/settings', icon: <IconSettings />, label: t('settings') }
        ],
        Verifier: [
            { path: '#/verifier', icon: <IconVerify />, label: t('verifyCredential') },
            { path: '#/verifier/settings', icon: <IconSettings />, label: t('settings') }
        ],
        Admin: [
            { path: '#/admin', icon: <IconDashboard />, label: t('dashboard') },
            { path: '#/admin/users', icon: <IconUsers />, label: t('userManagement') },
            { path: '#/admin/logs', icon: <IconLogs />, label: t('auditLogs') },
            { path: '#/admin/settings', icon: <IconSettings />, label: t('settings') }
        ]
    };
    
    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <IconShield />
                <h2>{t('sidebarTitle')}</h2>
            </div>
            <nav className="sidebar-nav">
                {auth.user && navLinks[auth.user.role]?.map(link => (
                    <a key={link.path} href={link.path} className={currentRoute === link.path ? 'active' : ''}>
                        {link.icon}
                        <span>{link.label}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                {auth.user && (
                    <div className="user-info">
                        <div className="avatar">
                           {auth.user.logo ? <img src={auth.user.logo} alt="logo" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : auth.user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="name">{auth.user.name}</div>
                            <div className="role">{auth.user.role}</div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

const DashboardLayout = ({ children, title }: { children?: React.ReactNode; title: string }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { hash } = window.location;
    return (
        <div className="dashboard-layout">
            <Sidebar currentRoute={hash} isSidebarOpen={isSidebarOpen} />
            <main className="main-content">
                <Header title={title} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
                <div className="page-content">{children}</div>
            </main>
        </div>
    );
};

const IssueCertificateForm = () => {
    const { auth, setLoading, showToast, fetchData } = useAppContext();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ learnerName: '', courseName: '', grade: 'A', issueDate: new Date().toISOString().split('T')[0] });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.issueCertificate(formData, auth.user);
            showToast('Certificate issued successfully!');
            e.target.reset();
            setFormData({ learnerName: '', courseName: '', grade: 'A', issueDate: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch(error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('issueNewCertificate')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="learnerName">{t('learnerName')}</label>
                        <input type="text" id="learnerName" name="learnerName" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="courseName">{t('courseName')}</label>
                        <input type="text" id="courseName" name="courseName" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="grade">{t('grade')}</label>
                        <select id="grade" name="grade" className="select" value={formData.grade} onChange={handleChange}>
                            <option>A</option> <option>B</option> <option>C</option> <option>D</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="issueDate">{t('issueDate')}</label>
                        <input type="date" id="issueDate" name="issueDate" className="input" value={formData.issueDate} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-gradient">{t('issueCertificateBtn')}</button>
            </form>
        </div>
    );
};

const CertificateTable = ({ certificates }) => {
    const [modalContent, setModalContent] = useState(null);
    const { t } = useLanguage();

    const getStatusTag = (status) => {
        switch(status) {
            case 'Issued': return 'tag-success';
            case 'Revoked': return 'tag-error';
            default: return 'tag-info';
        }
    }

    return (
        <div className="card" style={{marginTop: '2rem'}}>
             <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('issuedCertificates')}</h2>
             <div className="table-container">
                <table className="table">
                    <thead>
                        <tr><th>{t('learnerName')}</th><th>{t('courseName')}</th><th>{t('txId')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr>
                    </thead>
                    <tbody>
                    {certificates.length > 0 ? certificates.map(cert => (
                        <tr key={cert.id}>
                            <td>{cert.learnerName}</td>
                            <td>{cert.courseName}</td>
                            <td><code style={{fontSize: '0.8rem'}}>{cert.txId}</code></td>
                            <td><span className={`tag ${getStatusTag(cert.status)}`}>{cert.status}</span></td>
                            <td style={{display: 'flex', gap: '0.5rem'}}>
                                <button className="btn btn-secondary" onClick={() => setModalContent(cert)}><IconQR /></button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No certificates issued yet.</td></tr>}
                    </tbody>
                </table>
             </div>
             {modalContent && (
                <Modal onClose={() => setModalContent(null)}>
                    <div className="qr-code-container">
                        <h2 style={{fontWeight: 600}}>{t('shareCertificate')}</h2>
                        <QRCode value={modalContent.id} />
                        <p>ID: {modalContent.id}</p>
                    </div>
                </Modal>
             )}
        </div>
    );
};

const IssuerDashboard = () => {
    const { data } = useAppContext();
    const { t } = useLanguage();
    return (
        <DashboardLayout title={t('issuerDashboard')}>
            <IssueCertificateForm />
            <CertificateTable certificates={data.certificates} />
        </DashboardLayout>
    );
};

const LearnerDashboard = () => {
    const { data } = useAppContext();
    const { t } = useLanguage();
    const [modalContent, setModalContent] = useState(null);
    return (
        <DashboardLayout title={t('learnerDashboard')}>
            <div className="dashboard-grid">
                {data.certificates.length > 0 ? data.certificates.map(cert => (
                    <div className="card" key={cert.id}>
                        <h3 style={{fontWeight: 600, fontSize: '1.1rem'}}>{cert.courseName}</h3>
                        <p style={{color: 'var(--text-light)', marginBottom: '1rem'}}>Issued by: {cert.issuerName}</p>
                        <p><strong>{t('grade')}:</strong> {cert.grade}</p>
                        <p><strong>{t('issueDate')}:</strong> {cert.issueDate}</p>
                        <p style={{marginBottom: '1rem'}}><strong>Credential ID:</strong> <code style={{fontSize: '0.8rem'}}>{cert.id}</code></p>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button className="btn btn-gradient" onClick={() => setModalContent(cert)}><IconQR /> {t('viewQR')}</button>
                            <button className="btn btn-secondary" onClick={() => alert('PDF download feature coming soon!')}>{t('downloadPDF')}</button>
                        </div>
                    </div>
                )) : <p>You have not been issued any certificates yet.</p>}
            </div>
             {modalContent && (
                <Modal onClose={() => setModalContent(null)}>
                    <div className="qr-code-container">
                        <h2 style={{fontWeight: 600}}>{t('shareCertificate')}</h2>
                        <QRCode value={modalContent.id} />
                        <p>ID: {modalContent.id}</p>
                    </div>
                </Modal>
             )}
        </DashboardLayout>
    );
};

const QRScannerModal = ({ onClose, onScanSuccess }) => {
    const videoRef = useRef(null);
    const [cameraError, setCameraError] = useState(null);
    const [imageError, setImageError] = useState(null);

    useEffect(() => {
        let stream; let animationFrameId;
        const startScan = async () => {
            if (!('BarcodeDetector' in window)) { setCameraError('QR code scanning is not supported by this browser.'); return; }
            if (!videoRef.current) return;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
                const detect = async () => {
                    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                        const barcodes = await barcodeDetector.detect(videoRef.current);
                        if (barcodes.length > 0) { onScanSuccess(barcodes[0].rawValue); } else { animationFrameId = requestAnimationFrame(detect); }
                    } else { animationFrameId = requestAnimationFrame(detect); }
                };
                detect();
            } catch (err) { setCameraError('Could not access the camera. Please grant permission and try again.'); console.error(err); }
        };
        startScan();
        return () => {
            if (stream) { stream.getTracks().forEach(track => track.stop()); }
            if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
        };
    }, [onScanSuccess]);
    
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]; if (!file) return; setImageError(null);
        if (!('BarcodeDetector' in window)) { setImageError('QR code scanning is not supported by this browser.'); return; }
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const imageUrl = URL.createObjectURL(file); const image = new Image(); image.src = imageUrl;
        image.onload = async () => {
            try {
                const barcodes = await barcodeDetector.detect(image);
                if (barcodes.length > 0) { onScanSuccess(barcodes[0].rawValue); } else { setImageError('No QR code found in the uploaded image.'); }
            } catch (err) { console.error(err); setImageError('Failed to process the image.'); } finally { URL.revokeObjectURL(imageUrl); }
        };
        image.onerror = () => { setImageError('Could not load the selected image.'); URL.revokeObjectURL(imageUrl); };
    };

    return (
        <Modal onClose={onClose}>
            <div className="qr-scanner-container">
                <h2 style={{fontWeight: 600}}>Scan or Upload QR Code</h2>
                {cameraError ? <p className="error-message">{cameraError}</p> : (
                    <div className="video-container">
                         <video ref={videoRef} playsInline style={{ width: '100%', display: 'block' }} />
                         <div className="scanner-overlay"><div className="bottom-left"></div><div className="bottom-right"></div></div>
                    </div>
                )}
                <p>Point your camera at the QR code, or upload an image.</p>
                <div className="scanner-divider"><span>OR</span></div>
                <div>
                    <label htmlFor="qr-file-input" className="btn btn-secondary"><IconQR /> Upload Image</label>
                    <input id="qr-file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                 {imageError && <p className="error-message" style={{marginTop: '1rem'}}>{imageError}</p>}
            </div>
        </Modal>
    );
};

const VerificationResult = ({ result }) => {
    return (
        <div className="verification-result">
            {result.isValid ? <IconCheckCircle /> : <IconErrorCircle />}
            <h2 className={result.isValid ? 'status-verified' : 'status-tampered'}>{result.isValid ? 'Verified' : 'Tampered / Revoked'}</h2>
            <p>{result.message}</p>
            <div className="verification-details">
                <p><strong>Credential ID:</strong> {result.certificate.id}</p><p><strong>Learner:</strong> {result.certificate.learnerName}</p>
                <p><strong>Course:</strong> {result.certificate.courseName}</p><p><strong>Issuer:</strong> {result.certificate.issuerName}</p>
                <p><strong>Issue Date:</strong> {result.certificate.issueDate}</p><p><strong>Transaction ID:</strong> {result.certificate.txId}</p>
                <p><strong>Blockchain Hash:</strong> {result.chainRecord.hash}</p>
            </div>
        </div>
    );
};

const VerifierDashboard = () => {
    const { setLoading, showToast } = useAppContext();
    const { t } = useLanguage();
    const [credentialId, setCredentialId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isScannerOpen, setScannerOpen] = useState(false);

    const handleVerify = async (idToVerify) => {
        if (!idToVerify) return; setLoading(true); setVerificationResult(null);
        try { const result = await api.verifyCertificate(idToVerify); setVerificationResult(result);
        } catch (error) { showToast(error.message, 'error'); } finally { setLoading(false); }
    };
    
    const handleFormSubmit = (e) => { e.preventDefault(); handleVerify(credentialId); };

    const handleScanSuccess = (scannedId) => { setCredentialId(scannedId); setScannerOpen(false); handleVerify(scannedId); };

    return (
        <DashboardLayout title={t('verifyCredential')}>
            <div className="card">
                <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('enterCredentialId')}</h2>
                <form onSubmit={handleFormSubmit} style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                    <input type="text" className="input" placeholder="e.g., NCVET-171..." value={credentialId} onChange={e => setCredentialId(e.target.value)} required style={{flex: '1 1 300px'}} />
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button type="submit" className="btn btn-gradient">{t('verify')}</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setScannerOpen(true)}><IconCamera /> {t('scan')}</button>
                    </div>
                </form>
            </div>
            {isScannerOpen && <QRScannerModal onClose={() => setScannerOpen(false)} onScanSuccess={handleScanSuccess} />}
            {verificationResult && (<Modal onClose={() => setVerificationResult(null)}><VerificationResult result={verificationResult} /></Modal>)}
        </DashboardLayout>
    );
};

// --- NEW ADMIN DASHBOARD WIDGETS ---

const WidgetCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children?: React.ReactNode }) => (
  <div className="widget-card">
    <div className="widget-header">
      <div className="widget-icon">{icon}</div>
      <h3>{title}</h3>
    </div>
    <div className="widget-content">
      {children}
    </div>
  </div>
);

const LineChart = ({ data, data2, width = 300, height = 100 }) => {
    const maxVal = 12; // Static max value for y-axis
    const points = data.map((point, i) => `${(i / (data.length - 1)) * width},${height - (point / maxVal) * height}`).join(' ');
    const points2 = data2.map((point, i) => `${(i / (data2.length - 1)) * width},${height - (point / maxVal) * height}`).join(' ');
    
    return (
        <div>
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{overflow: 'visible'}}>
              <defs>
                  <linearGradient id="lineChartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <path d={`M0,${height - (data[0] / maxVal) * height} ${points} L${width},${height} L0,${height} Z`} fill="url(#lineChartFill)" />
              <polyline fill="none" stroke="#a3a3a3" strokeWidth="2" points={points2} strokeDasharray="4" />
              <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={points} />
              {data.map((point, i) => (
                  <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (point / maxVal) * height} r="4" fill="#3b82f6" stroke="var(--background-white)" strokeWidth="2" />
              ))}
          </svg>
           <div className="line-chart-axes">
                <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
            </div>
        </div>
    );
}

const DonutChart = ({ segments, size = 120 }) => {
    const center = size / 2;
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    let total = segments.reduce((acc, s) => acc + s.value, 0);
    if (total === 0) total = 1; // Avoid division by zero
    let startAngle = -90;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const percentage = seg.value / total;
                const angle = percentage * 360;
                const rotation = `rotate(${startAngle} ${center} ${center})`;
                startAngle += angle;
                return (
                    <circle key={i} cx={center} cy={center} r={radius}
                        fill="transparent" stroke={seg.color} strokeWidth="15"
                        strokeDasharray={`${percentage * circumference} ${circumference}`}
                        transform={rotation}
                    />
                );
            })}
        </svg>
    );
};

const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="control-item">
        <label htmlFor={label}>{label}</label>
        <label className="theme-switch" id={label}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider"></span>
        </label>
    </div>
);


const AnalyticsWidget = () => (
    <WidgetCard icon={<IconDashboard />} title="Analytics Dashboard">
        <LineChart data={[3, 5, 8, 7, 8, 7, 9]} data2={[5, 6, 7, 8, 7, 8, 7]} />
    </WidgetCard>
);

const UserManagementWidget = () => {
    const { data } = useAppContext();
    const totalUsers = data.users.length;
    const activeUsers = totalUsers > 0 ? totalUsers - 1 : 0; // Assuming 1 inactive user for demo
    const inactiveUsers = 1;

    return (
        <WidgetCard icon={<IconUsers />} title="User Management">
            <ul className="user-management-list">
                <li><span>Active Users:</span> <span>{activeUsers}</span></li>
                <li><span>Inactive Users:</span> <span>{inactiveUsers}</span></li>
                <li><span>Total Users:</span> <span>{totalUsers}</span></li>
            </ul>
        </WidgetCard>
    );
};

const IntegrationControlsWidget = () => {
    const [toggles, setToggles] = useState({ api: true, sync1: true, sync2: false });
    const handleChange = (key) => setToggles(prev => ({...prev, [key]: !prev[key]}));
    return (
        <WidgetCard icon={<IconIntegration />} title="Integration Controls">
            <div className="integration-controls">
                <ToggleSwitch label="API Integration: ON" checked={toggles.api} onChange={() => handleChange('api')} />
                <ToggleSwitch label="Third-Party Sync: ON" checked={toggles.sync1} onChange={() => handleChange('sync1')} />
                <ToggleSwitch label="Third-Party Sync: OFF" checked={toggles.sync2} onChange={() => handleChange('sync2')} />
            </div>
        </WidgetCard>
    );
};

const CertificateStatsWidget = () => {
    const { data } = useAppContext();
    const issuedCount = data.certificates.filter(c => c.status === 'Issued').length;
    const revokedCount = data.certificates.filter(c => c.status === 'Revoked').length;
    const chartData = [
      {value: issuedCount, color: '#3b82f6'}, 
      {value: revokedCount, color: '#ef4444'}
    ];
    return (
        <WidgetCard icon={<IconCertificate />} title="Certificate Issue Statistics">
            <div className="certificate-stats">
                <DonutChart segments={chartData} />
                <div className="certificate-stats-info">
                    <p>Total Certificates: <strong>{data.certificates.length.toLocaleString()}</strong></p>
                    <p>Issued: <strong>{issuedCount}</strong></p>
                    <p>Revoked: <strong>{revokedCount}</strong></p>
                </div>
            </div>
        </WidgetCard>
    );
};

const SystemAlertsWidget = () => (
    <WidgetCard icon={<IconAlerts />} title="System Alerts">
        <ul className="system-alerts-list">
            <li><span>High Traffic Alert</span><span className="alert-time">10:00 AM</span></li>
            <li><span>Database Sync Error</span><span className="alert-time">11:30 AM</span></li>
            <li><span>API Latency Warning</span><span className="alert-time">11:45 AM</span></li>
        </ul>
    </WidgetCard>
);

const ComplianceStatusWidget = () => (
    <WidgetCard icon={<IconCompliance />} title="Compliance Status">
        <div className="compliance-status">
            <div className="compliance-status-icon"><IconVerify /></div>
            <p>Regulatory Compliance: Passed</p>
        </div>
    </WidgetCard>
);

const AdminDashboard = () => {
    const { t } = useLanguage();
    return (
        <DashboardLayout title={t('adminDashboard')}>
            <div className="admin-dashboard-grid">
              <AnalyticsWidget />
              <UserManagementWidget />
              <IntegrationControlsWidget />
              <CertificateStatsWidget />
              <SystemAlertsWidget />
              <ComplianceStatusWidget />
            </div>
        </DashboardLayout>
    );
};

const AdminUsers = () => {
    const { data, setLoading, showToast, fetchData, auth } = useAppContext();
    const { t } = useLanguage();
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'Issuer' });
    
    const handleRemove = async (userId) => {
        if(confirm('Are you sure you want to remove this user?')){
            setLoading(true);
            try { await api.removeUser(userId, auth.user); fetchData(); showToast('User removed'); }
            catch (error) { showToast(error.message, 'error'); } finally { setLoading(false); }
        }
    };
    
    const handleAddUser = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await api.addUser(newUser, auth.user); fetchData(); showToast('User added'); setIsAdding(false);
            setNewUser({ username: '', password: '', name: '', role: 'Issuer' });
        } catch (error) { showToast(error.message, 'error'); } finally { setLoading(false); }
    };

    return (
        <DashboardLayout title={t('userManagement')}>
             <div className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2 style={{fontWeight: 700, fontSize: '1.25rem'}}>{'System Users'}</h2>
                    <button className="btn btn-gradient" onClick={() => setIsAdding(!isAdding)}>{isAdding ? t('cancel') : 'Add User'}</button>
                </div>
                {isAdding && (
                    <form onSubmit={handleAddUser} style={{marginTop: '1.5rem'}}>
                        <div className="form-grid">
                            <input type="text" placeholder={t('username')} className="input" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required/>
                            <input type="password" placeholder={t('password')} className="input" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required/>
                            <input type="text" placeholder="Full Name" className="input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required/>
                            <select className="select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                <option>Issuer</option><option>Learner</option><option>Verifier</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-gradient" style={{marginTop: '1rem'}}>{t('save')}</button>
                    </form>
                )}
                 <div className="table-container">
                    <table className="table">
                        <thead><tr><th>Name</th><th>{t('username')}</th><th>Role</th><th>{t('actions')}</th></tr></thead>
                        <tbody>
                            {data.users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td><td>{user.username}</td>
                                    <td><span className="tag tag-info">{user.role}</span></td>
                                    <td>{user.role !== 'Admin' && <button className="btn btn-secondary" style={{color: 'var(--error)'}} onClick={() => handleRemove(user.id)}>{t('remove')}</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             </div>
        </DashboardLayout>
    );
};

const AdminLogs = () => {
    const { data } = useAppContext();
    return (
        <DashboardLayout title="Audit Logs">
            <div className="card">
                <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>System Activity</h2>
                 <div className="table-container">
                    <table className="table">
                        <thead><tr><th>Timestamp</th><th>User</th><th>Action</th></tr></thead>
                        <tbody>{data.logs.map(log => (<tr key={log.id}><td>{new Date(log.timestamp).toLocaleString()}</td><td>{log.user}</td><td>{log.action}</td></tr>))}</tbody>
                    </table>
                 </div>
            </div>
        </DashboardLayout>
    );
};

const AdminSettings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useAppContext();

  const handleBackup = () => {
    const dataStr = JSON.stringify(db, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verichain-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title={t('settings')}>
      <div className="card">
        <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('platformSettings')}</h2>
        <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="language">{t('language')}</label>
              <select id="language" className="select" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
              </select>
            </div>
            <div className="form-group">
                <label>{t('theme')}</label>
                <div className="theme-switch-wrapper">
                    <span>{t('light')}</span>
                    <label className="theme-switch">
                        <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                        <span className="slider"></span>
                    </label>
                    <span>{t('dark')}</span>
                </div>
            </div>
            <div className="form-group">
                <label>{t('backup')}</label>
                <button className="btn btn-secondary" onClick={handleBackup}>{t('downloadBackup')}</button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- USER SETTINGS PAGES ---

const GeneralSettingsCard = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useAppContext();
    return (
        <div className="card">
             <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('platformSettings')}</h2>
              <div className="settings-grid">
                <div className="form-group">
                  <label htmlFor="language">{t('language')}</label>
                  <select id="language" className="select" value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                  </select>
                </div>
                <div className="form-group">
                    <label>{t('theme')}</label>
                    <div className="theme-switch-wrapper">
                        <span>{t('light')}</span>
                        <label className="theme-switch">
                            <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                            <span className="slider"></span>
                        </label>
                        <span>{t('dark')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IssuerSettings = () => {
    const { auth, showToast, setLoading, updateAuthUser } = useAppContext();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: auth.user.name || '', email: auth.user.email || '' });
    const [logoPreview, setLogoPreview] = useState(auth.user.logo || null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const updatedData = { ...formData, logo: logoPreview };
            const updatedUser = await api.updateUser(auth.user.id, updatedData);
            updateAuthUser(updatedUser);
            showToast('Settings saved successfully!');
        } catch (error) { showToast(error.message, 'error'); }
        finally { setLoading(false); }
    };

    return (
        <DashboardLayout title={t('settings')}>
            <div className="settings-card-grid">
                <div className="card">
                    <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('profileSettings')}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('logo')}</label>
                            <div className="logo-uploader">
                                <img src={logoPreview || `https://ui-avatars.com/api/?name=${formData.name.replace(/\s/g, '+')}&background=random`} alt="Logo Preview" className="logo-uploader-preview" />
                                <div>
                                    <label htmlFor="logo-upload" className="btn btn-secondary">{t('uploadLogo')}</label>
                                    <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoChange} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">{t('instituteName')}</label>
                            <input type="text" id="name" name="name" className="input" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('contactEmail')}</label>
                            <input type="email" id="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-gradient">{t('save')}</button>
                    </form>
                </div>
                <GeneralSettingsCard />
            </div>
        </DashboardLayout>
    );
};

const LearnerSettings = () => {
    const { auth, showToast, setLoading, updateAuthUser } = useAppContext();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: auth.user.name || '', email: auth.user.email || '' });
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const updatedUser = await api.updateUser(auth.user.id, formData);
            updateAuthUser(updatedUser);
            showToast('Settings saved successfully!');
        } catch (error) { showToast(error.message, 'error'); }
        finally { setLoading(false); }
    };

    return (
        <DashboardLayout title={t('settings')}>
            <div className="settings-card-grid">
                <div className="card">
                    <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('profileSettings')}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">{t('fullName')}</label>
                            <input type="text" id="name" name="name" className="input" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{t('contactEmail')}</label>
                            <input type="email" id="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-gradient" style={{marginRight: '1rem'}}>{t('save')}</button>
                        <button type="button" className="btn btn-secondary" onClick={() => alert('DigiLocker integration coming soon!')}>{t('linkDigilocker')}</button>
                    </form>
                </div>
                <GeneralSettingsCard />
            </div>
        </DashboardLayout>
    );
};

const VerifierSettings = () => {
    const { auth, showToast, setLoading, updateAuthUser } = useAppContext();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: auth.user.name || '', organizationName: auth.user.organizationName || '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const updatedUser = await api.updateUser(auth.user.id, formData);
            updateAuthUser(updatedUser);
            showToast('Settings saved successfully!');
        } catch (error) { showToast(error.message, 'error'); }
        finally { setLoading(false); }
    };

    return (
        <DashboardLayout title={t('settings')}>
            <div className="settings-card-grid">
                <div className="card">
                     <h2 style={{fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem'}}>{t('profileSettings')}</h2>
                     <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="organizationName">{t('organizationName')}</label>
                            <input type="text" id="organizationName" name="organizationName" className="input" value={formData.organizationName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">{t('contactEmail')}</label>
                            <input type="text" id="name" name="name" className="input" value={formData.name} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-gradient">{t('save')}</button>
                    </form>
                </div>
                <GeneralSettingsCard />
            </div>
        </DashboardLayout>
    );
};

// --- MAIN APP COMPONENT (ROUTER) ---
const App = () => {
  const { auth } = useAppContext();
  const [route, setRoute] = useState(window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!auth.isAuthenticated) {
    if(route !== '#/login') window.location.hash = '#/login';
    return <LoginPage />;
  }
  
  const userRole = auth.user.role.toLowerCase();

  switch (route) {
    case '#/issuer':
        return userRole === 'issuer' ? <IssuerDashboard /> : (window.location.hash = `#/${userRole}`, null);
    case '#/issuer/settings':
        return userRole === 'issuer' ? <IssuerSettings /> : (window.location.hash = `#/${userRole}`, null);
    case '#/learner':
        return userRole === 'learner' ? <LearnerDashboard /> : (window.location.hash = `#/${userRole}`, null);
    case '#/learner/settings':
        return userRole === 'learner' ? <LearnerSettings /> : (window.location.hash = `#/${userRole}`, null);
    case '#/verifier':
        return userRole === 'verifier' ? <VerifierDashboard /> : (window.location.hash = `#/${userRole}`, null);
    case '#/verifier/settings':
        return userRole === 'verifier' ? <VerifierSettings /> : (window.location.hash = `#/${userRole}`, null);
    case '#/admin':
        return userRole === 'admin' ? <AdminDashboard /> : (window.location.hash = `#/${userRole}`, null);
    case '#/admin/users':
        return userRole === 'admin' ? <AdminUsers /> : (window.location.hash = `#/${userRole}`, null);
    case '#/admin/logs':
        return userRole === 'admin' ? <AdminLogs /> : (window.location.hash = `#/${userRole}`, null);
    case '#/admin/settings':
        return userRole === 'admin' ? <AdminSettings /> : (window.location.hash = `#/${userRole}`, null);
    default:
        const defaultPath = `#/${userRole}`;
        if(route !== defaultPath) { window.location.hash = defaultPath; }
        return null;
  }
};

// --- RENDER ---
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AppProvider>
  </React.StrictMode>
);