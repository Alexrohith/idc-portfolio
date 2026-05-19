console.log("Renderer file loaded");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  const fs = require("fs");
  const pdfParse = require("pdf-parse");

  const resumeInput = document.getElementById("resume");
  const fileName = document.getElementById("fileName");
  const generateBtn = document.getElementById("generateBtn");
  const output = document.getElementById("output");

  if (!resumeInput || !generateBtn || !output) {
    console.error("DOM elements not found");
    return;
  }

  let selectedFilePath = null;

  // ---------- SECTION PARSER ----------
  function parseResume(text) {
    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    const sections = {
      education: [],
      skills: [],
      projects: [],
      experience: [],
      others: []
    };

    let currentSection = "others";

    for (let line of lines) {
      const lower = line.toLowerCase();

      if (lower.includes("education")) {
        currentSection = "education";
        continue;
      }
      if (lower.includes("skill")) {
        currentSection = "skills";
        continue;
      }
      if (lower.includes("project")) {
        currentSection = "projects";
        continue;
      }
      if (lower.includes("experience") || lower.includes("intern")) {
        currentSection = "experience";
        continue;
      }

      sections[currentSection].push(line);
    }

    return sections;
  }

  // ---------- FILE HANDLING ----------
  resumeInput.addEventListener("change", () => {
    console.log("File input changed");

    if (resumeInput.files.length > 0) {
      const file = resumeInput.files[0];
      fileName.innerText = "Selected file: " + file.name;
      selectedFilePath = file.path;

      console.log("Selected file path:", selectedFilePath);
    }
  });

  // ---------- MAIN BUTTON ----------
  generateBtn.addEventListener("click", async () => {
    console.log("Read Resume clicked");

    if (!selectedFilePath) {
      alert("Please upload a PDF resume first!");
      return;
    }

    output.innerText = "Reading resume...";

    try {
      const buffer = fs.readFileSync(selectedFilePath);
      console.log("File read success");

      const data = await pdfParse(buffer);
      console.log("PDF parsed");

      const structured = parseResume(data.text);

      output.innerText = JSON.stringify(structured, null, 2);
      console.log("Resume structured successfully");
    } catch (err) {
      console.error("Processing error:", err);
      alert("Failed to process resume");
    }
  });
});
