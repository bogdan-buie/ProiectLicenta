package com.example.graphicstools.service;

import com.example.graphicstools.model.Image_Project;
import com.example.graphicstools.model.Project;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import java.util.concurrent.ExecutionException;

public class Image_ProjectService {
    public static final String BUCKET_NAME = "sodium-coil-312918.appspot.com";  //gs://sodium-coil-312918.appspot.com
    public final ImageService imageService;
    private static final String COLLECTION_NAME = "image_project";
    private Firestore db;

    public Image_ProjectService() {
        db = FirestoreClient.getFirestore();
        this.imageService = new ImageService();
    }
    public void deleteImageProject(String id) throws ExecutionException, InterruptedException {
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();

        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            // stergem imaginea asociata
            Image_Project imageProject =  document.toObject(Image_Project.class);
            imageService.deleteImage(imageProject.getImageName());

            // stergem inregistrarea de tip image_project
            ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(imageProject.getId()).delete();
        }
    }
    public void getImageProjectByProjectId(String projectId){

    }
}
