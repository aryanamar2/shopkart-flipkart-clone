package com.ecommerce.productservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
@Data
public class Product {

    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private double discountedPrice;
    private int discountPercent;
    private int quantity;
    private String brand;
    private String category;
    private String subCategory;
    private List<String> imageUrls;
    private double rating;
    private int reviewCount;
    private boolean inStock = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
