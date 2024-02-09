package com.example.graphicstools.model;

public class Image_Project
{
    private String id;
    private String idProject;
    private String imageName;// generat automat
    private String link;    // storage/images/imageName

    public Image_Project(){
    }

    public Image_Project(String id, String idProject, String imageName, String link) {
        this.id = id;
        this.idProject = idProject;
        this.imageName = imageName;
        this.link = link;
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

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
