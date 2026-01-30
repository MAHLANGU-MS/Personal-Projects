package com.focusflow.dto;
import lombok.*;
import jakarta.validation.constraints.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Size(min = 3, max = 100)
    private String username;
    
    @NotBlank @Email
    private String email;
    
    @NotBlank @Size(min = 8)
    private String password;
    
    private String firstName;
    private String lastName;
}
