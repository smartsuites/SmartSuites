/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.service;

import com.smartsuites.hub.model.domain.Tag;
import com.atguigu.commons.constant.Constants;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class TagService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TransportClient esClient;


    public void newTag(Tag tag) {
        jdbcTemplate.update("insert into " + Constants.DB_TAG() + "(uid,mid,tag,timestamp) values(?,?,?,?)",
                new Object[]{tag.getUid(), tag.getMid(), tag.getTag(), tag.getTimestamp()});
    }

    private void updateElasticSearchIndex(Tag tag) {
        GetResponse getResponse = esClient.prepareGet(Constants.ES_INDEX(), Constants.ES_TYPE(), String.valueOf(tag.getMid())).get();
        Object value = getResponse.getSourceAsMap().get("tags");
        UpdateRequest updateRequest = new UpdateRequest(Constants.ES_INDEX(), Constants.ES_TYPE(), String.valueOf(tag.getMid()));
        try {
            if (value == null) {
                updateRequest.doc(XContentFactory.jsonBuilder().startObject().field("tags", tag.getTag()).endObject());
            } else {
                updateRequest.doc(XContentFactory.jsonBuilder().startObject().field("tags", value + "|" + tag.getTag()).endObject());
            }
            esClient.update(updateRequest).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Tag> findMovieTags(int mid) {
        List<Tag> tags = null;
        tags = jdbcTemplate.query("select * from " + Constants.DB_TAG() + " where mid=" + mid, new RowMapper<Tag>() {
            @Override
            public Tag mapRow(ResultSet resultSet, int i) throws SQLException {
                Tag tag = null;
                if (resultSet.next()) {
                    tag = new Tag();
                    tag.setUid(resultSet.getInt("uid"));
                    tag.setMid(resultSet.getInt("mid"));
                    tag.setTag(resultSet.getString("tag"));
                    tag.setTimestamp(resultSet.getInt("timestamp"));
                }
                return tag;
            }
        });
        return tags;
    }

    public List<Tag> findMyMovieTags(int uid, int mid) {
        List<Tag> tags = null;
        tags = jdbcTemplate.query("select * from " + Constants.DB_TAG() + " where uid=" + uid + " and mid=" + mid, new RowMapper<Tag>() {
            @Override
            public Tag mapRow(ResultSet resultSet, int i) throws SQLException {
                Tag tag = null;
                if (resultSet.next()) {
                    tag = new Tag();
                    tag.setUid(resultSet.getInt("uid"));
                    tag.setMid(resultSet.getInt("mid"));
                    tag.setTag(resultSet.getString("tag"));
                    tag.setTimestamp(resultSet.getInt("timestamp"));
                }
                return tag;
            }
        });
        return tags;
    }

    //TODO EID?
    public void removeTag(int eid) {
        jdbcTemplate.execute("delete from " + Constants.DB_TAG() + " where eid=" + eid);
    }

}
