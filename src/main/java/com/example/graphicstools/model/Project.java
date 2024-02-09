package com.example.graphicstools.model;

public class Project {
    private String id;
    private String name;
    private int grade;
    private String lastModification;
    private String description;
    private String fileName;
    private String link;
    public Project() {
    }

    public Project(String id, String name, int grade, String lastModification, String description, String fileName, String link) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.lastModification = lastModification;
        this.description = description;
        this.fileName = fileName;
        this.link = link;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public String getLastModification() {
        return lastModification;
    }

    public void setLastModification(String lastModification) {
        this.lastModification = lastModification;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
