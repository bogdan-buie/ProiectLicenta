package com.example.graphicstools.controller;

import com.example.graphicstools.dto.AuthResponse;
import com.example.graphicstools.dto.UserCredentials;
import com.example.graphicstools.model.User;
import com.example.graphicstools.security.JwtService;
import com.example.graphicstools.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private JwtService jwtService;
    final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("api/v1/public/login")
    public ResponseEntity<?> login(@RequestBody UserCredentials userCredentials) throws Exception {
        User user = userService.login2(userCredentials);
        if(user!= null){
            String token = jwtService.generateToken(user.getUid());
            return ResponseEntity.ok(new AuthResponse(user.getUid(),user.getRole(),"Successful login", token));
        }

        return ResponseEntity.ok("Login failed");
    }
    @PostMapping(path="api/v1/public/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) throws Exception {
        AuthResponse authResponse = userService.saveUser(user);
        if(authResponse.getMessage().equals("User added with success")){
            String token = jwtService.generateToken(user.getUid());
            authResponse.setToken(token);
            return ResponseEntity.ok(authResponse);
        }
        return  ResponseEntity.ok(authResponse);
    }
    @GetMapping("api/v1/public")
    public String getPublic() throws Exception {
        return "Mesaj public";
    }
}
