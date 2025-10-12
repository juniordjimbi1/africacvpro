// server/src/services/ocr/vision.js
// OCR images (JPG/PNG) avec Google Cloud Vision REST (no extra lib)
const fs = require("fs");

async function ocrImageWithVision(filePath) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_VISION_API_KEY missing");

  const imageBytes = fs.readFileSync(filePath).toString("base64");

  const body = {
    requests: [
      {
        image: { content: imageBytes },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
      }
    ]
  };

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
  const json = await res.json();
  const text = json?.responses?.[0]?.fullTextAnnotation?.text || "";
  return text;
}

module.exports = { ocrImageWithVision };
