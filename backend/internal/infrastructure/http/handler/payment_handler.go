package handler

import (
	"errors"
	"time"

	"github.com/gin-gonic/gin"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

type PaymentHandler struct{ svc *application.PaymentService }

func NewPaymentHandler(s *application.PaymentService) *PaymentHandler { return &PaymentHandler{svc: s} }

func (h *PaymentHandler) Create(c *gin.Context) {
	var body struct {
		ClientID     string  `json:"clientId"     binding:"required"`
		MembershipID string  `json:"membershipId" binding:"required"`
		Amount       float64 `json:"amount"       binding:"required,gt=0"`
		Method       string  `json:"method"       binding:"required"`
		Reference    string  `json:"reference"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		badRequest(c, err.Error())
		return
	}
	method := entity.PaymentMethod(body.Method)
	if method != entity.PaymentCash && method != entity.PaymentCard && method != entity.PaymentBankTransfer {
		badRequest(c, "method must be cash, card or bank_transfer")
		return
	}
	claims := middleware.GetClaims(c)
	p, err := h.svc.Create(c.Request.Context(), application.CreatePaymentInput{
		ClientID:     body.ClientID,
		MembershipID: body.MembershipID,
		Amount:       body.Amount,
		Method:       method,
		Reference:    body.Reference,
		ActorID:      claims.UserID,
	})
	if err != nil {
		internal(c, err.Error())
		return
	}
	created(c, p)
}

func (h *PaymentHandler) Get(c *gin.Context) {
	p, err := h.svc.GetByID(c.Request.Context(), c.Param("paymentId"))
	if err != nil {
		if errors.Is(err, application.ErrPaymentNotFound) {
			notFound(c, "Payment not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, p)
}

func (h *PaymentHandler) List(c *gin.Context) {
	page, limit := parsePage(c)
	filter := repository.PaymentFilter{ClientID: c.Query("clientId")}
	if f := c.Query("from"); f != "" {
		t, err := time.Parse("2006-01-02", f)
		if err == nil {
			filter.From = &t
		}
	}
	if f := c.Query("to"); f != "" {
		t, err := time.Parse("2006-01-02", f)
		if err == nil {
			// include full day
			end := t.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			filter.To = &end
		}
	}
	result, err := h.svc.List(c.Request.Context(), filter, page, limit)
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, result)
}

func (h *PaymentHandler) Receipt(c *gin.Context) {
	data, err := h.svc.GenerateReceipt(c.Request.Context(), c.Param("paymentId"))
	if err != nil {
		if errors.Is(err, application.ErrPaymentNotFound) {
			notFound(c, "Payment not found")
			return
		}
		internal(c, "Could not generate receipt")
		return
	}
	c.Header("Content-Disposition", "attachment; filename=receipt.pdf")
	c.Data(200, "application/pdf", data)
}
