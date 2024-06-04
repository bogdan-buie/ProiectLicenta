package com.example.graphicstools.controller;

import com.example.graphicstools.dto.ModelUploadResponse;
import com.example.graphicstools.service.ModelsService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@Controller
@RequestMapping("/api/v1/models")
public class ModelController {
    private final ModelsService modelService;

    public ModelController(ModelsService modelProjectService) {
        this.modelService = modelProjectService;
    }

//    @GetMapping
//    public ResponseEntity<byte[]> getModel(@RequestParam String fileName) throws IOException {
//        Resource resource = new ClassPathResource("models/" + fileName);
//        InputStream inputStream = resource.getInputStream();
//        byte[] bytes = inputStream.readAllBytes();
//        return ResponseEntity.ok().body(bytes);
//    }
    @PostMapping(path = "/upload")
    public ResponseEntity<ModelUploadResponse> upload(@RequestParam("file") MultipartFile multipartFile) {
        ModelUploadResponse response = modelService.upload(multipartFile);
        return ResponseEntity.ok().body(response);
    }
    @DeleteMapping(path = "/delete/{name}")
    public String delete(@PathVariable String name) {
        return modelService.deleteFile(name);
    }

}
