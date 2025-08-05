package com.unit_2_project.volunteer_stl;

import org.apache.tomcat.util.http.fileupload.FileUpload;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MultipartConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> multipartConfigCustomizer() {
        return factory -> factory.addConnectorCustomizers(connector -> {
            connector.setMaxPostSize(20 * 1024 * 1024);
            connector.setMaxSavePostSize(20 * 1024 * 1024);
            connector.setProperty("maxParameterCount", "10000");
            connector.setProperty("maxFileCount", "10");
        });
    }
}
