package com.example.graphicstools.service;

import com.example.graphicstools.model.Image_Project;
import com.example.graphicstools.model.Project;

import com.example.graphicstools.model.User;
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
public class ProjectService {
    private static final String COLLECTION_NAME = "project";
    private final User_ProjectService userProjectService;
    private final Image_ProjectService imageProjectService;
    private final UserService userService;
    private final Firestore db;
    public ProjectService() {
        db = FirestoreClient.getFirestore();
        this.userProjectService = new User_ProjectService();
        this.userService = new UserService();
        this.imageProjectService= new Image_ProjectService();
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

    public List<Project> getUserProjects(String myUserId) throws Exception{
        Query query = db.collection("user_project").whereEqualTo("idUser", myUserId);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

        List<User_Project> myUserProjects = new ArrayList<>();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (!querySnapshot.isEmpty()) {
            // Identificam toate proiectele(User_proiect) unui user
            for (QueryDocumentSnapshot document : querySnapshot) {
                myUserProjects.add(document.toObject(User_Project.class));
            }

            // punem toete obiectele de tip Proiect intr-o lista
            List<Project> myProjects = new ArrayList<>();
            for(User_Project up : myUserProjects){
                myProjects.add(this.getProject(up.getIdProject()));
            }
            return myProjects;
        }
        return null;
    }
    public List<Image_Project> getProjectImages(String idProject) throws ExecutionException, InterruptedException {
        Query query = db.collection("image_project").whereEqualTo("idProject", idProject);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

        List<Image_Project> imageProjects = new ArrayList<>();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();
        if (!querySnapshot.isEmpty()) {
            // Identificam toate proiectele(User_proiect) unui user
            for (QueryDocumentSnapshot document : querySnapshot) {
                imageProjects.add(document.toObject(Image_Project.class));
            }
            return imageProjects;
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
        // stergem inregistrarile din celelalte tabele si apoi din colectia project
        // stergem din colectia user_project documentul care contine idProject
        userProjectService.deleteUserProjectByProjectId(id);

        CodeService codeService = new CodeService();
        Project myProject = this.getProject(id);

        if(myProject.getFileName()!=null){
            // stergem si fisierul din storage
            codeService.deleteFile(myProject.getFileName());
        }

        List<Image_Project> myImageProjects = this.getProjectImages(id);
        if(myImageProjects!=null){
            for(Image_Project ip : myImageProjects){
                imageProjectService.deleteImageProject(ip.getId());
            }
        }




        // acum stergem inregistrarea din tabelul projects
        ApiFuture <WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).delete();
        return new ResponseEntity<>("Project deleted with success", HttpStatus.OK);
    }

    /**
     *
     * @param projectId
     * @return id-ul userului care a creat proiectul
     * @throws Exception
     */
    public User getUserByProjectId(String projectId) throws Exception{
        // identificam toate inregistrarile care au idProject dat
        Query query = db.collection("user_project").whereEqualTo("idProject", projectId);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

        List<User_Project> myUserProjects = new ArrayList<>();
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();

        if (!querySnapshot.isEmpty()) {
            // Identificam toate proiectele
            for (QueryDocumentSnapshot document : querySnapshot) {
                myUserProjects.add(document.toObject(User_Project.class));
            }
            if(myUserProjects.size()==1){
                String id = myUserProjects.get(0).getIdUser();
                return userService.getUser(id);
            }
        }
        return null;
    }
    public boolean doesProjectExistById(String id) throws Exception {
        // Verificarea existenței unui proiect cu un id dat
        DocumentReference documentReference = db.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = documentReference.get();
        DocumentSnapshot documentSnapshot = documentSnapshotApiFuture.get();

        return documentSnapshot.exists();
    }
}
