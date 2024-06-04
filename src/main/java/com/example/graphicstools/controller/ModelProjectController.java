package com.example.graphicstools.controller;

import com.example.graphicstools.model.Model_Project;
import com.example.graphicstools.model.Project;
import com.example.graphicstools.service.Model_ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/modelproject")
public class ModelProjectController {
    final Model_ProjectService modelProjectService;

    public ModelProjectController(Model_ProjectService modelProjectService) {
        this.modelProjectService = modelProjectService;
    }
    @GetMapping(path="/get/{projectId}")
    public List<Model_Project> get(@PathVariable String projectId) throws Exception {
        return modelProjectService.getModelProjects(projectId);
    }
    @PostMapping(path="/create")
    public void save(@RequestBody Model_Project modelProject) throws Exception {
        modelProjectService.saveModelProject(modelProject);
    }
    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) throws Exception {
        return modelProjectService.deleteModelProjectById(id);
    }
}
