package com.example.graphicstools.dto;

public class User_project {
    private String id;
    private String idProject;
    private String idUser;

    public User_project() {
    }

    public User_project(String id, String idProject, String idUser) {
        this.id = id;
        this.idProject = idProject;
        this.idUser = idUser;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdProject() {
        return idProject;
    }

    public void setIdProject(String idProject) {
        this.idProject = idProject;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }
}
