package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type meta struct {
	RequestID string `json:"requestId"`
	Timestamp string `json:"timestamp"`
}

func newMeta() meta {
	return meta{RequestID: "req_" + uuid.New().String()[:8], Timestamp: time.Now().UTC().Format(time.RFC3339)}
}

func ok(c *gin.Context, data any) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": data, "meta": newMeta()})
}

func created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, gin.H{"success": true, "data": data, "meta": newMeta()})
}

func noContent(c *gin.Context) { c.Status(http.StatusNoContent) }

func badRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"error":   gin.H{"code": "BAD_REQUEST", "message": msg},
		"meta":    newMeta(),
	})
}

func notFound(c *gin.Context, msg string) {
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"error":   gin.H{"code": "NOT_FOUND", "message": msg},
		"meta":    newMeta(),
	})
}

func conflict(c *gin.Context, msg string) {
	c.JSON(http.StatusConflict, gin.H{
		"success": false,
		"error":   gin.H{"code": "CONFLICT", "message": msg},
		"meta":    newMeta(),
	})
}

func internal(c *gin.Context, msg string) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"success": false,
		"error":   gin.H{"code": "INTERNAL_ERROR", "message": msg},
		"meta":    newMeta(),
	})
}

func parsePage(c *gin.Context) (int, int) {
	page, limit := 1, 20
	if v := c.Query("page"); v != "" {
		if n, err := parseInt(v); err == nil && n > 0 {
			page = n
		}
	}
	if v := c.Query("limit"); v != "" {
		if n, err := parseInt(v); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}
	return page, limit
}

func parseInt(s string) (int, error) {
	var n int
	_, err := fmt.Sscanf(s, "%d", &n)
	return n, err
}
