package com.userpage.UserReg.service;

import com.userpage.UserReg.model.Employee;
import com.userpage.UserReg.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public Employee addEmployee(Employee employee) {
        return repo.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return repo.findAll();
    }

    public Employee updateEmployee(Long id, Employee newEmp) {
        return repo.findById(id)
                .map(emp -> {
                    emp.setFirstName(newEmp.getFirstName());
                    emp.setLastName(newEmp.getLastName());
                    emp.setEmpCode(newEmp.getEmpCode());
                    emp.setGender(newEmp.getGender());
                    emp.setLocation(newEmp.getLocation());
                    emp.setDepartment(newEmp.getDepartment());
                    emp.setDob(newEmp.getDob());
                    emp.setEmploymentStatus(newEmp.getEmploymentStatus());
                    emp.setEmail(newEmp.getEmail());
                    emp.setStartDate(newEmp.getStartDate());
                    emp.setJobTitle(newEmp.getJobTitle());
                    return repo.save(emp);
                })
                .orElse(null);
    }

    public void deleteEmployee(Long id) {
        repo.deleteById(id);
    }
}
