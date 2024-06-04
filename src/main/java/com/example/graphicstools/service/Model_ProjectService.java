package com.example.graphicstools.service;

import com.example.graphicstools.model.Model_Project;
import com.example.graphicstools.model.Project;
import com.example.graphicstools.model.User_Project;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class Model_ProjectService {
    private static final String COLLECTION_NAME = "model_project";
    private Firestore db;

    public Model_ProjectService() {
        this.db = FirestoreClient.getFirestore();
    }
    public Model_Project getModelProject(String id) throws Exception {
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();
        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            return document.toObject(Model_Project.class);
        }
        return null;
    }
    public List<Model_Project> getModelProjects(String projectId) throws ExecutionException, InterruptedException {

            Query query = db.collection("model_project").whereEqualTo("idProject", projectId);
            ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

            List<Model_Project> myModelProjects = new ArrayList<>();
            QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

            if (!querySnapshot.isEmpty()) {
                for (QueryDocumentSnapshot document : querySnapshot) {
                    myModelProjects.add(document.toObject(Model_Project.class));
                }
                return myModelProjects;
            }
            return null;

    }
    public ResponseEntity<String> saveModelProject(Model_Project modelProject) throws Exception{
        DocumentReference documentReference = db.collection(COLLECTION_NAME).add( modelProject).get();
        String generatedId = documentReference.getId();
        modelProject.setId(generatedId);
        db.collection(COLLECTION_NAME).document(generatedId).set( modelProject, SetOptions.merge());
        return new ResponseEntity<>(generatedId, HttpStatus.CREATED);

    }
    public ResponseEntity<String>  deleteModelProjectById(String id) throws Exception {
        try {
            if (doesModelProjectExistById(id)) {
                Model_Project myModelProject = this.getModelProject(id);
                ModelsService modelsService = new ModelsService();
                modelsService.deleteFile(myModelProject.getFileName());
                ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).delete();

                return ResponseEntity.status(HttpStatus.OK).body("Model project with id " + id + " deleted successfully.");
            }
            else
                return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting");
        }


    }
    public boolean doesModelProjectExistById(String id) throws Exception {
        // Verificarea existenței unui proiect cu un id dat
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = documentReference.get();
        DocumentSnapshot documentSnapshot = documentSnapshotApiFuture.get();

        return documentSnapshot.exists();
    }
}
