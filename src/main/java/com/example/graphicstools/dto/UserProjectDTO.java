package com.example.graphicstools.dto;

public class UserProjectDTO {
    private String idProject;
    private String idUser;

    public UserProjectDTO() {
    }

    public UserProjectDTO(String idProject, String idUser) {

        this.idProject = idProject;
        this.idUser = idUser;
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
