package com.ecommerce.productservice.service;

import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.model.Review;
import com.ecommerce.productservice.repository.ProductRepository;
import com.ecommerce.productservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public Product createProduct(Product product) {
        double discounted = product.getPrice() * (1 - product.getDiscountPercent() / 100.0);
        product.setDiscountedPrice(Math.round(discounted * 100.0) / 100.0);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchByName(keyword);
    }

    public Product updateProduct(String id, Product updated) {
        Product product = getProductById(id);
        product.setName(updated.getName());
        product.setPrice(updated.getPrice());
        product.setDiscountPercent(updated.getDiscountPercent());
        product.setQuantity(updated.getQuantity());
        product.setDescription(updated.getDescription());
        double discounted = updated.getPrice() * (1 - updated.getDiscountPercent() / 100.0);
        product.setDiscountedPrice(Math.round(discounted * 100.0) / 100.0);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public Review addReview(String productId, Review review) {
        review.setProductId(productId);
        Review saved = reviewRepository.save(review);
        updateProductRating(productId);
        return saved;
    }

    public List<Review> getReviews(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    private void updateProductRating(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        Product product = getProductById(productId);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setReviewCount(reviews.size());
        productRepository.save(product);
    }
}
