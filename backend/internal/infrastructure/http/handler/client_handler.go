package handler

import (
	"errors"

	"github.com/gin-gonic/gin"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

type ClientHandler struct{ svc *application.ClientService }

func NewClientHandler(s *application.ClientService) *ClientHandler { return &ClientHandler{svc: s} }

type clientBody struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName"  binding:"required"`
	BirthDate string `json:"birthDate" binding:"required"`
	Phone     string `json:"phone"     binding:"required"`
	Email     string `json:"email"     binding:"required,email"`
	Address   string `json:"address"`
}

func (h *ClientHandler) Create(c *gin.Context) {
	var body clientBody
	if err := c.ShouldBindJSON(&body); err != nil {
		badRequest(c, err.Error())
		return
	}
	claims := middleware.GetClaims(c)
	client, err := h.svc.Create(c.Request.Context(), application.CreateClientInput{
		FirstName: body.FirstName,
		LastName:  body.LastName,
		BirthDate: body.BirthDate,
		Phone:     body.Phone,
		Email:     body.Email,
		Address:   body.Address,
		ActorID:   claims.UserID,
	})
	if err != nil {
		internal(c, err.Error())
		return
	}
	created(c, client)
}

func (h *ClientHandler) Get(c *gin.Context) {
	client, err := h.svc.GetByID(c.Request.Context(), c.Param("clientId"))
	if err != nil {
		if errors.Is(err, application.ErrClientNotFound) {
			notFound(c, "Client not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, client)
}

func (h *ClientHandler) List(c *gin.Context) {
	page, limit := parsePage(c)
	filter := repository.ClientFilter{
		Search: c.Query("search"),
		Status: c.Query("status"),
	}
	result, err := h.svc.List(c.Request.Context(), filter, page, limit)
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, result)
}

func (h *ClientHandler) Update(c *gin.Context) {
	var body clientBody
	if err := c.ShouldBindJSON(&body); err != nil {
		badRequest(c, err.Error())
		return
	}
	claims := middleware.GetClaims(c)
	client, err := h.svc.Update(c.Request.Context(), c.Param("clientId"), application.UpdateClientInput{
		FirstName: body.FirstName,
		LastName:  body.LastName,
		BirthDate: body.BirthDate,
		Phone:     body.Phone,
		Email:     body.Email,
		Address:   body.Address,
		ActorID:   claims.UserID,
	})
	if err != nil {
		if errors.Is(err, application.ErrClientNotFound) {
			notFound(c, "Client not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, client)
}

func (h *ClientHandler) Deactivate(c *gin.Context) {
	claims := middleware.GetClaims(c)
	client, err := h.svc.Deactivate(c.Request.Context(), c.Param("clientId"), claims.UserID)
	if err != nil {
		if errors.Is(err, application.ErrClientNotFound) {
			notFound(c, "Client not found")
			return
		}
		internal(c, err.Error())
		return
	}
	ok(c, client)
}
