package application

import (
	"context"
	"time"

	"github.com/google/uuid"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

// writeAudit is a fire-and-forget audit helper shared across services.
func writeAudit(ctx context.Context, repo repository.AuditRepository, userID, action, ent, entityID string) {
	log := &entity.AuditLog{
		ID:        uuid.New().String(),
		UserID:    userID,
		Action:    action,
		Entity:    ent,
		EntityID:  entityID,
		CreatedAt: time.Now(),
	}
	_ = repo.Create(ctx, log)
}
