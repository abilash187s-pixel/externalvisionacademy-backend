import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateRegistrationPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(
      process.cwd(),
      "tmp",
      `registration-${data._id}.pdf`
    );

    // Ensure tmp folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    /* ===== HEADER ===== */
    doc
      .fontSize(22)
      .fillColor("#0f172a")
      .text("External Vision Academy", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor("#475569")
      .text("Registration Confirmation", { align: "center" });

    doc.moveDown(1.5);

    /* ===== CARD BACKGROUND ===== */
    const cardTop = doc.y;
    doc
      .roundedRect(40, cardTop, 520, 300, 12)
      .fill("#f8fafc");

    doc.fillColor("#0f172a");

    doc.moveDown(1);

    /* ===== CONTENT ===== */
    doc
      .fontSize(16)
      .text("Student Details", 60, cardTop + 20);

    doc.moveDown(1);

    const details = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["WhatsApp", data.whatsapp],
      ["Location", data.location],
      ["Age", data.age],
      ["Preferred Program", data.preferredOption],
      ["Registered On", new Date(data.receivedAt).toLocaleString()],
    ];

    details.forEach(([label, value]) => {
      doc
        .fontSize(11)
        .fillColor("#475569")
        .text(label, { continued: true })
        .fillColor("#0f172a")
        .text(` : ${value}`);
      doc.moveDown(0.4);
    });

    /* ===== FOOTER ===== */
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor("#64748b")
      .text(
        "This document confirms your registration with External Vision Academy.\nFor any support, contact us at externalvisionacademy@gmail.com",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}
