package com.example.graphicstools.controller;

import com.example.graphicstools.dto.ChangePassword;
import com.example.graphicstools.model.User;
import com.example.graphicstools.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Obtine un utilizator bazat pe id-ul unic
     * @param uid Identificatorul unic la utilizatorului
     * @return Un obiect ResponseEntity care contine user-ul gasit si statusul HTTP OK
     */
    @GetMapping(path="/get/{uid}")
    public ResponseEntity<User> get(@PathVariable String uid) throws Exception {
        User user = userService.getUser(uid);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping(path="?classId={classId}")
    public ResponseEntity<List<User>> getUsersByClassId(@PathVariable String classId) {
        try {
            List<User> users = userService.getUsersByClassId(classId);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping(path="/create")
//    public ResponseEntity<String> save(@RequestBody User user) throws Exception {
//        return userService.saveUser(user);
//    }
//    @PostMapping(path="/login")
//    public ResponseEntity<LoginResponse> login(@RequestBody UserCredentials userCredentials) throws Exception {
//        return userService.login(userCredentials);
//    }

    @PutMapping (path= "/update/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody User user) throws Exception{
        return userService.updateUser(id,user);
    }
    @PostMapping (path= "/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePassword changePassword) throws Exception{
        return userService.changePassword(changePassword);
    }

    @DeleteMapping(path="/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) throws Exception{
        return userService.deleteUser(id);
    }
}