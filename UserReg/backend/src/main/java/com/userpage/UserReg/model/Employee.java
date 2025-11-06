package com.userpage.UserReg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String empCode;
    private String gender;
    private String location;
    private String department;
    private String dob;
    private String employmentStatus;
    private String email;
    private String startDate;
    private String jobTitle;
}
