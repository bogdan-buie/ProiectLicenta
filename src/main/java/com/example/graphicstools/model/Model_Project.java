package com.example.graphicstools.model;

public class Model_Project {
    private String id;
    private String idProject;
    private String fileName;
    private String extension;
    private String alias;
    private String link;

    public Model_Project() {
    }

    public Model_Project(String id, String idProject, String fileName, String extension, String alias, String link) {
        this.id = id;
        this.idProject = idProject;
        this.fileName = fileName;
        this.extension = extension;
        this.alias = alias;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
