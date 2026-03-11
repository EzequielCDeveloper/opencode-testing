package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	JWTHours    int
	Env         string
	// Email (optional)
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string
}

func Load() (*Config, error) {
	jwtHours, _ := strconv.Atoi(getEnv("JWT_HOURS", "14"))
	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))

	cfg := &Config{
		Port:         getEnv("PORT", "8080"),
		DatabaseURL:  buildDatabaseURL(),
		JWTSecret:    getEnv("JWT_SECRET", "chapitos-secret-change-in-production"),
		JWTHours:     jwtHours,
		Env:          getEnv("ENV", "development"),
		SMTPHost:     getEnv("SMTP_HOST", ""),
		SMTPPort:     smtpPort,
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", ""),
	}
	return cfg, nil
}

func buildDatabaseURL() string {
	if url := os.Getenv("DATABASE_URL"); url != "" {
		return url
	}
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "chapitos")
	pass := getEnv("DB_PASSWORD", "chapitos")
	name := getEnv("DB_NAME", "chapitos_db")
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, name)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
