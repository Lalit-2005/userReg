package com.userpage.UserReg.exception;

import lombok.Data;

@Data
public class ErrorResponse {

    private String message;
    private int status;
    private String path;
    private String timestamp;

    public ErrorResponse(String message, int status, String path, String timestamp) {
        this.message = message;
        this.status = status;
        this.path = path;
        this.timestamp = timestamp;
    }
}
