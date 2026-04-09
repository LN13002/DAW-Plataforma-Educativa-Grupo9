package com.aprende.ues.backend.repository;

import com.aprende.ues.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    
    boolean existsBySlug(String slug);

    
    Optional<Category> findBySlug(String slug);

   
    List<Category> findByParentIsNull();

    
    List<Category> findByParentId(UUID parentId);
}