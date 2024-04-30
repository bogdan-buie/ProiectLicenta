package com.example.graphicstools.service;

import com.example.graphicstools.dto.ProjectAuthResponse;
import com.example.graphicstools.dto.UserProjectDTO;
import com.example.graphicstools.dto.UserProjectsInfo;
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
        this.imageProjectService = new Image_ProjectService();
    }

    public ResponseEntity<String> saveProject(String userId, Project project) throws Exception {

        DocumentReference documentReference = db.collection(COLLECTION_NAME).add(project).get();
        String generatedId = documentReference.getId();
        project.setId(generatedId);
        project.setLastModification(System.currentTimeMillis());
        db.collection(COLLECTION_NAME).document(generatedId).set(project, SetOptions.merge());

        //actualizare tabel user_project
        userProjectService.saveUserProject(new User_Project("", userId, generatedId));
        return new ResponseEntity<>(generatedId, HttpStatus.CREATED);
    }

    public Project getProject(String id) throws Exception {
        ApiFuture<DocumentSnapshot> apiFuture = db.collection(COLLECTION_NAME).document(id).get();
        DocumentSnapshot document = apiFuture.get();
        if (document.exists()) {
            return document.toObject(Project.class);
        }
        return null;
    }

    public List<Project> getUserProjects(String myUserId) throws Exception {
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
            for (User_Project up : myUserProjects) {
                myProjects.add(this.getProject(up.getIdProject()));
            }
            return myProjects;
        }
        return null;
    }
    public List<Project> getNewestPublicProjects(String n_string) throws Exception {
        int n = Integer.parseInt(n_string);
        List<Project> projects = new ArrayList<>();

        // Interogare Firestore pentru proiectele publice, sortate după câmpul lastModification
        CollectionReference projectsRef = db.collection(COLLECTION_NAME);
        Query query = projectsRef.whereEqualTo("status", "public").orderBy("lastModification", Query.Direction.DESCENDING).limit(n);
        ApiFuture<QuerySnapshot> querySnapshotApiFuture = query.get();

        // Obținerea rezultatelor interogării și adăugarea lor în lista de proiecte
        QuerySnapshot querySnapshot = querySnapshotApiFuture.get();
        for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
            projects.add(document.toObject(Project.class));
        }

        return projects;
    }
    public List<Project> searchPublicProjects(String searchKey) {
        List<Project> projects = new ArrayList<>();
        String searchKeyLowerCase = searchKey.toLowerCase();
        try {
            CollectionReference projectsRef = db.collection(COLLECTION_NAME);

            Query titleQuery = projectsRef
                    .whereEqualTo("status", "public")
                    .orderBy("name");

            ApiFuture<QuerySnapshot> titleQuerySnapshot = titleQuery.get();

            QuerySnapshot queryResult = titleQuerySnapshot.get();
            for (QueryDocumentSnapshot document : queryResult) {
                Project project = document.toObject(Project.class);

                // Verificați dacă numele sau descrierea proiectului conține cheia de căutare
                if (project.getName().toLowerCase().contains(searchKeyLowerCase) ||
                        project.getDescription().toLowerCase().contains(searchKeyLowerCase)) {
                    projects.add(project);
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return projects;
    }
    public List<Project> getTopProjects(String n_string){
        int n = Integer.parseInt(n_string);
        List<Project> projects = new ArrayList<>();
        try {
            CollectionReference projectsRef = db.collection(COLLECTION_NAME);

            Query titleQuery = projectsRef
                    .whereEqualTo("status", "public")
                    .orderBy("importsNr", Query.Direction.DESCENDING) // Ordonăm descrescător
                    .limit(n);

            ApiFuture<QuerySnapshot> titleQuerySnapshot = titleQuery.get();

            QuerySnapshot queryResult = titleQuerySnapshot.get();
            for (QueryDocumentSnapshot document : queryResult) {
                Project project = document.toObject(Project.class);
                projects.add(project);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return projects;
    }
//    public List<Project> searchPublicProjects(String searchKey) {
//        System.out.println(searchKey);
//        List<Project> projects = new ArrayList<>();
//
//        try {
//            CollectionReference projectsRef = db.collection(COLLECTION_NAME);
//
//// Interogare Firestore pentru proiectele publice care conțin cheia de căutare în titlu
//            Query titleQuery = projectsRef
//                    .whereEqualTo("status", "public")
//                    .orderBy("name")
//                    .startAt(searchKey)
//                    .endAt(searchKey + "\uf8ff");
//
//            ApiFuture<QuerySnapshot> titleQuerySnapshot = titleQuery.get();
//
//// Obținerea rezultatelor interogării pentru titlu
//            QuerySnapshot titleQueryResult = titleQuerySnapshot.get();
//            for (QueryDocumentSnapshot document : titleQueryResult) {
//                Project project = document.toObject(Project.class);
//                projects.add(project);
//                System.out.println("Proiect găsit: " + project.getName()); // Afișăm titlul proiectului găsit
//            }
//
//
//            // Interogare Firestore pentru proiectele publice care conțin cheia de căutare în descriere
//            Query descriptionQuery = projectsRef
//                    .whereEqualTo("status", "public")
//                    .whereGreaterThanOrEqualTo("description", searchKey)
//                    .whereLessThanOrEqualTo("description", searchKey + "\uf8ff")
//                    .orderBy("description");
//            ApiFuture<QuerySnapshot> descriptionQuerySnapshot = descriptionQuery.get();
//
//            // Obținerea rezultatelor interogării pentru descriere și adăugarea lor în lista de proiecte
//            QuerySnapshot descriptionQueryResult = descriptionQuerySnapshot.get();
//            for (QueryDocumentSnapshot document : descriptionQueryResult) {
//                // Verificați dacă proiectul este deja în listă pentru a evita duplicarea
//                if (!projects.contains(document.toObject(Project.class))) {
//                    projects.add(document.toObject(Project.class));
//                }
//            }
//        } catch (InterruptedException | ExecutionException e) {
//            e.printStackTrace();
//        }
//
//        System.out.println(projects.size());
//        return projects;
//    }

    public UserProjectsInfo getUserProjectsInfo(String userId) throws Exception {
        User user = userService.getUser(userId);
        List<Project> myProjects = this.getUserProjects(userId);
        int totalProjects = myProjects.size();
        int totalGradedProjects = 0;
        for (Project p : myProjects) {
            if (p.getGrade() != 0) {
                totalGradedProjects++;
            }
        }
        UserProjectsInfo userProjectsInfo = new UserProjectsInfo();
        userProjectsInfo.setUserId(userId);
        userProjectsInfo.setEmail(user.getEmail());
        userProjectsInfo.setLevel(user.getLevel());
        userProjectsInfo.setTotalProjects(totalProjects);
        userProjectsInfo.setTotalGradedProjects(totalGradedProjects);
        userProjectsInfo.setTotalUngradedProjects(totalProjects - totalGradedProjects);

        return userProjectsInfo;
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

    public ProjectAuthResponse isUserAuthorizedToView(UserProjectDTO userProjectDTO) {
        String userId = userProjectDTO.getIdUser();
        String projectId = userProjectDTO.getIdProject();
        Project project;
        ProjectAuthResponse projectAuthResponse = new ProjectAuthResponse(false, false);
        try {
            project = this.getProject(projectId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (project.getStatus().equals("public")) {
            projectAuthResponse.setAuthToView(true);
        }

        try {
            // Interogare Firestore
            Query query = db.collection("user_project")
                    .whereEqualTo("idUser", userId)
                    .whereEqualTo("idProject", projectId);

            // Obținerea rezultatelor interogării
            QuerySnapshot querySnapshot = query.get().get(); // Atenție: get() poate arunca InterruptedException și ExecutionException

            // Verificarea dacă există rezultate
            if(!querySnapshot.isEmpty()){
                projectAuthResponse.setAuthToEdit(true);
                projectAuthResponse.setAuthToView(true);
            }
        } catch (InterruptedException | ExecutionException e) {
            // Tratarea excepțiilor
            System.err.println("Eroare la obținerea rezultatelor interogării: " + e.getMessage());
            projectAuthResponse.setAuthToEdit(false);
        }
        return projectAuthResponse;

    }


    public ResponseEntity<String> updateProject(String id, Project project) throws Exception {
        if (!doesProjectExistById(id)) {
            return new ResponseEntity<>("Project with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).set(project);
        return new ResponseEntity<>("Project updated with success", HttpStatus.OK);
    }
    public ResponseEntity<String> incrementImports(String id) throws Exception {
        if (!doesProjectExistById(id)) {
            return new ResponseEntity<>("Project with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        else{
            Project project = getProject(id);
            int importsNr = project.getImportsNr();
            importsNr++;
            project.setImportsNr(importsNr);
            ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).set(project);
            return new ResponseEntity<>("Project updated with success", HttpStatus.OK);
        }
    }

    public ResponseEntity<String> deleteProject(String id) throws Exception {

        if (!doesProjectExistById(id)) {
            return new ResponseEntity<>("Project with the given ID does not exist", HttpStatus.NOT_FOUND);
        }
        // stergem inregistrarile din celelalte tabele si apoi din colectia project
        // stergem din colectia user_project documentul care contine idProject
        userProjectService.deleteUserProjectByProjectId(id);

        CodeService codeService = new CodeService();
        Project myProject = this.getProject(id);

        if (myProject.getFileName() != null) {
            // stergem si fisierul din storage
            codeService.deleteFile(myProject.getFileName());
        }

        List<Image_Project> myImageProjects = this.getProjectImages(id);
        if (myImageProjects != null) {
            for (Image_Project ip : myImageProjects) {
                imageProjectService.deleteImageProject(ip.getId());
            }
        }
        // acum stergem inregistrarea din tabelul projects
        ApiFuture<WriteResult> collectionApifuture = db.collection(COLLECTION_NAME).document(id).delete();
        return new ResponseEntity<>("Project deleted with success", HttpStatus.OK);
    }

    /**
     * @param projectId
     * @return id-ul userului care a creat proiectul
     * @throws Exception
     */
    public User getUserByProjectId(String projectId) throws Exception {
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
            if (myUserProjects.size() == 1) {
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
