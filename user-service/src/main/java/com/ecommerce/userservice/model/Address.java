package com.ecommerce.userservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String country = "India";
    private boolean isDefault = false;
}
