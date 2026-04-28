package com.ecommerce.cartservice.model;

import lombok.Data;

@Data
public class CartItem {
    private String productId;
    private String productName;
    private String imageUrl;
    private double price;
    private int quantity;
    private double totalPrice;
}
