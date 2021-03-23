package org.ncita.ResourceServerApplication.Model;

// Simple domain object for the API to return a message.
public class Message {
    private final String message;

    public Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
