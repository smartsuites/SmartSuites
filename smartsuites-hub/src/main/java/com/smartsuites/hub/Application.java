/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

/**
 * Created by wuyufei on 08/08/2017.
 */
public class Application {


    public static void main(String[] args) throws IOException, ExecutionException, InterruptedException {

        //ApplicationContext context = new ClassPathXmlApplicationContext("classpath:application.xml");

        /*Settings settings = Settings.builder().put("cluster.name","es-cluster").build();
        TransportClient esClient = new PreBuiltTransportClient(settings);
        esClient.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("linux"), 9300));

        GetResponse getResponse = esClient.prepareGet(Constant.ES_INDEX,Constant.ES_MOVIE_TYPE,"3062").get();

        //Map<String,GetField> filed = getResponse.getFields();

        Object value = getResponse.getSourceAsMap().get("tags");

        if(value == null){
            UpdateRequest updateRequest = new UpdateRequest(Constant.ES_INDEX,Constant.ES_MOVIE_TYPE,"3062");
            updateRequest.doc(XContentFactory.jsonBuilder().startObject()
            .field("tags","abc")
            .endObject());
            esClient.update(updateRequest).get();
        }else{
            UpdateRequest updateRequest = new UpdateRequest(Constant.ES_INDEX,Constant.ES_MOVIE_TYPE,"2542");
            updateRequest.doc(XContentFactory.jsonBuilder().startObject()
                    .field("tags",value+"|abc")
            .endObject());
            esClient.update(updateRequest).get();
        }
*/
        System.out.println(Math.round(4.466D));

    }

}
