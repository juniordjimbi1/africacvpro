// server/src/utils/cvParser.js

const rx = {
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  phone: /(\+?\d[\d\s().-]{7,}\d)/g,
  yearRange: /(?:(?:19|20)\d{2})\s?(?:[-–/]\s?(?:19|20)\d{2}|à\s?(?:19|20)\d{2})/i
};

const cleanup = (s) => (s || '').replace(/\r/g, '').trim();
const lines = (text) => cleanup(text).split('\n').map(l => l.trim()).filter(Boolean);

function parseCvTextToStructuredData(rawText) {
  const L = lines(rawText);

  // Personal
  const email = (rawText.match(rx.email) || [])[0] || '';
  const phones = Array.from(new Set(Array.from(rawText.matchAll(rx.phone)).map(m => m[1].trim())));
  const nameLine = L.find(l => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{4,}$/.test(l) && l.split(/\s+/).length >= 2) || '';
  const [firstName = '', ...rest] = nameLine.split(/\s+/);
  const lastName = rest.join(' ');

  // Profile summary
  const pIdx = L.findIndex(l => /^profil|profile|summary$/i.test(l));
  let profileSummary = '';
  if (pIdx >= 0) {
    const chunk = L.slice(pIdx + 1, pIdx + 6).join(' ');
    profileSummary = chunk.length > 600 ? chunk.slice(0, 600) : chunk;
  }

  // Skills
  const sIdx = L.findIndex(l => /^compétence|competence|skills?$/i.test(l));
  const skills = sIdx >= 0 ? L.slice(sIdx + 1, sIdx + 30).filter(x => x.length <= 80 && !/^\d/.test(x)).slice(0, 20).map(name => ({ name })) : [];

  // Languages
  const lIdx = L.findIndex(l => /^langues?|languages?$/i.test(l));
  const languages = lIdx >= 0 ? L.slice(lIdx + 1, lIdx + 15).filter(x => x.length <= 60).slice(0, 10).map(name => ({ name })) : [];

  // Interests
  const iIdx = L.findIndex(l => /^centres?\s*d[’']?int[ée]r[êe]ts?|interests?$/i.test(l));
  const interests = iIdx >= 0 ? L.slice(iIdx + 1, iIdx + 10).filter(x => x.length <= 80).slice(0, 10).map(name => ({ name })) : [];

  // Education (light)
  const education = [];
  L.forEach((l) => {
    if (/(bac|baccalaur|licence|master|bts|dut|ing[ée]nieur|doctorat|universit|école|institute)/i.test(l)) {
      const yr = (l.match(rx.yearRange) || [])[0] || '';
      education.push({ degree: l.replace(rx.yearRange, '').trim(), school: '', startDate: '', endDate: '', year: yr });
    }
  });

  // Experience (light)
  const experience = [];
  L.forEach((l) => {
    if (/(stage|stagiaire|assistant|chef|manager|ing[ée]nieur|technicien|développeur|vendeur|comptable|enseignant|professeur|superviseur|coordon)/i.test(l)) {
      const yr = (l.match(rx.yearRange) || [])[0] || '';
      experience.push({ title: l.replace(rx.yearRange, '').trim(), company: '', startDate: '', endDate: '', city: '', description: '', period: yr });
    }
  });

  return {
    personal: {
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      phone: phones[0] || '',
      phones
    },
    profile: { summary: profileSummary },
    education,
    experience,
    skills,
    languages,
    interests
  };
}

module.exports = { parseCvTextToStructuredData };
