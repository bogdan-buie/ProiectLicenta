package com.example.graphicstools.service;

import com.example.graphicstools.model.User_Project;
import com.example.graphicstools.utils.Utils;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class User_ProjectService {
    private static final String COLLECTION_NAME = "user_project";
    private Firestore db;
    public User_ProjectService() {
        this.db = FirestoreClient.getFirestore();
    }
    public ResponseEntity<String> saveUserProject(User_Project userProject) throws Exception{
        DocumentReference documentReference = db.collection(COLLECTION_NAME).add(userProject).get();
        String generatedId = documentReference.getId();
        userProject.setId(generatedId);
        db.collection(COLLECTION_NAME).document(generatedId).set(userProject, SetOptions.merge());
        return new ResponseEntity<>("Document added with success", HttpStatus.CREATED);
    }


    public ResponseEntity<String> deleteUserProjectByProjectId(String projectId) throws Exception{
        User_Project myUP = findByProjectId(projectId);
        if(myUP == null){
            return new ResponseEntity<>("User_Project document with this projectId does not exits", HttpStatus.BAD_REQUEST);
        }else{
            ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(myUP.getId()).delete();
            return new ResponseEntity<>("User_Project document deleted with success", HttpStatus.OK);
        }
    }
    public User_Project findByProjectId(String projectId) throws ExecutionException, InterruptedException {
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("idProject", projectId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        QuerySnapshot documentSnapshots = querySnapshot.get();
        if (documentSnapshots.isEmpty()) {
            return null;
        } else {
            DocumentSnapshot documentSnapshot = documentSnapshots.getDocuments().get(0);
            return documentSnapshot.toObject(User_Project.class);
        }
    }
}
