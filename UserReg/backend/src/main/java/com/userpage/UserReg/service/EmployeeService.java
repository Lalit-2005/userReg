package com.userpage.UserReg.service;
import com.userpage.UserReg.exception.DuplicateEmpCodeException;
import com.userpage.UserReg.exception.EmployeeNotFoundException;
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
        if (repo.existsByEmpCode(employee.getEmpCode())) {
            throw new DuplicateEmpCodeException("Employee Code already exists!");
        }
        return repo.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return repo.findAll();
    }

    public Employee updateEmployee(Long id, Employee newEmp) {
        Employee emp = repo.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with ID " + id + " not found"));

        if (!emp.getEmpCode().equals(newEmp.getEmpCode())
                && repo.existsByEmpCode(newEmp.getEmpCode())) {
            throw new DuplicateEmpCodeException("Employee Code already exists!");
        }
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
    }
    public void deleteEmployee(Long id) {
        if (!repo.existsById(id)) {
            throw new EmployeeNotFoundException("Employee with ID " + id + " not found");
        }
        repo.deleteById(id);
    }
}
