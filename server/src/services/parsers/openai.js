// server/src/services/parsers/openai.js
// CommonJS, OpenAI Responses API (Structured Outputs)
const OpenAI = require("openai");
const { ResumeSchema } = require("./schema");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function parseWithModel(text, locale, model) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const sys = [
    "Tu es un extracteur de CV. Respecte STRICTEMENT le schéma JSON fourni.",
    "Ne renvoie AUCUN texte hors JSON. N'invente pas. Laisse vide si inconnu.",
    "Langue source probable: " + (locale || "fr")
  ].join(" ");

  // Responses API — Structured Outputs via json_schema strict
  const response = await client.responses.create({
    model: model, // ex: 'gpt-4o-mini' ou 'gpt-4.1'
    input: [
      { role: "system", content: sys },
      {
        role: "user",
        content:
          "Analyse ce texte de CV et renvoie un JSON strictement conforme au schéma fourni.\n\n" +
          text.slice(0, 200000) // garde une marge
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "Resume",
        schema: ResumeSchema,
        strict: true
      }
    }
  });

  // Selon les versions SDK, on peut avoir output_parsed direct.
  const parsed = response.output_parsed
    ? response.output_parsed
    : JSON.parse(response.output?.[0]?.content?.[0]?.text || "{}");

  return parsed || {};
}

module.exports = { parseWithModel };
