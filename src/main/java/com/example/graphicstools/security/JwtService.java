package com.example.graphicstools.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private String secret;
    private Long expiration;

    public JwtService() {
        this.secret ="BaiaMareMaramuresdela1la100abcdefghijklmnopqrstuvwBuieabcdefBogdanAlaBalaPortocalaUTCNCUNBM" ;
        this.expiration = 18000000L;
    }

    public String generateToken(String uid) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        System.out.println(expiryDate.toString());

        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", uid);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        Date expirationDate = getClaimsFromToken(token).getExpiration();
        Date dateNow = new Date();
        return dateNow.before(expirationDate);
    }
}
