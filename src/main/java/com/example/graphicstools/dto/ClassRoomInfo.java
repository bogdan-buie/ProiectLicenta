package com.example.graphicstools.dto;

public class ClassRoomInfo {
    private String classId;
    private String name;
    private int totalUsers;
    private int totalProjects;
    private int totalUngradedProjects;

    public ClassRoomInfo() {
    }

    public ClassRoomInfo(String classId, String name, int totalUsers, int totalProjects, int totalUngradedProjects) {
        this.classId = classId;
        this.name = name;
        this.totalUsers = totalUsers;
        this.totalProjects = totalProjects;
        this.totalUngradedProjects = totalUngradedProjects;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(int totalProjects) {
        this.totalProjects = totalProjects;
    }

    public int getTotalUngradedProjects() {
        return totalUngradedProjects;
    }

    public void setTotalUngradedProjects(int totalUngradedProjects) {
        this.totalUngradedProjects = totalUngradedProjects;
    }
}
