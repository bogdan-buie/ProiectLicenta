package com.example.graphicstools.model;

public class User_Project {
    String id;
    String idUser;
    String idProject;

    public User_Project() {
    }

    public User_Project(String id, String idUser, String idProject) {
        this.id = id;
        this.idUser = idUser;
        this.idProject = idProject;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public String getIdProject() {
        return idProject;
    }

    public void setIdProject(String idProject) {
        this.idProject = idProject;
    }
}
