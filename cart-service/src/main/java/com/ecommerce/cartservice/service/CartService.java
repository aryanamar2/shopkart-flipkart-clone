package com.ecommerce.cartservice.service;

import com.ecommerce.cartservice.model.Cart;
import com.ecommerce.cartservice.model.CartItem;
import com.ecommerce.cartservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId).orElse(new Cart());
    }

    public Cart addToCart(Long userId, CartItem item) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(userId);
            return c;
        });

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(item.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + item.getQuantity());
            existing.get().setTotalPrice(existing.get().getPrice() * existing.get().getQuantity());
        } else {
            item.setTotalPrice(item.getPrice() * item.getQuantity());
            cart.getItems().add(item);
        }

        recalculate(cart);
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(Long userId, String productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .ifPresent(i -> {
                    i.setQuantity(quantity);
                    i.setTotalPrice(i.getPrice() * quantity);
                });
        recalculate(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        recalculate(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setTotalAmount(0);
            cartRepository.save(cart);
        });
    }

    private void recalculate(Cart cart) {
        double total = cart.getItems().stream().mapToDouble(CartItem::getTotalPrice).sum();
        cart.setTotalAmount(total);
    }
}
