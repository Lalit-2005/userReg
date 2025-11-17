package com.userpage.UserReg.AOP;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.userpage.UserReg.service.*.*(..))")
    public void before(JoinPoint joinPoint) {
        System.out.println("Entering: " + joinPoint.getSignature());
    }

    @AfterReturning("execution(* com.userpage.UserReg.service.*.*(..))")
    public void afterSuccess(JoinPoint joinPoint) {
        System.out.println("Success: " + joinPoint.getSignature());
    }

    @AfterThrowing(pointcut = "execution(* com.userpage.UserReg.service.*.*(..))", throwing = "ex")
    public void afterException(JoinPoint joinPoint, Exception ex) {
        System.out.println("Exception in " + joinPoint.getSignature() + " | Message: " + ex.getMessage());
    }
}
