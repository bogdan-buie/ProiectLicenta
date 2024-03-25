package com.example.graphicstools.service;

import com.example.graphicstools.model.Project;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.UUID;
@Service
public class CodeService {
    private static final String BUCKET_NAME = "sodium-coil-312918.appspot.com";  //gs://sodium-coil-312918.appspot.com
    private static final String FOLDER = "projects";
    private ProjectService projectService;


    public CodeService() {
        this.projectService = new ProjectService();
    }

    private String uploadFile(File file, String fileName) throws IOException {
        BlobId blobId = BlobId.of(BUCKET_NAME, FOLDER + "/" + fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
        InputStream inputStream = CodeService.class.getClassLoader().getResourceAsStream("firebase-service-credentials.json");
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET_NAME + "/o/" + FOLDER + "%2f" + fileName + "?alt=media";

        //String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET_NAME + "/o/" + FOLDER + "/%s?alt=media";
        //return String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
        //return fileName;

        return DOWNLOAD_URL;
    }
    public String upload(MultipartFile multipartFile, String projectId) {
        try {

            // Firebase Storage
            String fileName = multipartFile.getOriginalFilename();                        // to get original file name
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));  // to generated random string values for file name.

            File file = this.convertToFile(multipartFile, fileName);                      // to convert multipartFile to File
            String URL = this.uploadFile(file, fileName);                                 // to get uploaded file link
            file.delete();

            // Setare link si numele fisierului asociat
            Project myProject = projectService.getProject(projectId);
            myProject.setLink(URL);
            myProject.setFileName(fileName);
            myProject.setLastModification(System.currentTimeMillis());
            projectService.updateProject(projectId,myProject);

            return URL;
        } catch (Exception e) {
            e.printStackTrace();
            return "File couldn't upload, Something went wrong";
        }
    }
    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
            fos.close();
        }
        return tempFile;
    }

    /**
     * Doar sterge fisierul cu un anumit nume din storage
     * @param fileName numele fisierului
     */
    public String deleteFile(String fileName) {
        try {
            Storage storage = StorageOptions.getDefaultInstance().getService();
            BlobId blobId = BlobId.of(BUCKET_NAME, FOLDER + "/" + fileName);
            boolean deleted = storage.delete(blobId);
            if (deleted) {
               return "File deleted successfully: " + fileName;
            } else {
                return "Failed to delete file: " + fileName;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Failed to delete file: " + fileName;
    }

    public String updateFile(MultipartFile multipartFile, String projectId) {
        try {
            // identificam proiectul care trebuie actualizat si numele fisierului asociat
            Project myProject = this.projectService.getProject(projectId);
            String oldFileName = myProject.getFileName();

            // Șterge fișierul vechi
            if(oldFileName!=null){
                deleteFile(oldFileName);
            }

            // Incarcam fișierul nou
            return upload(multipartFile, projectId);
        } catch (Exception e) {
            e.printStackTrace();
            return "File couldn't be updated. Something went wrong";
        }
    }
    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }
//    public byte[] downloadFile(String fileName) throws IOException {
//        InputStream inputStream = CodeService.class.getClassLoader().getResourceAsStream("firebase-service-credentials.json");
//        Credentials credentials = GoogleCredentials.fromStream(inputStream);
//        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
//
//        Blob blob = storage.get(BUCKET_NAME,FOLDER + "/"+ fileName);
//        if (blob != null) {
//            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//            blob.downloadTo(outputStream);
//            return outputStream.toByteArray();
//        }
//        return null;
//    }

}
