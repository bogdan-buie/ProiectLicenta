package com.example.graphicstools.dto;

public class AuthResponse {
    String user_id;
    String role;
    String message;
    String token;

    public AuthResponse() {
    }

    public AuthResponse(String user_id, String role, String message, String token) {
        this.user_id = user_id;
        this.role = role;
        this.message = message;
        this.token = token;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
