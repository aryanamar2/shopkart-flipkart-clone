package com.ecommerce.paymentservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long userId;
    private double amount;
    private String method;
    private String status = "PENDING";
    private String transactionId;
    private LocalDateTime createdAt = LocalDateTime.now();
}
