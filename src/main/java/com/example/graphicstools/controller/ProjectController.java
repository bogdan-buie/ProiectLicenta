package com.example.graphicstools.controller;

import com.example.graphicstools.model.Project;
import com.example.graphicstools.service.ProjectService;
import com.example.graphicstools.service.User_ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/project")
public class ProjectController {

    final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping(path="/get/{id}")
    public ResponseEntity<Project> get(@PathVariable String id) throws Exception {
        Project project = projectService.getProject(id);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping(path="/create/user={userId}")
    public ResponseEntity<String> save(@PathVariable String userId, @RequestBody Project project) throws Exception {
        return projectService.saveProject(userId,project);
    }

    @PutMapping(path = "/create/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Project project) throws Exception {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping(path = "/delete{id}")
    public ResponseEntity<String> delete(@PathVariable String id) throws Exception {
        return projectService.deleteProject(id);
    }
}
