package pdf

import (
	"bytes"
	"fmt"
	"time"

	"github.com/jung-kurt/gofpdf"

	"chapitos/backend/internal/domain/entity"
)

// GenerateReceipt produces a simple PDF receipt for a payment.
func GenerateReceipt(payment *entity.Payment, client *entity.Client) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(20, 20, 20)
	pdf.AddPage()

	// Header
	pdf.SetFont("Arial", "B", 20)
	pdf.SetTextColor(37, 99, 235)
	pdf.CellFormat(0, 12, "CHAPITOS GYM", "", 1, "C", false, 0, "")

	pdf.SetFont("Arial", "", 11)
	pdf.SetTextColor(100, 100, 100)
	pdf.CellFormat(0, 6, "Sistema de Gestión de Membresías", "", 1, "C", false, 0, "")
	pdf.Ln(4)

	// Title
	pdf.SetDrawColor(37, 99, 235)
	pdf.SetLineWidth(0.5)
	pdf.Line(20, pdf.GetY(), 190, pdf.GetY())
	pdf.Ln(4)

	pdf.SetFont("Arial", "B", 16)
	pdf.SetTextColor(30, 30, 30)
	pdf.CellFormat(0, 10, "RECIBO DE PAGO", "", 1, "C", false, 0, "")
	pdf.Ln(2)

	// Receipt info
	receiptNo := fmt.Sprintf("REC-%s", payment.ID[:8])
	row := func(label, value string) {
		pdf.SetFont("Arial", "B", 10)
		pdf.SetTextColor(80, 80, 80)
		pdf.CellFormat(60, 8, label+":", "", 0, "L", false, 0, "")
		pdf.SetFont("Arial", "", 10)
		pdf.SetTextColor(30, 30, 30)
		pdf.CellFormat(0, 8, value, "", 1, "L", false, 0, "")
	}

	row("Recibo No.", receiptNo)
	row("Fecha", payment.PaidAt.Format("02/01/2006 15:04"))
	row("ID Pago", payment.ID)
	pdf.Ln(4)

	// Client section
	pdf.SetFont("Arial", "B", 12)
	pdf.SetTextColor(37, 99, 235)
	pdf.CellFormat(0, 8, "DATOS DEL CLIENTE", "", 1, "L", false, 0, "")
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(20, pdf.GetY(), 190, pdf.GetY())
	pdf.Ln(4)

	row("Nombre", client.FullName())
	row("Email", client.Email)
	row("Teléfono", client.Phone)
	pdf.Ln(4)

	// Payment section
	pdf.SetFont("Arial", "B", 12)
	pdf.SetTextColor(37, 99, 235)
	pdf.CellFormat(0, 8, "DETALLES DEL PAGO", "", 1, "L", false, 0, "")
	pdf.SetDrawColor(200, 200, 200)
	pdf.Line(20, pdf.GetY(), 190, pdf.GetY())
	pdf.Ln(4)

	methodLabels := map[entity.PaymentMethod]string{
		entity.PaymentCash:         "Efectivo",
		entity.PaymentCard:         "Tarjeta",
		entity.PaymentBankTransfer: "Transferencia Bancaria",
	}

	row("Membresía ID", payment.MembershipID)
	row("Método de pago", methodLabels[payment.Method])
	if payment.Reference != "" {
		row("Referencia", payment.Reference)
	}

	pdf.Ln(4)

	// Total box
	pdf.SetFillColor(37, 99, 235)
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Arial", "B", 14)
	pdf.CellFormat(0, 12, fmt.Sprintf("TOTAL PAGADO: $%.2f MXN", payment.Amount), "", 1, "C", true, 0, "")
	pdf.Ln(8)

	// Footer
	pdf.SetTextColor(130, 130, 130)
	pdf.SetFont("Arial", "I", 9)
	pdf.CellFormat(0, 6, fmt.Sprintf("Generado el %s — Chapitos Gym", time.Now().Format("02/01/2006 15:04")), "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 6, "Este documento es un comprobante de pago interno.", "", 1, "C", false, 0, "")

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return nil, fmt.Errorf("generate pdf: %w", err)
	}
	return buf.Bytes(), nil
}

// GenerateReport produces a simple PDF report.
func GenerateReport(reportType string, data any, from, to string) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(20, 20, 20)
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 18)
	pdf.SetTextColor(37, 99, 235)
	pdf.CellFormat(0, 12, "CHAPITOS GYM — REPORTE", "", 1, "C", false, 0, "")

	pdf.SetFont("Arial", "", 11)
	pdf.SetTextColor(100, 100, 100)

	title := "Reporte de Expiraciones"
	if reportType == "revenue" {
		title = "Reporte de Ingresos"
	}
	pdf.CellFormat(0, 7, title, "", 1, "C", false, 0, "")
	pdf.CellFormat(0, 7, fmt.Sprintf("Período: %s — %s", from, to), "", 1, "C", false, 0, "")
	pdf.Ln(6)

	pdf.SetFont("Arial", "I", 10)
	pdf.SetTextColor(80, 80, 80)
	pdf.CellFormat(0, 6, fmt.Sprintf("Generado: %s", time.Now().Format("02/01/2006 15:04")), "", 1, "L", false, 0, "")

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
