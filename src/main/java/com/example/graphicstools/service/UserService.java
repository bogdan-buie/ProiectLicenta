package com.example.graphicstools.service;

import com.example.graphicstools.dto.AuthResponse;
import com.example.graphicstools.dto.ChangePassword;
import com.example.graphicstools.dto.LoginResponse;
import com.example.graphicstools.dto.UserCredentials;
import com.example.graphicstools.model.Project;
import com.example.graphicstools.model.User;
import com.example.graphicstools.utils.Utils;
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
public class UserService {
    private static final String COLLECTION_NAME = "user";
    private ClassroomService classroomService;

    public UserService() {
        classroomService = new ClassroomService();
    }

    public AuthResponse saveUser(User user) throws Exception {
        String email = user.getEmail();
        user.setRole("user");
        AuthResponse authResponse = new AuthResponse();
        // Verificare existență utilizator cu același email
        if (doesUserExistByEmail(email)) {
            authResponse.setMessage("User with the same email already exists");
            return authResponse;
        }

        // hash-uirea parolei
        String unHashedPassword = user.getPassword();
        user.setPassword(Utils.hashPassword(unHashedPassword));

        // Continuare cu salvarea utilizatorului în baza de date
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference documentReference = db.collection(COLLECTION_NAME).add(user).get();
        String generatedUid = documentReference.getId();
        user.setUid(generatedUid);
        db.collection(COLLECTION_NAME).document(generatedUid).set(user, SetOptions.merge());

        authResponse.setUser_id(generatedUid);
        authResponse.setRole("user");
        authResponse.setMessage("User added with success");
        return authResponse;
    }

    public User getUser(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();

        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            return document.toObject(User.class);
        }
        return null;
    }

    public List<User> getUsersByClassId(String classId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<User> users = new ArrayList<>();

        //Verificam daca clasa respectiva exista
        boolean myClassExists = classroomService.doesClassroomExistById(classId);
        if (myClassExists) {
            // Creare de interogare pentru utilizatorii cu un classId dat
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("classId", classId);
            ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

            // Obținere a rezultatelor interogării și adăugare utilizatorilor în listă
            QuerySnapshot querySnapshot = querySnapshotApiFuture.get();
            for (QueryDocumentSnapshot document : querySnapshot) {
                users.add(document.toObject(User.class));
            }
            return users;
        } else {
            return null;
        }
    }

    public ResponseEntity<String> updateUser(String id, User user) throws Exception {
        if (!doesUserExistById(id)) {
            return new ResponseEntity<>("User with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        Firestore dbFireStore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApifuture = dbFireStore.collection(COLLECTION_NAME).document(id).set(user);
        return new ResponseEntity<>("User updated with success", HttpStatus.OK);

    }

    /**
     * Sterge user-ul cu id-ul dat, implicit si proiectele acestuia, impreuna cu toate pozele asociate
     * @param id
     * @return
     * @throws Exception
     */
    public ResponseEntity<String> deleteUser(String id) throws Exception {
        if (!doesUserExistById(id)) {
            return new ResponseEntity<>("User with the given ID does not exist", HttpStatus.NOT_FOUND);
        }

        ProjectService projectService = new ProjectService();
        List<Project> userProjects = projectService.getUserProjects(id);
        if(userProjects.size()>0){
            for(Project p : userProjects){
                projectService.deleteProject(p.getId());
            }
        }


        Firestore dbFireStore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApifuture = dbFireStore.collection(COLLECTION_NAME).document(id).delete();
        return new ResponseEntity<>("User deleted with success", HttpStatus.OK);
    }

    public boolean doesUserExistByEmail(String email) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Verificarea existenței unui utilizator cu email-ul dat
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("email", email);
        QuerySnapshot querySnapshot = query.get().get();
        return !querySnapshot.isEmpty();
    }

    public boolean doesUserExistById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Verificarea existenței unui utilizator cu id-ul dat
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = documentReference.get();
        DocumentSnapshot documentSnapshot = documentSnapshotApiFuture.get();

        return documentSnapshot.exists();
    }

    public ResponseEntity<LoginResponse> login(UserCredentials userCredentials) throws Exception {
        boolean userExists = this.doesUserExistByEmail(userCredentials.getEmail());
        LoginResponse loginResponse = new LoginResponse();
        if (userExists) {
            //System.out.println("User-ul exista");
            // hash-uirea parolei
            String unHashedPassword = userCredentials.getPassword();
            Firestore db = FirestoreClient.getFirestore();
            List<User> users = new ArrayList<>();

            // Selectam user-ul cu email-ul cunoscut
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("email", userCredentials.getEmail());
            ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

            QuerySnapshot querySnapshot = querySnapshotApiFuture.get();
            for (QueryDocumentSnapshot document : querySnapshot) {
                users.add(document.toObject(User.class));
            }

            if(users.size()>1){
                loginResponse.setMessage("Error");
               return new ResponseEntity<>(loginResponse, HttpStatus.OK);//exista mai multi utilizatori cu acelasi email
            }else{
                String realHashedPassword = users.get(0).getPassword();
                if(Utils.checkPassword(unHashedPassword, realHashedPassword)){
                    loginResponse.setUser_id(users.get(0).getUid());
                    loginResponse.setRole(users.get(0).getRole());
                    loginResponse.setMessage("Successful login");
                    return new ResponseEntity<>(loginResponse, HttpStatus.OK);
                }
                else{
                    //parola gresita
                    loginResponse.setMessage("Wrong password or email");
                    return new ResponseEntity<>(loginResponse, HttpStatus.OK);
                }
            }

        }else {
            //email gresit
            loginResponse.setMessage("Wrong password or email");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }
    }
    public ResponseEntity<?> changePassword(ChangePassword changePassword) throws Exception {
        boolean userExists = this.doesUserExistById(changePassword.getUserId());
        if (userExists) {
            //System.out.println("User-ul exista");
            // hash-uirea parolei
            String oldPassword = changePassword.getOldPassword();
            User user = this.getUser(changePassword.getUserId());

            if(user == null){
                return new ResponseEntity<>("Error", HttpStatus.OK);
            }else{
                String oldPasswordHashed = user.getPassword();
                if(Utils.checkPassword(oldPassword, oldPasswordHashed)){
                    user.setPassword(Utils.hashPassword(changePassword.getNewPassword()));
                    this.updateUser(user.getUid(), user);
                    return new ResponseEntity<>("Password updated with success", HttpStatus.OK);
                }
                else{
                    return new ResponseEntity<>("Password is wrong", HttpStatus.OK);
                }
            }

        }else {
            return new ResponseEntity<>("User with this id does not exists", HttpStatus.OK);
        }
    }

    public User login2(UserCredentials userCredentials) throws Exception {
        boolean userExists = this.doesUserExistByEmail(userCredentials.getEmail());

        if (userExists) {
            //System.out.println("User-ul exista");
            // hash-uirea parolei
            String unHashedPassword = userCredentials.getPassword();
            Firestore db = FirestoreClient.getFirestore();
            List<User> users = new ArrayList<>();

            // Selectam user-ul cu email-ul cunoscut
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("email", userCredentials.getEmail());
            ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

            QuerySnapshot querySnapshot = querySnapshotApiFuture.get();
            for (QueryDocumentSnapshot document : querySnapshot) {
                users.add(document.toObject(User.class));
            }

            if(users.size()>1){
                return null;//exista mai multi utilizatori cu acelasi email
            }else{
                String realHashedPassword = users.get(0).getPassword();
                if(Utils.checkPassword(unHashedPassword, realHashedPassword)){
                    return users.get(0);
                }
                else{
                    //parola gresita
                    return null;
                }
            }
        }else {
            //email gresit
            return null;
        }
    }
}
