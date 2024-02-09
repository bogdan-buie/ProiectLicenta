package com.example.graphicstools.controller;

import com.example.graphicstools.model.Classroom;
import com.example.graphicstools.service.ClassroomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/classroom")
public class ClassroomController {
    final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping(path="/get/{id}")
    public ResponseEntity<Classroom> get(@PathVariable String id) throws Exception {
        Classroom classroom = classroomService.getClassroom(id);
        return new ResponseEntity<>(classroom, HttpStatus.OK);
    }

    @PostMapping(path="/create")
    public ResponseEntity<String> save(@RequestBody Classroom classroom) throws Exception {
        return classroomService.saveClassroom(classroom);
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody Classroom classroom) throws Exception {
        return classroomService.updateClassroom(id, classroom);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) throws Exception {
        return classroomService.deleteClassroom(id);
    }
}
