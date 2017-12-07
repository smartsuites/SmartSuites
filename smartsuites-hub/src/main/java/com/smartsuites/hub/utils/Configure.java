/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.utils;

import com.atguigu.commons.conf.ConfigurationManager;
import com.atguigu.commons.constant.Constants;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.Jedis;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
public class Configure {

    private String esClusterName;
    private String esHost;
    private int esPort;
    private String redisHost;

    public Configure() {
        this.esClusterName = ConfigurationManager.config().getString(Constants.ES_CLUSTER_NAME());
        this.esHost = ConfigurationManager.config().getString(Constants.ES_HTTPHOSTS()).split(":")[0];
        this.esPort = Integer.parseInt(ConfigurationManager.config().getString(Constants.ES_HTTPHOSTS()).split(":")[1]);
        this.redisHost = ConfigurationManager.config().getString(Constants.REDIS_HOST());
    }

    @Bean(name = "transportClient")
    public TransportClient getTransportClient() throws UnknownHostException {
        Settings settings = Settings.builder().put("cluster.name", esClusterName).build();
        TransportClient esClient = new PreBuiltTransportClient(settings);
        esClient.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(esHost), esPort));
        return esClient;
    }

    @Bean(name = "jedis")
    public Jedis getRedisClient() {
        Jedis jedis = new Jedis(redisHost);
        return jedis;
    }
}
