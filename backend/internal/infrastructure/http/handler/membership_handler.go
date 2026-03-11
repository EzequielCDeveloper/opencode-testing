package handler

import (
	"errors"

	"github.com/gin-gonic/gin"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

type MembershipHandler struct {
	svc *application.MembershipService
}

func NewMembershipHandler(s *application.MembershipService) *MembershipHandler {
	return &MembershipHandler{svc: s}
}

func (h *MembershipHandler) Create(c *gin.Context) {
	var body struct {
		ClientID  string `json:"clientId"  binding:"required"`
		PlanID    string `json:"planId"    binding:"required"`
		PriceType string `json:"priceType" binding:"required"`
		StartDate string `json:"startDate" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		badRequest(c, err.Error())
		return
	}
	if body.PriceType != "standard" && body.PriceType != "student" {
		badRequest(c, "priceType must be 'standard' or 'student'")
		return
	}
	claims := middleware.GetClaims(c)
	m, err := h.svc.Create(c.Request.Context(), application.CreateMembershipInput{
		ClientID:  body.ClientID,
		PlanID:    body.PlanID,
		PriceType: entity.PriceType(body.PriceType),
		StartDate: body.StartDate,
		ActorID:   claims.UserID,
	})
	if err != nil {
		if errors.Is(err, application.ErrPlanNotFound) {
			notFound(c, "Membership plan not found")
			return
		}
		internal(c, err.Error())
		return
	}
	created(c, m)
}

func (h *MembershipHandler) Get(c *gin.Context) {
	m, err := h.svc.GetByID(c.Request.Context(), c.Param("membershipId"))
	if err != nil {
		if errors.Is(err, application.ErrMembershipNotFound) {
			notFound(c, "Membership not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, m)
}

func (h *MembershipHandler) List(c *gin.Context) {
	page, limit := parsePage(c)
	filter := repository.MembershipFilter{
		ClientID: c.Query("clientId"),
		Status:   c.Query("status"),
	}
	result, err := h.svc.List(c.Request.Context(), filter, page, limit)
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, result)
}

func (h *MembershipHandler) UpdateStatus(c *gin.Context) {
	var body struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		badRequest(c, err.Error())
		return
	}
	status := entity.MembershipStatus(body.Status)
	if status != entity.MembershipActive && status != entity.MembershipExpired && status != entity.MembershipCancelled {
		badRequest(c, "status must be active, expired or cancelled")
		return
	}
	claims := middleware.GetClaims(c)
	m, err := h.svc.UpdateStatus(c.Request.Context(), c.Param("membershipId"), status, claims.UserID)
	if err != nil {
		if errors.Is(err, application.ErrMembershipNotFound) {
			notFound(c, "Membership not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, m)
}
