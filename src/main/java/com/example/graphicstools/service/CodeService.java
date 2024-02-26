package com.example.graphicstools.service;

import com.example.graphicstools.model.Project;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

            Project myProject = projectService.getProject(projectId);
            myProject.setLink(URL);
            myProject.setFileName(fileName);
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
    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
