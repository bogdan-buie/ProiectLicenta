package com.example.graphicstools.controller;

import com.example.graphicstools.service.ImageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/image")
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(path = "upload/idProject={idProject}")
    public String upload(@RequestParam("file") MultipartFile multipartFile, @PathVariable String idProject) {

        // pentru a putea atasa imagini de dimensiune mare am modificat limita in application.proprieties
        return imageService.upload(multipartFile, idProject);
    }

    @DeleteMapping(path = "delete/image={imageName}")
    public String deleteImage(@PathVariable String imageName) {
        return imageService.deleteImage(imageName);
    }
}
