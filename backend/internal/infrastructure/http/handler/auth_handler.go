package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

type AuthHandler struct{ svc *application.AuthService }

func NewAuthHandler(s *application.AuthService) *AuthHandler { return &AuthHandler{svc: s} }

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	result, err := h.svc.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		if errors.Is(err, application.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"code": "UNAUTHORIZED", "message": "Invalid email or password"},
				"meta":    newMeta(),
			})
			return
		}
		internal(c, "Login failed")
		return
	}

	ok(c, gin.H{
		"accessToken": result.AccessToken,
		"expiresIn":   result.ExpiresIn,
		"user": gin.H{
			"id":    result.User.ID,
			"name":  result.User.Name,
			"email": result.User.Email,
			"role":  result.User.Role,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) { noContent(c) }

func (h *AuthHandler) Me(c *gin.Context) {
	claims := middleware.GetClaims(c)
	if claims == nil {
		badRequest(c, "No auth claims")
		return
	}
	user, err := h.svc.GetUser(c.Request.Context(), claims.UserID)
	if err != nil || user == nil {
		notFound(c, "User not found")
		return
	}
	ok(c, gin.H{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	})
}
