package com.socialcommerce.platform.security;

import com.socialcommerce.platform.user.entity.User;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Génération et parsing des JWT (SAD §6.5, §6.6).
 *
 * Utilise Nimbus JOSE+JWT directement avec HMAC-SHA256 (symétrique).
 * Le token contient les claims :
 *   - sub    : user id
 *   - email  : user email
 *   - tenant : tenant id
 *   - roles  : rôles RBAC
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final Duration expiration;

    public JwtService(
            @Value("${app.jwt.secret:default-secret-key-change-me-in-production-at-least-32-chars}") String secret,
            @Value("${app.jwt.expiration:PT24H}") Duration expiration
    ) {
        this.key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        this.expiration = expiration;
    }

    public String generateToken(User user, UUID tenantId, List<String> roles) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(user.getId().toString())
                    .claim("email", user.getEmail())
                    .claim("tenant", tenantId.toString())
                    .claim("roles", roles)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plus(expiration)))
                    .build();

            SignedJWT signedJwt = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256), claims);
            signedJwt.sign(new MACSigner(key));
            return signedJwt.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT", e);
        }
    }

    public SignedJWT parse(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            if (!jwt.verify(new MACVerifier(key))) {
                throw new RuntimeException("Invalid JWT signature");
            }
            return jwt;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JWT", e);
        }
    }

    public boolean isValid(String token) {
        try {
            SignedJWT jwt = parse(token);
            return jwt.getJWTClaimsSet().getExpirationTime().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public UUID extractTenantId(String token) throws java.text.ParseException {
        return UUID.fromString(parse(token).getJWTClaimsSet().getStringClaim("tenant"));
    }

    public UUID extractUserId(String token) throws java.text.ParseException {
        return UUID.fromString(parse(token).getJWTClaimsSet().getSubject());
    }

    public String extractEmail(String token) throws java.text.ParseException {
        return parse(token).getJWTClaimsSet().getStringClaim("email");
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) throws java.text.ParseException {
        Object roles = parse(token).getJWTClaimsSet().getClaim("roles");
        return roles instanceof List ? (List<String>) roles : List.of();
    }
}
