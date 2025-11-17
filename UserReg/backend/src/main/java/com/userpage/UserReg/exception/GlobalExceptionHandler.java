package com.userpage.UserReg.exception;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private ErrorResponse buildError(String message, int status, HttpServletRequest request) {
        return new ErrorResponse(
                message,
                status,
                request.getRequestURI(),
                LocalDateTime.now().toString()
        );
    }

    @ExceptionHandler(DuplicateEmpCodeException.class)
    public ResponseEntity<?> handleDuplicate(DuplicateEmpCodeException ex, HttpServletRequest request) {
        return new ResponseEntity<>(
                buildError(ex.getMessage(), 400, request),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<?> handleNotFound(EmployeeNotFoundException ex, HttpServletRequest request) {
        return new ResponseEntity<>(
                buildError(ex.getMessage(), 404, request),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex, HttpServletRequest request) {
        ex.printStackTrace();
        return new ResponseEntity<>(
                buildError("Something went wrong!", 500, request),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
