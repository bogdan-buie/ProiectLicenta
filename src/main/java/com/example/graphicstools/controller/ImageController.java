package com.example.graphicstools.controller;

import com.example.graphicstools.service.ImageService;
import com.example.graphicstools.service.Image_ProjectService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("api/v1/image")
public class ImageController {
    private final ImageService imageService;
    private final Image_ProjectService imageProjectService;

    public ImageController() {
        this.imageService = new ImageService();
        imageProjectService = new Image_ProjectService();
    }

    @PostMapping(path = "upload/idProject={idProject}")
    public String upload(@RequestParam("file") MultipartFile multipartFile, @PathVariable String idProject) {

        // pentru a putea atasa imagini de dimensiune mare am modificat limita in application.proprieties
        return imageService.upload(multipartFile, idProject);
    }

    @DeleteMapping(path = "delete/image={imageName}")
    public String deleteImage(@PathVariable String imageName) throws ExecutionException, InterruptedException {
        return imageProjectService.deleteImageProjectByImageName(imageName);
    }
}
