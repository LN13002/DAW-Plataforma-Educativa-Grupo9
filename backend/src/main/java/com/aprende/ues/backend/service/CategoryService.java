package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CategoryRequestDTO;
import com.aprende.ues.backend.dto.CategoryResponseDTO;
import com.aprende.ues.backend.model.Category;
import com.aprende.ues.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponseDTO findById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        return toResponse(category);
    }

    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO request) {
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug already exists");
        }

        Category category = new Category();
        return toResponse(categoryRepository.save(toEntity(request, category)));
    }

    @Transactional
    public CategoryResponseDTO update(UUID id, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        
        return toResponse(categoryRepository.save(toEntity(request, category)));
    }

    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        categoryRepository.deleteById(id);
    }

    
    private CategoryResponseDTO toResponse(Category category) {
        CategoryResponseDTO.ParentCategoryDTO parentDTO = null;
        
        if (category.getParent() != null) {
            parentDTO = new CategoryResponseDTO.ParentCategoryDTO(
                category.getParent().getId(),
                category.getParent().getName(),
                category.getParent().getSlug()
            );
        }

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                parentDTO
        );
    }

    
    private Category toEntity(CategoryRequestDTO request, Category category) {
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setDescription(request.description());

        
        if (request.parentId() != null) {
            Category parent = categoryRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return category;
    }
}