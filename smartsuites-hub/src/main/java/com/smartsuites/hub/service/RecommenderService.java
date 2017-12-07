/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.service;

import com.smartsuites.hub.model.recom.Recommendation;
import com.atguigu.business.model.request.*;
import com.atguigu.commons.constant.Constants;
import com.smartsuites.hub.model.request.*;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.FuzzyQueryBuilder;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommenderService {

    // 混合推荐中CF的比例
    private static Double CF_RATING_FACTOR = 0.3;
    private static Double CB_RATING_FACTOR = 0.3;
    private static Double SR_RATING_FACTOR = 0.4;

    @Autowired
    private TransportClient esClient;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 协同过滤推荐【电影相似性】
    private List<Recommendation> findMovieCFRecs(int mid, int maxItems) {
        String result = null;
        result = jdbcTemplate.query("select * from " + Constants.DB_MOVIE_RECS() + " where mid=" + mid, new ResultSetExtractor<String>() {
            @Override
            public String extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                String result = null;
                if (resultSet.next()) {
                    result = resultSet.getString("recs");
                }
                return result;
            }
        });
        List<Recommendation> recs = new ArrayList<>();

        if(result!=null && !result.isEmpty()){
            for (String item:result.split("\\|")) {
                String[] attrs = item.split(":");
                recs.add(new Recommendation(Integer.parseInt(attrs[0]),Double.parseDouble(attrs[1])));
            }
        }
        return recs.subList(0,recs.size()>maxItems?maxItems-1:recs.size()-1);
    }

    // 协同过滤推荐【用户电影矩阵】
    private List<Recommendation> findUserCFRecs(int uid, int maxItems) {
        String result = null;
        result = jdbcTemplate.query("select * from " + Constants.DB_USER_RECS() + " where uid=" + uid, new ResultSetExtractor<String>() {
            @Override
            public String extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                String result = null;
                if (resultSet.next()) {
                    result = resultSet.getString("recs");
                }
                return result;
            }
        });
        List<Recommendation> recs = new ArrayList<>();

        if(result!=null && !result.isEmpty()){
            for (String item:result.split("\\|")) {
                String[] attrs = item.split(":");
                recs.add(new Recommendation(Integer.parseInt(attrs[0]),Double.parseDouble(attrs[1])));
            }
        }
        return recs.subList(0,recs.size()>maxItems?maxItems-1:recs.size()-1);
    }

    // 基于内容的推荐算法
    private List<Recommendation> findContentBasedMoreLikeThisRecommendations(int mid, int maxItems) {
        MoreLikeThisQueryBuilder query = QueryBuilders.moreLikeThisQuery(/*new String[]{"name", "descri", "genres", "actors", "directors", "tags"},*/
                new MoreLikeThisQueryBuilder.Item[]{new MoreLikeThisQueryBuilder.Item(Constants.ES_INDEX(), Constants.ES_TYPE(), String.valueOf(mid))});

        return parseESResponse(esClient.prepareSearch().setQuery(query).setSize(maxItems).execute().actionGet());
    }

    // 实时推荐
    private List<Recommendation> findStreamRecs(int uid,int maxItems){
        String result = null;
        result = jdbcTemplate.query("select * from " + Constants.DB_STREAM_RECS() + " where uid=" + uid, new ResultSetExtractor<String>() {
            @Override
            public String extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                String result = null;
                if (resultSet.next()) {
                    result = resultSet.getString("recs");
                }
                return result;
            }
        });
        List<Recommendation> recs = new ArrayList<>();

        if(result!=null && !result.isEmpty()){
            for (String item:result.split("\\|")) {
                String[] attrs = item.split(":");
                recs.add(new Recommendation(Integer.parseInt(attrs[0]),Double.parseDouble(attrs[1])));
            }
        }
        return recs.subList(0,recs.size()>maxItems?maxItems-1:recs.size()-1);
    }

    // 全文检索
    private List<Recommendation> findContentBasedSearchRecommendations(String text, int maxItems) {
        MultiMatchQueryBuilder query = QueryBuilders.multiMatchQuery(text, "name", "descri");
        return parseESResponse(esClient.prepareSearch().setIndices(Constants.ES_INDEX()).setTypes(Constants.ES_TYPE()).setQuery(query).setSize(maxItems).execute().actionGet());
    }

    private List<Recommendation> parseESResponse(SearchResponse response) {
        List<Recommendation> recommendations = new ArrayList<>();
        for (SearchHit hit : response.getHits()) {
            recommendations.add(new Recommendation((int) hit.getSourceAsMap().get("mid"), (double) hit.getScore()));
        }
        return recommendations;
    }

    // 混合推荐算法
    private List<Recommendation> findHybridRecommendations(int productId, int maxItems) {
        List<Recommendation> hybridRecommendations = new ArrayList<>();

        List<Recommendation> cfRecs = findMovieCFRecs(productId, maxItems);
        for (Recommendation recommendation : cfRecs) {
            hybridRecommendations.add(new Recommendation(recommendation.getMid(), recommendation.getScore() * CF_RATING_FACTOR));
        }

        List<Recommendation> cbRecs = findContentBasedMoreLikeThisRecommendations(productId, maxItems);
        for (Recommendation recommendation : cbRecs) {
            hybridRecommendations.add(new Recommendation(recommendation.getMid(), recommendation.getScore() * CB_RATING_FACTOR));
        }

        List<Recommendation> streamRecs = findStreamRecs(productId,maxItems);
        for (Recommendation recommendation : streamRecs) {
            hybridRecommendations.add(new Recommendation(recommendation.getMid(), recommendation.getScore() * SR_RATING_FACTOR));
        }

        Collections.sort(hybridRecommendations, new Comparator<Recommendation>() {
            @Override
            public int compare(Recommendation o1, Recommendation o2) {
                return o1.getScore() > o2.getScore() ? -1 : 1;
            }
        });
        return hybridRecommendations.subList(0, maxItems > hybridRecommendations.size() ? hybridRecommendations.size() : maxItems);
    }


    public List<Recommendation> getCollaborativeFilteringRecommendations(MovieRecommendationRequest request) {
        return findMovieCFRecs(request.getMid(), request.getSum());
    }

    public List<Recommendation> getCollaborativeFilteringRecommendations(UserRecommendationRequest request) {

        return findUserCFRecs(request.getUid(), request.getSum());
    }

    public List<Recommendation> getContentBasedMoreLikeThisRecommendations(MovieRecommendationRequest request) {
        return findContentBasedMoreLikeThisRecommendations(request.getMid(), request.getSum());
    }

    public List<Recommendation> getContentBasedSearchRecommendations(SearchRecommendationRequest request) {
        return findContentBasedSearchRecommendations(request.getText(), request.getSum());
    }

    public List<Recommendation> getHybridRecommendations(MovieHybridRecommendationRequest request) {
        return findHybridRecommendations(request.getMid(), request.getSum());
    }


    public List<Recommendation> getHotRecommendations(HotRecommendationRequest request) {
        List<Recommendation> recs = null;
        recs = jdbcTemplate.query("select * from " + Constants.DB_RATE_MORE_RECENTLY_MOVIES() + " ORDER BY yeahmonth DESC limit " + request.getSum(), new RowMapper<Recommendation>() {
            @Override
            public Recommendation mapRow(ResultSet resultSet, int i) throws SQLException {
                Recommendation rec = null;
                if (resultSet.next()) {
                    rec = new Recommendation();
                    rec.setMid(resultSet.getInt("mid"));
                    rec.setScore(0D);
                }
                return rec;
            }
        });
        return recs;
    }

    public List<Recommendation> getRateMoreRecommendations(RateMoreRecommendationRequest request) {
        List<Recommendation> recs = null;
        recs = jdbcTemplate.query("select * from " + Constants.DB_RATE_MORE_MOVIES() + " ORDER BY count DESC limit " + request.getSum(), new RowMapper<Recommendation>() {
            @Override
            public Recommendation mapRow(ResultSet resultSet, int i) throws SQLException {
                Recommendation rec = null;
                if (resultSet.next()) {
                    rec = new Recommendation();
                    rec.setMid(resultSet.getInt("mid"));
                    rec.setScore(0D);
                }
                return rec;
            }
        });
        return recs;
    }

    public List<Recommendation> getContentBasedGenresRecommendations(SearchRecommendationRequest request) {
        FuzzyQueryBuilder query = QueryBuilders.fuzzyQuery("genres", request.getText());
        return parseESResponse(esClient.prepareSearch().setIndices(Constants.ES_INDEX()).setTypes(Constants.ES_TYPE()).setQuery(query).setSize(request.getSum()).execute().actionGet());
    }

    public List<Recommendation> getTopGenresRecommendations(TopGenresRecommendationRequest request){
        String result = null;
        result = jdbcTemplate.query("select * from " + Constants.DB_GENRES_TOP_MOVIES() + " where genres=" + request.getGenres(), new ResultSetExtractor<String>() {
            @Override
            public String extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                String result = null;
                if (resultSet.next()) {
                    result = resultSet.getString("recs");
                }
                return result;
            }
        });
        List<Recommendation> recs = new ArrayList<>();

        if(result!=null && !result.isEmpty()){
            for (String item:result.split("\\|")) {
                String[] attrs = item.split(":");
                recs.add(new Recommendation(Integer.parseInt(attrs[0]),Double.parseDouble(attrs[1])));
            }
        }
        return recs.subList(0,recs.size()>request.getSum()?request.getSum()-1:recs.size()-1);
    }

}