function detectLanguage(text) {
  return /[\u0B80-\u0BFF]/.test(text) ? "ta" : "en";
}

export async function chatWithAI(req, res) {
  const { message } = req.body;
  const lang = detectLanguage(message.toLowerCase());

  let reply = "";

  if (message.toLowerCase().includes("english")) {
    reply =
      lang === "ta"
        ? "Power My English என்பது 12 வார LIVE English & confidence training program."
        : "Power My English is a 12-week LIVE English & confidence training program.";
  } else if (message.toLowerCase().includes("affiliate")) {
    reply =
      lang === "ta"
        ? "Affiliate Marketing program முற்றிலும் FREE."
        : "Our Affiliate Marketing program is 100% FREE.";
  } else if (message.toLowerCase().includes("price")) {
    reply =
      lang === "ta"
        ? "முதல் 3 வாரங்கள் ₹1000 மட்டுமே."
        : "First 3 weeks are just ₹1000.";
  } else {
    reply =
      lang === "ta"
        ? "English course, Affiliate program அல்லது Registration பற்றி கேளுங்கள்."
        : "You can ask about English course, Affiliate program, or Registration.";
  }

  res.json({ reply });
}
