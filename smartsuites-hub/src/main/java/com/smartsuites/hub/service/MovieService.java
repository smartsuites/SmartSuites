/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.service;

import com.smartsuites.hub.model.domain.Movie;
import com.smartsuites.hub.model.recom.Recommendation;
import com.smartsuites.hub.model.request.NewRecommendationRequest;
import com.atguigu.commons.constant.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MovieService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Movie> getRecommendeMovies(List<Recommendation> recommendations) {
        List<Integer> ids = new ArrayList<>();
        for (Recommendation rec : recommendations) {
            ids.add(rec.getMid());
        }
        return getMovies(ids);
    }

    public List<Movie> getHybirdRecommendeMovies(List<Recommendation> recommendations) {
        List<Integer> ids = new ArrayList<>();
        for (Recommendation rec : recommendations) {
            ids.add(rec.getMid());
        }
        return getMovies(ids);
    }

    public List<Movie> getMovies(List<Integer> mids) {

        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("param", mids);

        NamedParameterJdbcTemplate jdbc = new NamedParameterJdbcTemplate(jdbcTemplate);

        List<Movie> movies = null;
        movies = jdbc.query("select * from " + Constants.DB_MOVIE() + " where mid in (:param)", new RowMapper<Movie>() {
            @Override
            public Movie mapRow(ResultSet resultSet, int i) throws SQLException {
                Movie movie = null;
                if (resultSet.next()) {
                    movie = new Movie();
                    movie.setMid(resultSet.getInt("mid"));
                    movie.setName(resultSet.getString("name"));
                    movie.setIssue(resultSet.getString("issue"));
                    movie.setShoot(resultSet.getString("shoot"));
                    movie.setActors(resultSet.getString("actors"));
                    movie.setDescri(resultSet.getString("descri"));
                    movie.setDirectors(resultSet.getString("directors"));
                    movie.setGenres(resultSet.getString("genres"));
                    movie.setLanguage(resultSet.getString("language"));
                    movie.setTimelong(resultSet.getString("timelong"));
                    Double score = jdbcTemplate.query("select * from " + Constants.DB_AVERAGE_MOVIES() + " where mid=" + movie.getMid(), new ResultSetExtractor<Double>() {
                        @Override
                        public Double extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                            if (resultSet.next()) {
                                return resultSet.getDouble("avg");
                            }
                            return 0D;
                        }
                    });
                    movie.setScore(score);
                }
                return movie;
            }
        });
        return movies;
    }


    public boolean movieExist(int mid) {
        return null != findByMID(mid);
    }

    public Movie findByMID(int mid) {
        Movie movie = null;
        movie = jdbcTemplate.query("select *from " + Constants.DB_MOVIE() + " where mid=" + mid, new ResultSetExtractor<Movie>() {
            @Override
            public Movie extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                Movie movie = null;
                if (resultSet.next()) {
                    movie = new Movie();
                    movie.setMid(resultSet.getInt("mid"));
                    movie.setName(resultSet.getString("name"));
                    movie.setIssue(resultSet.getString("issue"));
                    movie.setShoot(resultSet.getString("shoot"));
                    movie.setActors(resultSet.getString("actors"));
                    movie.setDescri(resultSet.getString("descri"));
                    movie.setDirectors(resultSet.getString("directors"));
                    movie.setGenres(resultSet.getString("genres"));
                    movie.setLanguage(resultSet.getString("language"));
                    movie.setTimelong(resultSet.getString("timelong"));
                    Double score = jdbcTemplate.query("select * from " + Constants.DB_AVERAGE_MOVIES() + " where mid=" + movie.getMid(), new ResultSetExtractor<Double>() {
                        @Override
                        public Double extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                            if (resultSet.next()) {
                                return resultSet.getDouble("avg");
                            }
                            return 0D;
                        }
                    });
                    movie.setScore(score);
                }
                return movie;
            }
        });
        return movie;
    }

    public List<Movie> getMyRateMovies(int uid) {
        List<Movie> movies = null;
        movies = jdbcTemplate.query("select * from " + Constants.DB_MOVIE() + " where uid=" + uid, new RowMapper<Movie>() {
            @Override
            public Movie mapRow(ResultSet resultSet, int i) throws SQLException {
                Movie movie = null;
                if (resultSet.next()) {
                    movie = new Movie();
                    movie.setMid(resultSet.getInt("mid"));
                    movie.setName(resultSet.getString("name"));
                    movie.setIssue(resultSet.getString("issue"));
                    movie.setShoot(resultSet.getString("shoot"));
                    movie.setActors(resultSet.getString("actors"));
                    movie.setDescri(resultSet.getString("descri"));
                    movie.setDirectors(resultSet.getString("directors"));
                    movie.setGenres(resultSet.getString("genres"));
                    movie.setLanguage(resultSet.getString("language"));
                    movie.setTimelong(resultSet.getString("timelong"));
                    Double score = jdbcTemplate.query("select * from " + Constants.DB_RATING() + " where  uid=" + uid + " and mid=" + movie.getMid(), new ResultSetExtractor<Double>() {
                        @Override
                        public Double extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                            if (resultSet.next()) {
                                return resultSet.getDouble("score");
                            }
                            return 0D;
                        }
                    });
                    movie.setScore(score);
                }
                return movie;
            }
        });
        return movies;
    }

    public List<Movie> getNewMovies(NewRecommendationRequest request) {
        List<Movie> movies = null;
        movies = jdbcTemplate.query("select * from " + Constants.DB_MOVIE() + " ORDER BY issue DESC LIMIT " + request.getSum(), new RowMapper<Movie>() {
            @Override
            public Movie mapRow(ResultSet resultSet, int i) throws SQLException {
                Movie movie = null;
                if (resultSet.next()) {
                    movie = new Movie();
                    movie.setMid(resultSet.getInt("mid"));
                    movie.setName(resultSet.getString("name"));
                    movie.setIssue(resultSet.getString("issue"));
                    movie.setShoot(resultSet.getString("shoot"));
                    movie.setActors(resultSet.getString("actors"));
                    movie.setDescri(resultSet.getString("descri"));
                    movie.setDirectors(resultSet.getString("directors"));
                    movie.setGenres(resultSet.getString("genres"));
                    movie.setLanguage(resultSet.getString("language"));
                    movie.setTimelong(resultSet.getString("timelong"));
                    Double score = jdbcTemplate.query("select * from " + Constants.DB_AVERAGE_MOVIES() + " where mid=" + movie.getMid(), new ResultSetExtractor<Double>() {
                        @Override
                        public Double extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                            if (resultSet.next()) {
                                return resultSet.getDouble("avg");
                            }
                            return 0D;
                        }
                    });
                    movie.setScore(score);
                }
                return movie;
            }
        });
        return movies;
    }

}
