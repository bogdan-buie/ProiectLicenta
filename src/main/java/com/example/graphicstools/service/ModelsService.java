package com.example.graphicstools.service;

import com.example.graphicstools.dto.ModelUploadResponse;
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
public class ModelsService {

    private static final String BUCKET_NAME = "sodium-coil-312918.appspot.com";  //gs://sodium-coil-312918.appspot.com
    private static final String FOLDER = "models";
    private Model_ProjectService modelProjectService;


    public ModelsService() {
        this.modelProjectService = new Model_ProjectService();
    }

    private String uploadFile(File file, String fileName) throws IOException {
        BlobId blobId = BlobId.of(BUCKET_NAME, FOLDER + "/" + fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
        InputStream inputStream = CodeService.class.getClassLoader().getResourceAsStream("firebase-service-credentials.json");
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET_NAME + "/o/" + FOLDER + "%2f" + fileName + "?alt=media";

        return DOWNLOAD_URL;
    }
    public ModelUploadResponse upload(MultipartFile multipartFile) {
        try {

            // Firebase Storage
            String fileName = multipartFile.getOriginalFilename();// to get original file name
            String name = UUID.randomUUID().toString();
            String extension = this.getExtension(fileName);
            fileName = name.concat(extension);  // to generated random string values for file name.

            File file = this.convertToFile(multipartFile, fileName);                      // to convert multipartFile to File
            String URL = this.uploadFile(file, fileName);                                 // to get uploaded file link
            file.delete();
//            System.out.println(URL);
//            System.out.println(fileName);
//            System.out.println(name);
//            System.out.println(extension);
            ModelUploadResponse response = new ModelUploadResponse(URL, fileName, extension);
            return response;
            //return URL;

        } catch (Exception e) {
            e.printStackTrace();
//            return "File couldn't upload, Something went wrong";
            return null;
        }
    }
    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
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

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }

}
