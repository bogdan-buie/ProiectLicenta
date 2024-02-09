package com.example.graphicstools.controller;

import com.example.graphicstools.service.CodeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/code")
public class CodeController {
    private final CodeService codeService;

    public CodeController(CodeService codeService) {
        this.codeService = codeService;
    }
    @PostMapping(path = "upload/idProject={idProject}")
    public String upload(@RequestParam("file") MultipartFile multipartFile, @PathVariable String idProject) {
        return codeService.upload(multipartFile, idProject);
    }
}
