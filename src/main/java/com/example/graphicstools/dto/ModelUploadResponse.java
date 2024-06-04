package com.example.graphicstools.dto;

public class ModelUploadResponse {
    private String link;
    private String fileName;
    private String extension;

    public ModelUploadResponse() {
    }

    public ModelUploadResponse(String link, String fileName, String extension) {
        this.link = link;
        this.fileName = fileName;
        this.extension = extension;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
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
}
