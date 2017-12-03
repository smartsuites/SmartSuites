/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.resource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;


/**
 * InputStream from bytebuffer
 */
public class ByteBufferInputStream extends InputStream {

  ByteBuffer buf;

  public ByteBufferInputStream(ByteBuffer buf) {
    this.buf = buf;
  }

  public int read() throws IOException {
    if (!buf.hasRemaining()) {
      return -1;
    }
    return buf.get() & 0xFF;
  }

  public int read(byte[] bytes, int off, int len) throws IOException {
    if (!buf.hasRemaining()) {
      return -1;
    }
    len = Math.min(len, buf.remaining());
    buf.get(bytes, off, len);
    return len;
  }

  public static InputStream get(ByteBuffer buf) {
    if (buf.hasArray()) {
      return new ByteArrayInputStream(buf.array());
    } else {
      return new ByteBufferInputStream(buf);
    }
  }
}
