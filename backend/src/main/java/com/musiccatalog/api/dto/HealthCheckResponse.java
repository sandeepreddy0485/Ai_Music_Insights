package com.musiccatalog.api.dto;

import java.time.LocalDateTime;

public class HealthCheckResponse {
    private String status;
    private String service;
    private String version;
    private String activeProfile;
    private LocalDateTime timestamp;

    public HealthCheckResponse() {}

    public HealthCheckResponse(String status, String service, String version, String activeProfile, LocalDateTime timestamp) {
        this.status = status;
        this.service = service;
        this.version = version;
        this.activeProfile = activeProfile;
        this.timestamp = timestamp;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getActiveProfile() { return activeProfile; }
    public void setActiveProfile(String activeProfile) { this.activeProfile = activeProfile; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String status;
        private String service;
        private String version;
        private String activeProfile;
        private LocalDateTime timestamp;

        public Builder status(String status) { this.status = status; return this; }
        public Builder service(String service) { this.service = service; return this; }
        public Builder version(String version) { this.version = version; return this; }
        public Builder activeProfile(String activeProfile) { this.activeProfile = activeProfile; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public HealthCheckResponse build() {
            return new HealthCheckResponse(status, service, version, activeProfile, timestamp);
        }
    }
}

