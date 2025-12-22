package com.warrantywalket.repository;

import com.warrantywalket.model.Warranty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WarrantyRepository extends MongoRepository<Warranty, String> {

    List<Warranty> findByUserId(String userId);

    List<Warranty> findByUserIdAndStatus(String userId, String status);

    List<Warranty> findByUserIdAndExpiryDateBefore(String userId, LocalDate date);

    List<Warranty> findByUserIdAndExpiryDateAfter(String userId, LocalDate date);

    List<Warranty> findByUserIdOrderByExpiryDateAsc(String userId);
}
