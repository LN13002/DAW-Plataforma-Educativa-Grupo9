package com.aprende.ues.backend.exceptions;

public class ReviewAlreadyExistsException extends RuntimeException {

  public ReviewAlreadyExistsException(String userId, String courseId) {
        super("A review for course " + courseId + " by user " + userId + " already exists");
  }

}
