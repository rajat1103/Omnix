# Security Policy — Omnix

## Supported Versions

| Version | Supported |
|---|---|
| `develop` (latest) | ✅ Active development |
| Tagged releases | ✅ Security fixes backported |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Omnix, please report it responsibly:

1. **Email**: Send details to the project maintainer (add your contact here)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fix (optional)

You will receive an acknowledgment within **48 hours** and a more detailed response within **7 days**.

---

## Disclosure Policy

- We will acknowledge receipt of your report promptly
- We will investigate and aim to release a fix within 30 days for critical issues
- We will credit you in the security fix release notes (unless you prefer anonymity)
- We ask that you do not publicly disclose the vulnerability until a fix is available

---

## Scope

The following are **in scope** for security reports:

- Unauthorized file system access beyond configured index paths
- API key or secrets leakage
- Prompt injection enabling unintended system actions
- Privilege escalation through the plugin system
- Data exfiltration to unintended endpoints

The following are **out of scope**:

- Issues requiring physical access to the device
- Issues in third-party dependencies (report directly to the dependency)
- Social engineering of the user
- Theoretical vulnerabilities with no practical exploitation path

---

## Security-Related Documentation

For the full security architecture and threat model, see [docs/Security.md](docs/Security.md).
