# 🔒 Security Guidelines - Escuela de Posgrado UNICA

## 🚨 Critical Security Information

This document outlines the security requirements and best practices for the Escuela de Posgrado UNICA system.

## ⚠️ Environment Variables Required

The following environment variables **MUST** be set and should **NEVER** be committed to the repository:

### Database Configuration
```bash
# Database credentials
DB_USERNAME=your_database_username
DB_PASSWORD=your_secure_database_password
POSTGRES_USER=your_postgres_username  
POSTGRES_PASSWORD=your_secure_postgres_password
```

### JWT Configuration
```bash
# JWT Secret - MUST be a strong, unique value
JWT_SECRET=your_very_secure_jwt_secret_key_minimum_32_characters_long
```

### Email Configuration (Mailtrap)
```bash
# Mailtrap credentials for email functionality
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe
```

### Google OAuth Configuration
```bash
# Google OAuth credentials from Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id_from_console
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_console
```

### Admin Panel Configuration
```bash
# PgAdmin credentials
PGADMIN_EMAIL=admin@unica.edu.pe
PGADMIN_PASSWORD=your_strong_pgadmin_password
```

## 🛡️ Security Best Practices

### 1. Password Requirements
- **Database passwords**: Minimum 16 characters, mix of letters, numbers, and symbols
- **JWT Secret**: Minimum 32 characters, cryptographically secure random string
- **Admin passwords**: Minimum 12 characters, complex

### 2. Environment Management
- Use `.env` files for local development (never commit these)
- Use environment variables or secure secret management in production
- Copy `.env.example` to `.env` and set your values
- Never use default/example credentials in production

### 3. Production Deployment Security
- Change ALL default passwords before deployment
- Use HTTPS/TLS for all communications
- Enable database encryption at rest
- Configure proper firewall rules
- Use non-root database users with minimal privileges
- Rotate JWT secrets regularly

### 4. Development Security
- Never commit real credentials to git
- Use separate development and production credentials
- Regularly update dependencies
- Use secrets scanning tools

## 🔑 How to Generate Secure Secrets

### JWT Secret
```bash
# Option 1: Using OpenSSL
openssl rand -hex 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### Database Passwords
```bash
# Generate a strong password
openssl rand -base64 24
```

## 📋 Security Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set with strong values
- [ ] No hardcoded credentials in source code
- [ ] `.env` files are not committed to git
- [ ] Default passwords are changed
- [ ] HTTPS is enabled
- [ ] Database connections are encrypted
- [ ] JWT secrets are cryptographically secure
- [ ] Google OAuth is properly configured with correct redirect URIs
- [ ] Mailtrap is configured for email functionality
- [ ] PgAdmin access is secured with strong credentials
- [ ] Firewall rules are properly configured
- [ ] Regular security updates are planned

## 🚨 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** commit fixes to public repositories
2. Contact the system administrator immediately
3. Document the issue privately
4. Follow responsible disclosure practices

## 📞 Contact Information

For security-related questions or incidents:
- System Administrator: [Contact Information]
- Security Team: [Contact Information]

## 🔄 Regular Maintenance

- Rotate JWT secrets every 90 days
- Update all passwords every 180 days
- Review and update dependencies monthly
- Conduct security audits quarterly

---

**⚠️ REMEMBER: Security is everyone's responsibility. When in doubt, ask!**