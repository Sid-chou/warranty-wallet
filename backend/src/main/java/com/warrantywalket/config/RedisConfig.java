package com.warrantywalket.config;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisConfig {

    @Value("${upstash.redis.url}")
    private String redisUrl;

    @Bean
    public StatefulRedisConnection<String, String> redisConnection() {
        RedisURI uri = RedisURI.create(redisUrl);
        RedisClient client = RedisClient.create(uri);
        return client.connect();
    }

    @Bean
    public RedisCommands<String, String> redisCommands(
            StatefulRedisConnection<String, String> connection) {
        return connection.sync();
    }
}