/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.model.request;

public class TopGenresRecommendationRequest {

    private int sum;
    private String genres;

    public TopGenresRecommendationRequest(String genres, int sum) {
        this.genres = genres;
        this.sum = sum;
    }

    public int getSum() {
        return sum;
    }

    public void setSum(int sum) {
        this.sum = sum;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }
}
