/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.ticket;

import org.junit.Before;
import org.junit.Test;

import java.net.UnknownHostException;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TicketContainerTest {
  private TicketContainer container;

  @Before
  public void setUp() throws Exception {
    container = TicketContainer.instance;
  }

  @Test
  public void isValidAnonymous() throws UnknownHostException {
    boolean ok = container.isValid("anonymous", "anonymous");
    assertTrue(ok);
  }

  @Test
  public void isValidExistingPrincipal() throws UnknownHostException {
    String ticket = container.getTicket("someuser1");
    boolean ok = container.isValid("someuser1", ticket);
    assertTrue(ok);
  }

  @Test
  public void isValidNonExistingPrincipal() throws UnknownHostException {
    boolean ok = container.isValid("unknownuser", "someticket");
    assertFalse(ok);
  }

  @Test
  public void isValidunkownTicket() throws UnknownHostException {
    String ticket = container.getTicket("someuser2");
    boolean ok = container.isValid("someuser2", ticket+"makeitinvalid");
    assertFalse(ok);
  }
}

