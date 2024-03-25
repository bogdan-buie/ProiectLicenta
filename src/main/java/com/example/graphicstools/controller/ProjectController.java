package com.example.graphicstools.controller;

import com.example.graphicstools.model.Image_Project;
import com.example.graphicstools.model.Project;
import com.example.graphicstools.model.User;
import com.example.graphicstools.service.ProjectService;
import com.example.graphicstools.service.User_ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping(path="/get/user={userId}")
    public ResponseEntity<List<Project>> getProjects(@PathVariable String userId) throws Exception {

        List<Project> userProjects = projectService.getUserProjects(userId);
        return new ResponseEntity<>(userProjects, HttpStatus.OK);
    }
    @GetMapping(path="/get/images/{id}")
    public ResponseEntity<List<Image_Project>> getImageProject(@PathVariable String id) throws Exception {

        List<Image_Project> imageProjects = projectService.getProjectImages(id);
        return new ResponseEntity<>(imageProjects, HttpStatus.OK);
    }
    @GetMapping(path="/get/userId/idProject={id}")
    public ResponseEntity<User> getUserId(@PathVariable String id) throws Exception {

        User user = projectService.getUserByProjectId(id);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @PostMapping(path="/create/user={userId}")
    public ResponseEntity<String> save(@PathVariable String userId, @RequestBody Project project) throws Exception {
        return projectService.saveProject(userId,project);
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Project project) throws Exception {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) throws Exception {
        return projectService.deleteProject(id);
    }
}
