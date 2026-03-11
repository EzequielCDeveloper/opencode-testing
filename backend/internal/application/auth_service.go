package application

import (
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type AuthService struct {
	users     repository.UserRepository
	jwtSecret string
	jwtHours  int
}

func NewAuthService(u repository.UserRepository, secret string, hours int) *AuthService {
	return &AuthService{users: u, jwtSecret: secret, jwtHours: hours}
}

type LoginResult struct {
	AccessToken string
	ExpiresIn   int
	User        *entity.User
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*LoginResult, error) {
	user, err := s.users.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}
	token, err := middleware.GenerateToken(user, s.jwtSecret, s.jwtHours)
	if err != nil {
		return nil, err
	}
	return &LoginResult{
		AccessToken: token,
		ExpiresIn:   s.jwtHours * 3600,
		User:        user,
	}, nil
}

func (s *AuthService) GetUser(ctx context.Context, id string) (*entity.User, error) {
	return s.users.FindByID(ctx, id)
}
