package com.example.graphicstools.dto;

public class LoginResponse {
    String user_id;
    String role;
    String message;

    public LoginResponse(){

    }

    public LoginResponse(String user_id, String role, String message) {
        this.user_id = user_id;
        this.role = role;
        this.message = message;
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
}
