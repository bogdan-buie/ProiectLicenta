package com.example.graphicstools.service;

import com.example.graphicstools.model.Project;
import com.example.graphicstools.model.User;

import com.example.graphicstools.model.User_Project;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {
    private static final String COLLECTION_NAME = "project";
    private User_ProjectService userProjectService;
    private Firestore db;
    public ProjectService() {
        db = FirestoreClient.getFirestore();
        this.userProjectService = new User_ProjectService();
    }
    public ResponseEntity<String> saveProject(String userId, Project project) throws Exception {

        DocumentReference documentReference = db.collection(COLLECTION_NAME).add(project).get();
        String generatedId = documentReference.getId();
        project.setId(generatedId);
        db.collection(COLLECTION_NAME).document(generatedId).set(project, SetOptions.merge());

        //actualizare tabel user_project
        userProjectService.saveUserProject(new User_Project("", userId, generatedId));
        return new ResponseEntity<>("Project added with success", HttpStatus.CREATED);
    }
    public Project getProject(String id) throws Exception{
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();

        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            return document.toObject(Project.class);
        }
        return null;
    }

    public ResponseEntity<String> updateProject(String id, Project project)throws Exception{
        if (!doesProjectExistById(id)) {
            return new ResponseEntity<>("Project with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        ApiFuture <WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).set(project);
        return new ResponseEntity<>("Project updated with success", HttpStatus.OK);
    }
    public ResponseEntity<String> deleteProject(String id) throws Exception{

        if (!doesProjectExistById(id)) {
            return new ResponseEntity<>("Project with the given ID does not exist", HttpStatus.NOT_FOUND);
        }

        ApiFuture <WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).delete();

        // stergem si din colectia user_project documentul care contine idProject
        userProjectService.deleteUserProjectByProjectId(id);
        return new ResponseEntity<>("Project deleted with success", HttpStatus.OK);
    }

    public boolean doesProjectExistById(String id) throws Exception {
        // Verificarea existenței unui proiect cu un id dat
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = documentReference.get();
        DocumentSnapshot documentSnapshot = documentSnapshotApiFuture.get();

        return documentSnapshot.exists();
    }
}
