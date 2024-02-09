package com.example.graphicstools.service;

import com.example.graphicstools.model.Classroom;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ClassroomService {
    private static final String COLLECTION_NAME = "classroom";


    public ClassroomService(){
    }

    public ResponseEntity<String> saveClassroom( Classroom myclass) throws Exception {

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).add(myclass).get();
        String generatedId = documentReference.getId();
        myclass.setId(generatedId);
        db.collection(COLLECTION_NAME).document(generatedId).set(myclass, SetOptions.merge());


        return new ResponseEntity<>("Classroom added with success", HttpStatus.CREATED);
    }

    public Classroom getClassroom(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();

        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            return document.toObject(Classroom.class);
        }
        return null;
    }


    public ResponseEntity<String> updateClassroom(String id, Classroom classroom) throws Exception {
        if (!doesClassroomExistById(id)) {
            return new ResponseEntity<>("Classroom with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        Firestore dbFireStore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApifuture = dbFireStore.collection(COLLECTION_NAME).document(id).set(classroom);
        return new ResponseEntity<>("Classroom updated with success", HttpStatus.OK);
    }

    public ResponseEntity<String> deleteClassroom(String id) throws Exception {

        if (!doesClassroomExistById(id)) {
            return new ResponseEntity<>("Classroom with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        Firestore dbFireStore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApifuture = dbFireStore.collection(COLLECTION_NAME).document(id).delete();
        return new ResponseEntity<>("Classroom deleted with success", HttpStatus.OK);
    }


    public boolean doesClassroomExistById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Verificam daca exista un classroom cu un id dat
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = documentReference.get();
        DocumentSnapshot documentSnapshot = documentSnapshotApiFuture.get();

        return documentSnapshot.exists();
    }
}
