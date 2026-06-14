package com.aprende.ues.backend.service;

import com.aprende.ues.backend.model.Certificate;
import com.aprende.ues.backend.model.Enrollment;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

final class CertificatePdfRenderer {

    private CertificatePdfRenderer() {
    }

    static byte[] render(Certificate certificate) throws IOException {
        Enrollment enrollment = certificate.getEnrollment();
        String studentName = fullName(enrollment);
        String courseTitle = enrollment.getCourse().getTitle();
        String issuedAt = certificate.getIssuedAt().toLocalDate().toString();

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDRectangle pageSize = new PDRectangle(PDRectangle.LETTER.getHeight(), PDRectangle.LETTER.getWidth());
            PDPage page = new PDPage(pageSize);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                drawCertificate(document, content, pageSize, studentName, courseTitle, issuedAt, certificate.getCode());
            }

            document.save(output);
            return output.toByteArray();
        }
    }

    private static void drawCertificate(
            PDDocument document,
            PDPageContentStream content,
            PDRectangle pageSize,
            String studentName,
            String courseTitle,
            String issuedAt,
            String certificateCode
    ) throws IOException {
        float width = pageSize.getWidth();
        float height = pageSize.getHeight();
        float margin = 28;
        PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
        PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD);
        PDType1Font italic = new PDType1Font(Standard14Fonts.FontName.TIMES_ITALIC);
        PDType1Font sans = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        PDType1Font sansBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

        content.setNonStrokingColor(new Color(255, 253, 248));
        content.addRect(0, 0, width, height);
        content.fill();

        content.setStrokingColor(new Color(108, 22, 37));
        content.setLineWidth(3);
        content.addRect(margin, margin, width - (margin * 2), height - (margin * 2));
        content.stroke();
        content.setLineWidth(1.2f);
        content.addRect(margin + 12, margin + 12, width - ((margin + 12) * 2), height - ((margin + 12) * 2));
        content.stroke();

        content.setNonStrokingColor(new Color(95, 16, 32));
        drawSkewedBand(content, margin + 30, height - margin - 8, 250, 14, 30);
        drawSkewedBand(content, width - margin - 280, margin - 6, 250, 14, 30);

        content.setNonStrokingColor(new Color(248, 240, 236));
        drawCenteredText(content, "UES", sansBold, 152, width / 2, 220);

        drawLogo(document, content, width / 2, height - 64);

        content.setNonStrokingColor(new Color(33, 27, 27));
        drawCenteredText(content, "Universidad de El Salvador", bold, 26, width / 2, height - 182);
        drawCenteredText(content, "Aprende UES", bold, 17, width / 2, height - 207);
        drawCenteredText(content, "Por cuanto:", regular, 19, width / 2, height - 249);

        float studentSize = fitFontSize(studentName, bold, 36, 24, width - 170);
        drawCenteredText(content, studentName, bold, studentSize, width / 2, height - 295);
        drawLine(content, width / 2 - 260, height - 303, width / 2 + 260, height - 303, 33, 27, 27, 1);

        drawCenteredText(content, "ha finalizado el curso", italic, 21, width / 2, height - 353);

        content.setNonStrokingColor(new Color(108, 22, 37));
        List<String> courseLines = wrapText(courseTitle, bold, 28, width - 190);
        float courseY = height - 394;
        for (String line : courseLines) {
            drawCenteredText(content, line, bold, 28, width / 2, courseY);
            courseY -= 34;
        }

        content.setNonStrokingColor(new Color(33, 27, 27));
        drawCenteredText(content, "Por tanto, se extiende el presente certificado de finalizacion", regular, 15, width / 2, 164);
        drawCenteredText(content, "en Ciudad Universitaria, el " + issuedAt + ".", regular, 15, width / 2, 144);

        drawLine(content, 86, 86, 304, 86, 45, 41, 41, .8f);
        drawCenteredText(content, "Coordinacion academica", regular, 12, 195, 68);
        drawLine(content, width - 304, 86, width - 86, 86, 45, 41, 41, .8f);
        drawCenteredText(content, "Universidad de El Salvador", regular, 12, width - 195, 68);
        drawCenteredText(content, "Codigo de verificacion", sans, 10, width / 2, 82);
        drawCenteredText(content, certificateCode, sansBold, 11, width / 2, 66);
    }

    private static void drawLogo(PDDocument document, PDPageContentStream content, float centerX, float topY) throws IOException {
        PDImageXObject logo = loadUesLogo(document);
        float logoWidth = 58;
        float logoHeight = logoWidth * logo.getHeight() / logo.getWidth();
        content.drawImage(logo, centerX - (logoWidth / 2), topY - logoHeight, logoWidth, logoHeight);
    }

    private static PDImageXObject loadUesLogo(PDDocument document) throws IOException {
        try (InputStream input = CertificatePdfRenderer.class.getResourceAsStream("/assets/ues-logo.png")) {
            if (input == null) {
                throw new IOException("No se encontro el logo UES en /assets/ues-logo.png");
            }
            return PDImageXObject.createFromByteArray(document, input.readAllBytes(), "ues-logo");
        }
    }

    private static void drawSkewedBand(PDPageContentStream content, float x, float y, float width, float height, float skew) throws IOException {
        content.moveTo(x, y);
        content.lineTo(x + width, y);
        content.lineTo(x + width - skew, y - height);
        content.lineTo(x - skew, y - height);
        content.closePath();
        content.fill();
    }

    private static void drawLine(PDPageContentStream content, float startX, float startY, float endX, float endY, int red, int green, int blue, float width) throws IOException {
        content.setStrokingColor(new Color(red, green, blue));
        content.setLineWidth(width);
        content.moveTo(startX, startY);
        content.lineTo(endX, endY);
        content.stroke();
    }

    private static void drawCenteredText(PDPageContentStream content, String text, PDType1Font font, float fontSize, float centerX, float baselineY) throws IOException {
        float textWidth = font.getStringWidth(pdfText(text)) / 1000 * fontSize;
        content.beginText();
        content.setFont(font, fontSize);
        content.newLineAtOffset(centerX - (textWidth / 2), baselineY);
        content.showText(pdfText(text));
        content.endText();
    }

    private static float fitFontSize(String text, PDType1Font font, float preferred, float minimum, float maxWidth) throws IOException {
        float size = preferred;
        while (size > minimum && font.getStringWidth(pdfText(text)) / 1000 * size > maxWidth) {
            size -= 1;
        }
        return size;
    }

    private static List<String> wrapText(String text, PDType1Font font, float fontSize, float maxWidth) throws IOException {
        String[] words = pdfText(text).split("\\s+");
        List<String> lines = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (String word : words) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (font.getStringWidth(candidate) / 1000 * fontSize <= maxWidth) {
                current = new StringBuilder(candidate);
            } else {
                if (!current.isEmpty()) {
                    lines.add(current.toString());
                }
                current = new StringBuilder(word);
            }
        }

        if (!current.isEmpty()) {
            lines.add(current.toString());
        }

        return lines.stream().limit(3).toList();
    }

    private static String pdfText(String value) {
        if (value == null) return "";
        return value.replace("\r", " ").replace("\n", " ").replaceAll("\\s+", " ").trim();
    }

    private static String fullName(Enrollment enrollment) {
        return (enrollment.getUser().getFirstName() + " " + enrollment.getUser().getLastName()).trim();
    }
}
