package com.example.graphicstools.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;

@Controller
@RequestMapping("/api/v1/public/models")
public class ModelController {

    @GetMapping
    public ResponseEntity<byte[]> getModel(@RequestParam String fileName) throws IOException {
        Resource resource = new ClassPathResource("models/" + fileName);
        InputStream inputStream = resource.getInputStream();
        byte[] bytes = inputStream.readAllBytes();
        return ResponseEntity.ok().body(bytes);
    }
}
