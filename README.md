# Auditoría de Seguridad - Chapitos Team Membresias

**Fecha de auditoría:** 2026-03-10  
**Auditor:** Sistema de Auditoría Automatizado  
**Versión del proyecto:** MVP  

---

## Resumen Ejecutivo

Se identificaron **24 vulnerabilidades** de seguridad en el proyecto, clasificadas por severidad:

| Severidad | Cantidad |
|-----------|----------|
| CRITICA   | 4        |
| ALTA      | 8        |
| MEDIA     | 9        |
| BAJA      | 3        |

---

## Iteración 1: Vulnerabilidades Detectadas

### [CRITICA-001] JWT Secret Hardcodeado con Valor por Defecto Inseguro

**Ubicación:** `backend/internal/config/config.go:30`

**Descripción:**  
El JWT secret tiene un valor por defecto hardcodeado que se usa si no se configura la variable de entorno.

```go
JWTSecret: getEnv("JWT_SECRET", "chapitos-secret-change-in-production"),
```

**Impacto:**  
Un atacante que conozca este valor por defecto podría falsificar tokens JWT válidos y obtener acceso no autorizado al sistema.

**Recomendación:**  
- Eliminar el valor por defecto y forzar la configuración de la variable de entorno
- Fallar el arranque de la aplicación si JWT_SECRET no está configurado
- Usar un secret de al menos 256 bits generado criptográficamente

---

### [CRITICA-002] Credenciales de Base de Datos Hardcodeadas

**Ubicación:** 
- `backend/internal/config/config.go:48-50`
- `docker-compose.yml:9,32`

**Descripción:**  
Las credenciales de PostgreSQL están hardcodeadas en múltiples lugares:

```go
user := getEnv("DB_USER", "chapitos")
pass := getEnv("DB_PASSWORD", "chapitos")
```

```yaml
POSTGRES_PASSWORD: chapitos
DATABASE_URL: postgres://chapitos:chapitos@db:5432/chapitos_db?sslmode=disable
```

**Impacto:**  
Credenciales predecibles que podrían ser explotadas si el servidor de base de datos es accesible.

**Recomendación:**  
- Usar variables de entorno sin valores por defecto para producción
- Implementar rotación de credenciales
- Usar secrets management (HashiCorp Vault, AWS Secrets Manager, etc.)

---

### [CRITICA-003] SSL/TLS Deshabilitado para Conexión a Base de Datos

**Ubicación:** `backend/internal/config/config.go:51`

**Descripción:**  
La conexión a PostgreSQL se realiza sin cifrado SSL:

```go
return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, name)
```

**Impacto:**  
Las credenciales y datos se transmiten en texto plano, vulnerables a ataques de tipo Man-in-the-Middle.

**Recomendación:**  
- Cambiar `sslmode=disable` a `sslmode=require` o `sslmode=verify-full`
- Configurar certificados SSL para PostgreSQL
- Documentar la configuración SSL requerida

---

### [CRITICA-004] Contraseña de Administrador Débil en Seed

**Ubicación:** `backend/migrations/001_init.sql:108-117`

**Descripción:**  
Se crea un usuario admin con contraseña predecible "Admin1234!":

```sql
-- Default admin user  (password: Admin1234!)
INSERT INTO users (id, name, email, password_hash, role, active)
VALUES (
    'usr_admin',
    'System Admin',
    'admin@chapitosgym.com',
    '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa',
    'admin',
    TRUE
)
```

**Impacto:**  
Acceso inicial predecible que podría ser explotado en producción si no se cambia.

**Recomendación:**  
- No incluir usuarios admin en migraciones de producción
- Implementar proceso de setup inicial seguro
- Forzar cambio de contraseña en primer inicio

---

### [ALTA-001] CORS Configurado con Wildcard (AllowedOrigins: *)

**Ubicación:** `backend/internal/infrastructure/http/router/router.go:86-91`

**Descripción:**  
CORS permite cualquier origen:

```go
c := cors.New(cors.Options{
    AllowedOrigins:   []string{"*"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Authorization", "Content-Type"},
    AllowCredentials: false,
})
```

**Impacto:**  
Permite ataques Cross-Site Request Forgery (CSRF) desde cualquier dominio.

**Recomendación:**  
- Configurar orígenes específicos permitidos
- Usar variable de entorno para definir dominios permitidos
- Implementar protección CSRF adicional

---

### [ALTA-002] Ausencia de Rate Limiting

**Ubicación:** Todo el backend

**Descripción:**  
No existe implementación de rate limiting en ningún endpoint, incluyendo el de autenticación `/auth/login`.

**Impacto:**  
- Vulnerable a ataques de fuerza bruta en login
- Posible denegación de servicio (DoS)
- Sin protección contra scraping de datos

**Recomendación:**  
- Implementar rate limiting por IP y por usuario
- Limitar intentos de login (ej: 5 intentos por minuto)
- Usar middleware como `gin-contrib/ratelimit` o `ulule/limiter`

---

### [ALTA-003] Tokens JWT Sin Mecanismo de Revocación

**Ubicación:** 
- `backend/internal/infrastructure/http/middleware/auth.go`
- `backend/internal/infrastructure/http/handler/auth_handler.go:53`

**Descripción:**  
El endpoint de logout no invalida realmente el token:

```go
func (h *AuthHandler) Logout(c *gin.Context) { noContent(c) }
```

**Impacto:**  
Los tokens permanecen válidos hasta su expiración, incluso después del logout.

**Recomendación:**  
- Implementar blacklist de tokens (Redis)
- Usar tokens de corta duración con refresh tokens
- Considerar JWT stateless con tokens de sesión

---

### [ALTA-004] Exposición de Errores Internos al Cliente

**Ubicación:** Múltiples handlers en `backend/internal/infrastructure/http/handler/`

**Descripción:**  
Los errores internos se exponen directamente al cliente:

```go
// client_handler.go:44
internal(c, err.Error())

// payment_handler.go:46
internal(c, err.Error())
```

**Impacto:**  
Fuga de información sensible como estructura de la base de datos, rutas de archivos, etc.

**Recomendación:**  
- Loguear errores internamente con detalles
- Devolver mensajes genéricos al cliente
- Implementar error codes para debugging

---

### [ALTA-005] Almacenamiento de Token en localStorage

**Ubicación:** `frontend/lib/auth.ts:9`

**Descripción:**  
El token JWT se almacena en localStorage:

```typescript
localStorage.setItem(TOKEN_KEY, data.accessToken);
```

**Impacto:**  
Vulnerable a ataques XSS - cualquier script malicioso puede leer el token.

**Recomendación:**  
- Usar httpOnly cookies para almacenar tokens
- Implementar refresh tokens
- Considerar SameSite cookies

---

### [ALTA-006] Sin Headers de Seguridad HTTP

**Ubicación:** 
- `backend/internal/infrastructure/http/router/router.go`
- `frontend/next.config.ts`

**Descripción:**  
No se configuran headers de seguridad HTTP:
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

**Impacto:**  
Vulnerable a clickjacking, XSS, MIME sniffing attacks.

**Recomendación:**  
- Agregar middleware de security headers en Go
- Configurar headers en next.config.ts
- Implementar CSP estricto

---

### [MEDIA-001] Puerto de PostgreSQL Expuesto

**Ubicación:** `docker-compose.yml:10-11`

**Descripción:**  
El puerto de PostgreSQL está mapeado a todos los interfaces:

```yaml
ports:
  - "5432:5432"
```

**Impacto:**  
La base de datos es accesible desde fuera del contenedor Docker.

**Recomendación:**  
- Remover mapeo de puertos en producción
- Usar solo red interna de Docker
- Si es necesario, mapear a localhost: `127.0.0.1:5432:5432`

---

### [MEDIA-002] Sin Validación de Formato de UUID

**Ubicación:** Handlers que reciben IDs como parámetros

**Descripción:**  
Los IDs de clientes, membresías, etc., no se validan como UUIDs válidos antes de usarse en consultas.

```go
// client_handler.go:50
client, err := h.svc.GetByID(c.Request.Context(), c.Param("clientId"))
```

**Impacto:**  
Posible inyección de caracteres especiales o errores no controlados.

**Recomendación:**  
- Validar formato UUID en middleware o handler
- Usar regex o biblioteca de validación

---

### [MEDIA-003] Logs Expuestos en Producción

**Ubicación:** `backend/internal/infrastructure/http/router/router.go:28`

**Descripción:**  
El logger de Gin está habilitado sin filtros:

```go
r.Use(gin.Logger())
```

**Impacto:**  
Posible exposición de información sensible en logs (IPs, rutas, parámetros).

**Recomendación:**  
- Configurar logger según entorno
- Filtrar campos sensibles
- Usar structured logging

---

### [MEDIA-004] Sin Límite de Tamaño en Body de Requests

**Ubicación:** `backend/cmd/api/main.go`, `backend/internal/infrastructure/http/router/router.go`

**Descripción:**  
No se configura un límite para el tamaño del body de las peticiones HTTP.

**Impacto:**  
Vulnerable a ataques de denegación de servicio mediante payloads grandes.

**Recomendación:**  
- Configurar `MaxMultipartMemory` en Gin
- Agregar middleware de límite de body size
- Límite recomendado: 1-10MB según caso de uso

---

### [MEDIA-005] Endpoint de Backup Sin Implementación Real

**Ubicación:** `backend/internal/infrastructure/http/handler/dashboard_handler.go:98-101`

**Descripción:**  
El endpoint de backup es un stub:

```go
func (h *AdminHandler) TriggerBackup(c *gin.Context) {
    // TODO: integrate with backup service
    ok(c, gin.H{"message": "Backup job triggered"})
}
```

**Impacto:**  
Falsa sensación de seguridad - no hay backups reales.

**Recomendación:**  
- Implementar backups automatizados
- Configurar pg_dump programado
- Verificar restauración de backups

---

### [BAJA-001] Frontend Expone URL del API

**Ubicación:** `frontend/.env.local:1`

**Descripción:**  
La variable `NEXT_PUBLIC_API_URL` expone la URL del backend.

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**Impacto:**  
Información del backend visible en el código del cliente (menor impacto ya que es necesario).

**Recomendación:**  
- Documentar que es comportamiento esperado
- Asegurar que el backend está protegido correctamente

---

### [BAJA-002] Comentarios con Información Sensible

**Ubicación:** `backend/migrations/001_init.sql:108`

**Descripción:**  
Comentarios revelan la contraseña del admin:

```sql
-- Default admin user  (password: Admin1234!)
```

**Impacto:**  
Información sensible en código fuente.

**Recomendación:**  
- Remover comentarios con información sensible
- Documentar proceso de setup en lugar seguro

---

## Iteración 2: Vulnerabilidades Adicionales Detectadas

### [ALTA-007] Sin Verificación de Propiedad de Recursos (Potencial IDOR)

**Ubicación:** 
- `backend/internal/application/payment_service.go:42-57`
- `backend/internal/application/membership_service.go:38-76`

**Descripción:**  
No se verifica que el usuario que realiza la operación tenga permisos sobre los recursos específicos. Por ejemplo, al crear un pago:

```go
func (s *PaymentService) Create(ctx context.Context, in CreatePaymentInput) (*entity.Payment, error) {
    p := &entity.Payment{
        ClientID:     in.ClientID,     // No se verifica propiedad
        MembershipID: in.MembershipID, // No se verifica propiedad
        ...
    }
```

**Impacto:**  
Un usuario con rol `billing` podría potencialmente crear pagos para cualquier cliente sin verificación adicional.

**Recomendación:**  
- Implementar verificación de permisos a nivel de recurso
- Validar que ClientID y MembershipID existen y están relacionados
- Implementar políticas de acceso basadas en atributos (ABAC)

---

### [ALTA-008] Sin Sanitización de Entrada en Generación de PDF

**Ubicación:** `backend/internal/infrastructure/pdf/receipt.go:14-109`

**Descripción:**  
Los datos del cliente y pago se insertan directamente en el PDF sin sanitización:

```go
row("Nombre", client.FullName())  // Podría contener caracteres maliciosos
row("Email", client.Email)
row("Referencia", payment.Reference)
```

**Impacto:**  
Posible inyección de contenido en PDFs, aunque el riesgo es bajo dado que gofpdf no interpreta HTML.

**Recomendación:**  
- Sanitizar entrada antes de generar PDF
- Limitar longitud de campos
- Escapar caracteres especiales

---

### [MEDIA-006] Sin Validación de Email Único en Clientes

**Ubicación:** `backend/internal/application/client_service.go:29-47`

**Descripción:**  
Al crear un cliente no se verifica si el email ya existe:

```go
func (s *ClientService) Create(ctx context.Context, in CreateClientInput) (*entity.Client, error) {
    c := &entity.Client{
        Email:     in.Email,  // No se verifica duplicidad
        ...
    }
```

**Impacto:**  
Posibles duplicados de clientes o confusión en datos.

**Recomendación:**  
- Agregar constraint UNIQUE en base de datos para email de clientes
- Verificar duplicidad antes de insertar
- Manejar error de duplicidad apropiadamente

---

### [MEDIA-007] Ausencia de Input Validation en Fechas

**Ubicación:** 
- `backend/internal/infrastructure/http/handler/payment_handler.go:68-80`
- `backend/internal/infrastructure/http/handler/dashboard_handler.go:26-36`

**Descripción:**  
Las fechas en queries no se validan exhaustivamente:

```go
if f := c.Query("from"); f != "" {
    t, err := time.Parse("2006-01-02", f)
    if err == nil {
        filter.From = &t
    }
}
```

**Impacto:**  
Fechas inválidas se ignoran silenciosamente, podría causar comportamiento inesperado.

**Recomendación:**  
- Validar formato y rango de fechas
- Retornar error 400 si el formato es incorrecto
- Limitar rango de fechas consultables

---

### [MEDIA-008] Sin Validación de Contraseña Mínima en Backend

**Ubicación:** `backend/internal/infrastructure/http/handler/auth_handler.go:17-25`

**Descripción:**  
El backend no valida requisitos mínimos de contraseña:

```go
var req struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`  // Solo required
}
```

**Impacto:**  
Dependencia exclusiva en validación del frontend (6 caracteres), que puede ser bypasseada.

**Recomendación:**  
- Agregar validación de longitud mínima en backend
- Implementar requisitos de complejidad
- Usar `binding:"required,min=8"`

---

### [MEDIA-009] Dockerfile Sin Usuario No-Root

**Ubicación:** 
- `backend/Dockerfile:15-24`
- `frontend/Dockerfile:8-22`

**Descripción:**  
Los contenedores ejecutan como root:

```dockerfile
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
# Sin USER directive
CMD ["./chapitos-api"]
```

**Impacto:**  
Mayor superficie de ataque si el contenedor es comprometido.

**Recomendación:**  
- Crear usuario no privilegiado
- Agregar: `RUN adduser -D appuser && USER appuser`
- Ajustar permisos de archivos

---

### [MEDIA-010] Sin Timeout en Contexto de Operaciones de BD

**Ubicación:** Todos los repositorios en `backend/internal/infrastructure/database/`

**Descripción:**  
Las operaciones de base de datos usan el contexto de la request sin timeout específico:

```go
err := r.db.QueryRowContext(ctx, query, args...).Scan(...)
```

**Impacto:**  
Queries lentas pueden bloquear conexiones y causar DoS.

**Recomendación:**  
- Agregar timeout específico para queries
- `ctx, cancel := context.WithTimeout(ctx, 5*time.Second)`
- Configurar timeout a nivel de conexión de BD

---

### [BAJA-003] Dependencias Sin Lock File Verificable (Go)

**Ubicación:** `backend/go.mod`

**Descripción:**  
Aunque existe vendor/, las dependencias usan versiones con `// indirect` sin verificación de checksums explícita más allá de go.sum.

**Impacto:**  
Menor riesgo de supply chain attacks, mitigado por vendoring.

**Recomendación:**  
- Verificar go.sum periódicamente
- Usar `go mod verify` en CI
- Considerar escaneo de vulnerabilidades en dependencias (govulncheck)

---

## Iteración 3: Análisis Final

### Análisis de Dependencias

**Backend (Go):**
- Se recomienda ejecutar `govulncheck` para detectar vulnerabilidades conocidas
- Versiones actuales parecen recientes (2026)

**Frontend (Node.js):**
- Se recomienda ejecutar `npm audit` periódicamente
- Dependencias principales son de versiones recientes

### Observaciones de Arquitectura

1. **Positivo:** Uso de arquitectura hexagonal que facilita testing y mantenimiento
2. **Positivo:** Separación clara entre capas (domain, application, infrastructure)
3. **Positivo:** Uso de bcrypt para hashing de contraseñas con cost factor 12
4. **Positivo:** Auditoría de cambios implementada (audit_logs)
5. **Mejorable:** Falta middleware de seguridad centralizado
6. **Mejorable:** Sin tests de seguridad automatizados

---

## Resumen de Acciones Requeridas

### Inmediatas (Antes de Producción)

| ID | Acción | Prioridad |
|----|--------|-----------|
| CRITICA-001 | Remover JWT secret por defecto | BLOQUEANTE |
| CRITICA-002 | Externalizar credenciales de BD | BLOQUEANTE |
| CRITICA-003 | Habilitar SSL en conexión BD | BLOQUEANTE |
| CRITICA-004 | Remover/cambiar admin seed | BLOQUEANTE |
| ALTA-001 | Configurar CORS restrictivo | BLOQUEANTE |
| ALTA-002 | Implementar rate limiting | ALTA |

### Corto Plazo (Sprint 1-2 Post-MVP)

| ID | Acción | Prioridad |
|----|--------|-----------|
| ALTA-003 | Token revocation con Redis | ALTA |
| ALTA-004 | Sanitizar errores internos | ALTA |
| ALTA-005 | Migrar tokens a httpOnly cookies | ALTA |
| ALTA-006 | Agregar security headers | ALTA |
| ALTA-007 | Verificación de propiedad IDOR | ALTA |
| ALTA-008 | Sanitizar inputs en PDF | MEDIA |

### Mediano Plazo (Sprint 3-4)

| ID | Acción | Prioridad |
|----|--------|-----------|
| MEDIA-001 a MEDIA-010 | Correcciones varias | MEDIA |
| BAJA-001 a BAJA-003 | Mejoras menores | BAJA |

---

## Próximos Pasos

1. Priorizar correcciones CRITICAS inmediatamente
2. Planificar remediación de vulnerabilidades ALTAS en siguiente sprint
3. Documentar excepciones justificadas para vulnerabilidades MEDIA/BAJA
4. Implementar escaneo de seguridad automatizado en CI/CD
5. Ejecutar `govulncheck` y `npm audit` periódicamente
6. Considerar penetration testing antes del lanzamiento

---

*Auditoría completada en 3 iteraciones.*  
*Última actualización: 2026-03-10*
