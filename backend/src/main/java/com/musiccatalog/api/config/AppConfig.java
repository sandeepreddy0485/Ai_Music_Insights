package com.musiccatalog.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);

        RestTemplate restTemplate = new RestTemplate(factory);

        // Support text/javascript, text/plain, and application/json from Apple iTunes API
        MappingJackson2HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter();
        List<MediaType> mediaTypes = new ArrayList<>(jacksonConverter.getSupportedMediaTypes());
        mediaTypes.add(new MediaType("text", "javascript"));
        mediaTypes.add(new MediaType("text", "plain"));
        mediaTypes.add(MediaType.ALL);
        jacksonConverter.setSupportedMediaTypes(mediaTypes);

        restTemplate.getMessageConverters().add(0, jacksonConverter);

        return restTemplate;
    }
}
