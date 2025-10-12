// server/src/services/parsers/provider.js
// Orchestration: LLM si dispo, sinon heuristique
const { parseCvTextToStructuredData } = require('../../utils/cvParser');

const PRIMARY = process.env.RESUME_PARSER_MODEL_PRIMARY || "gpt-4o-mini";
const FALLBACK = process.env.RESUME_PARSER_MODEL_FALLBACK || "gpt-4.1";

let llm = null;
function getLlm() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (llm) return llm;
  try {
    llm = require('./openai'); // charge seulement si on a une clé
    return llm;
  } catch (e) {
    console.warn('[parser] OpenAI SDK manquant. Fallback heuristique.');
    return null;
  }
}

// critères de complétude simple
function scoreCompleteness(data) {
  if (!data || typeof data !== "object") return 0;
  const personalOK = !!(data.personal && (data.personal.email || data.personal.phone));
  const expCount = Array.isArray(data.experience) ? data.experience.length : 0;
  const eduCount = Array.isArray(data.education) ? data.education.length : 0;
  const skillsCount = Array.isArray(data.skills) ? data.skills.length : 0;

  let ok = 0, total = 3;
  if (personalOK) ok++;
  if (expCount > 0 || eduCount > 0) ok++;
  if (skillsCount >= 3) ok++;

  return ok / total; // 0..1
}

async function parse(text, locale) {
  const llmProvider = getLlm();
  if (!llmProvider) {
    console.log('[parser] LLM indisponible → heuristique regex');
    return parseCvTextToStructuredData(text);
  }

  try {
    console.log(`[parser] LLM PRIMARY=${PRIMARY}`);
    let first = await llmProvider.parseWithModel(text, locale, PRIMARY);
    if (scoreCompleteness(first) >= 0.6) return first;

    console.log(`[parser] PRIMARY incomplet → FALLBACK=${FALLBACK}`);
    let second = await llmProvider.parseWithModel(text, locale, FALLBACK);

    return scoreCompleteness(second) >= scoreCompleteness(first) ? second : first;
  } catch (e) {
    console.warn('[parser] Erreur LLM → heuristique regex', e?.message || e);
    return parseCvTextToStructuredData(text);
  }
}

module.exports = { parse };
