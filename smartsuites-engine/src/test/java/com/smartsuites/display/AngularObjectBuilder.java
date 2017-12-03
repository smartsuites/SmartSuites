/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.display;

public class AngularObjectBuilder {

    public static <T> AngularObject<T> build(String varName, T value, String noteId,
                                             String paragraphId) {
        return new AngularObject<>(varName, value, noteId, paragraphId, null);
    }
}