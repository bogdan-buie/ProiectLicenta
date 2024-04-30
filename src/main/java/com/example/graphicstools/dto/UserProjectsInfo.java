package com.example.graphicstools.dto;

public class UserProjectsInfo {
    private  String userId;
    private String email;
    private int level;
    private int totalProjects;
    private int totalGradedProjects;
    private int totalUngradedProjects;

    public UserProjectsInfo() {
    }

    public UserProjectsInfo(String userId, String email, int level, int totalProjects, int totalGradedProjects, int totalUngradedProjects) {
        this.userId = userId;
        this.email = email;
        this.level = level;
        this.totalProjects = totalProjects;
        this.totalGradedProjects = totalGradedProjects;
        this.totalUngradedProjects = totalUngradedProjects;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(int totalProjects) {
        this.totalProjects = totalProjects;
    }

    public int getTotalGradedProjects() {
        return totalGradedProjects;
    }

    public void setTotalGradedProjects(int totalGradedProjects) {
        this.totalGradedProjects = totalGradedProjects;
    }

    public int getTotalUngradedProjects() {
        return totalUngradedProjects;
    }

    public void setTotalUngradedProjects(int totalUngradedProjects) {
        this.totalUngradedProjects = totalUngradedProjects;
    }
}
