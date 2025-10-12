// server/src/services/parsers/schema.js
// JSON Schema strict, aligné sur tes sections (editor/preview)
module.exports.ResumeSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Resume",
  type: "object",
  additionalProperties: false,
  properties: {
    personal: {
      type: "object",
      additionalProperties: true,
      properties: {
        firstName: { type: "string" },
        lastName:  { type: "string" },
        email:     { type: "string" },
        phone:     { type: "string" },
        jobTitle:  { type: "string" },
        address:   { type: "string" },
        city:      { type: "string" },
        website:   { type: "string" },
        linkedin:  { type: "string" },
        nationality:{ type: "string" },
        birthDate: { type: "string" },
        birthPlace:{ type: "string" },
        driving:   { type: "string" }
      },
      required: ["firstName","lastName"]
    },
    profile: {
      type: "object",
      additionalProperties: true,
      properties: { summary: { type: "string" } }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          field:  { type: "string" },
          city:   { type: "string" },
          startDate: { type: "string" }, // YYYY-MM ou YYYY
          endDate:   { type: "string" },
          description: { type: "string" }
        }
      }
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          city: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "string" }
        }
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        additionalProperties: true,
        properties: {
          name: { type: "string" },
          level: { type: "integer", minimum: 1, maximum: 5 }
        }
      }
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        additionalProperties: true,
        properties: {
          name: { type: "string" },
          level: { type: "string" } // FR/EN/ES : "Débutant"|"Intermédiaire"|"Avancé"|"Courant"
        }
      }
    },
    interests: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        additionalProperties: true,
        properties: { name: { type: "string" } }
      }
    }
  },
  required: ["personal"]
};
