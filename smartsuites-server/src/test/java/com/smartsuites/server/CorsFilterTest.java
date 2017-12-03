/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.server;

import org.junit.Assert;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Basic CORS REST API tests
 */
public class CorsFilterTest {

    public static String[] headers = new String[8];
    public static Integer count = 0;

    @Test
    @SuppressWarnings("rawtypes")
    public void ValidCorsFilterTest() throws IOException, ServletException {
        CorsFilter filter = new CorsFilter();
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);
        FilterChain mockedFilterChain = mock(FilterChain.class);
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        when(mockRequest.getHeader("Origin")).thenReturn("http://localhost:8080");
        when(mockRequest.getMethod()).thenReturn("Empty");
        when(mockRequest.getServerName()).thenReturn("localhost");
        count = 0;

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocationOnMock) throws Throwable {
                headers[count] = invocationOnMock.getArguments()[1].toString();
                count++;
                return null;
            }
        }).when(mockResponse).setHeader(anyString(), anyString());

        filter.doFilter(mockRequest, mockResponse, mockedFilterChain);
        Assert.assertTrue(headers[0].equals("http://localhost:8080"));
    }

    @Test
    @SuppressWarnings("rawtypes")
    public void InvalidCorsFilterTest() throws IOException, ServletException {
        CorsFilter filter = new CorsFilter();
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);
        FilterChain mockedFilterChain = mock(FilterChain.class);
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        when(mockRequest.getHeader("Origin")).thenReturn("http://evillocalhost:8080");
        when(mockRequest.getMethod()).thenReturn("Empty");
        when(mockRequest.getServerName()).thenReturn("evillocalhost");

        doAnswer(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocationOnMock) throws Throwable {
                headers[count] = invocationOnMock.getArguments()[1].toString();
                count++;
                return null;
            }
        }).when(mockResponse).setHeader(anyString(), anyString());

        filter.doFilter(mockRequest, mockResponse, mockedFilterChain);
        Assert.assertTrue(headers[0].equals(""));
    }
}
