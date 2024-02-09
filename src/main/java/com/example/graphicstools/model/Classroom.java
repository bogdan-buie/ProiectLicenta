package com.example.graphicstools.model;

public class Classroom {
    String id;
    String name;
    String idProf;

    public Classroom(){
    }
    public Classroom(String id, String nume, String idProf) {
        this.id = id;
        this.name = nume;
        this.idProf = idProf;
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

    public String getIdProf() {
        return idProf;
    }

    public void setIdProf(String idProf) {
        this.idProf = idProf;
    }
}
