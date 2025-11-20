// src/utils/cvViewModel.js

// Join sécurisé
const joinNonEmpty = (parts, sep = " ") =>
  (parts || [])
    .map((p) => (p || "").toString().trim())
    .filter(Boolean)
    .join(sep);

/**
 * Normalise le cvData brut en une vue propre pour les templates.
 */
export function buildCvViewModel(cvData) {
  const data = cvData || {};
  const p = data.personal || {};
  const personalInfo = data.personalInfo || {};

  // --- IDENTITÉ ----------------------------------------------------

  const firstName =
    (p.firstName && p.firstName.toString().trim()) ||
    (data.firstName && data.firstName.toString().trim()) ||
    "";

  const lastName =
    (p.lastName && p.lastName.toString().trim()) ||
    (data.lastName && data.lastName.toString().trim()) ||
    "";

  // fullName : priorité au personal.fullName, puis data.fullName, sinon first + last
  const fullName =
    (p.fullName && p.fullName.toString().trim()) ||
    (data.fullName && data.fullName.toString().trim()) ||
    joinNonEmpty([firstName, lastName], " ") ||
    "";

  // Emploi recherché / titre du CV
  const title =
    (p.jobTitle && p.jobTitle.toString().trim()) || // emploi recherché saisi par l'utilisateur
    (data.jobTitle && data.jobTitle.toString().trim()) || // éventuel jobTitle à la racine
    (p.title && p.title.toString().trim()) || // fallback sur un champ title perso
    (data.targetJob && data.targetJob.toString().trim()) || // éventuel champ "target job"
    (data.title && data.title.toString().trim()) || // en dernier : titre du document ("Mon CV")
    "";

  const email =
    (p.email && p.email.toString().trim()) ||
    (personalInfo.email && personalInfo.email.toString().trim()) ||
    (data.email && data.email.toString().trim()) ||
    "";

  const phone =
    (p.phone && p.phone.toString().trim()) ||
    (personalInfo.phone && personalInfo.phone.toString().trim()) ||
    (data.phone && data.phone.toString().trim()) ||
    "";

  const address =
    (p.address && p.address.toString().trim()) ||
    (personalInfo.address && personalInfo.address.toString().trim()) ||
    (data.address && data.address.toString().trim()) ||
    "";

  const city =
    (p.city && p.city.toString().trim()) ||
    (personalInfo.city && personalInfo.city.toString().trim()) ||
    (data.city && data.city.toString().trim()) ||
    "";

  const birthDate = p.birthDate || personalInfo.birthDate || data.birthDate || "";
  const birthPlace = p.birthPlace || personalInfo.birthPlace || data.birthPlace || "";
  const nationality =
    p.nationality || personalInfo.nationality || data.nationality || "";
  const driving =
    p.driving || personalInfo.driving || data.driving || data.drivingLicense || "";

  const website =
    (p.website && p.website.toString().trim()) ||
    (data.website && data.website.toString().trim()) ||
    "";
  const linkedin =
    (p.linkedin && p.linkedin.toString().trim()) ||
    (data.linkedin && data.linkedin.toString().trim()) ||
    "";

  const photoUrl =
    data.photoUrl ||
    p.photoUrl ||
    personalInfo.photoUrl ||
    p.photo || // prise en compte d'un éventuel champ photo brut
    data.photo ||
    "";

  const customFields = Array.isArray(p.customFields)
    ? p.customFields
    : Array.isArray(personalInfo.customFields)
    ? personalInfo.customFields
    : Array.isArray(data.customFields)
    ? data.customFields
    : [];

  const identity = {
    firstName,
    lastName,
    fullName,
    title,
    email,
    phone,
    address,
    city,
    birthDate,
    birthPlace,
    nationality,
    driving,
    website,
    linkedin,
    photoUrl,
    customFields,
  };

  // --- SECTIONS ----------------------------------------------------

  const profileText =
    (data.profile &&
      (data.profile.summary || data.profile.text || data.profile.description)) ||
    data.profileText ||
    "";

  const sections = {
    profile: {
      text: profileText || "",
    },

    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    interests: Array.isArray(data.interests) ? data.interests : [],

    customSections: Array.isArray(data.customSections)
      ? data.customSections
      : [],
  };

  // --- DEBUG -------------------------------------------------------

  if (typeof window !== "undefined") {
    // Utile pour vérifier ce qui arrive vraiment au template
    console.log("[buildCvViewModel] input cvData:", data);
    console.log("[buildCvViewModel] identity:", identity);
    console.log("[buildCvViewModel] sections keys:", Object.keys(sections));
  }

  return {
    identity,
    sections,
    raw: data,
  };
}
