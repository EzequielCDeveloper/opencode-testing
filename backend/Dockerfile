# ── Build stage ───────────────────────────────────────────────────────────────
# Uses golang:latest to match any go.mod toolchain requirement
FROM golang:latest AS builder

WORKDIR /app

# Copy vendor directory (no network downloads needed)
COPY go.mod go.sum ./
COPY vendor/ vendor/
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -mod=vendor -ldflags="-s -w" -o /chapitos-api ./cmd/api

# ── Runtime image (minimal) ───────────────────────────────────────────────────
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

COPY --from=builder /chapitos-api .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080
CMD ["./chapitos-api"]
