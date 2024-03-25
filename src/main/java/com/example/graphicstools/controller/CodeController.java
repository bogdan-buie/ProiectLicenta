package com.example.graphicstools.controller;

import com.example.graphicstools.service.CodeService;


import org.springframework.core.io.ByteArrayResource;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/code")
public class CodeController {
    private final CodeService codeService;
    public CodeController(CodeService codeService) {
        this.codeService = codeService;
    }

//    @GetMapping("/{fileName}")
//    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) throws IOException {
//
//        byte[] fileContent = codeService.downloadFile(fileName);
//        if (fileContent != null) {
//            ByteArrayResource resource = new ByteArrayResource(fileContent);
//            return ResponseEntity.ok()
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
//                    .body(resource);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @PostMapping(path = "upload/idProject={idProject}")
    public String upload(@RequestParam("file") MultipartFile multipartFile, @PathVariable String idProject) {
        return codeService.upload(multipartFile, idProject);
    }

    @PutMapping(path = "update/idProject={idProject}")
    public String update(@RequestParam("file") MultipartFile multipartFile, @PathVariable String idProject) {
        return codeService.updateFile(multipartFile, idProject);
    }

    @DeleteMapping(path = "delete/filename={name}")
    public String update(@PathVariable String name) {
        return codeService.deleteFile(name);
    }
}
