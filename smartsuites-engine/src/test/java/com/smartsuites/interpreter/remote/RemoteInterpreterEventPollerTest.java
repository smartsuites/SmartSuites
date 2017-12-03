/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import com.smartsuites.interpreter.remote.RemoteInterpreterEventPoller;
import com.smartsuites.interpreter.remote.RemoteInterpreterProcess;
import com.smartsuites.interpreter.thrift.RemoteInterpreterEvent;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService;
import org.junit.Test;

import static com.smartsuites.interpreter.thrift.RemoteInterpreterEventType.NO_OP;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RemoteInterpreterEventPollerTest {

	@Test
	public void shouldClearUnreadEventsOnShutdown() throws Exception {
		RemoteInterpreterProcess interpreterProc = getMockEventsInterpreterProcess();
		RemoteInterpreterEventPoller eventPoller = new RemoteInterpreterEventPoller(null, null);

		eventPoller.setInterpreterProcess(interpreterProc);
		eventPoller.shutdown();
		eventPoller.start();
		eventPoller.join();

		assertEquals(NO_OP, interpreterProc.getClient().getEvent().getType());
	}

	private RemoteInterpreterProcess getMockEventsInterpreterProcess() throws Exception {
		RemoteInterpreterEvent fakeEvent = new RemoteInterpreterEvent();
		RemoteInterpreterEvent noMoreEvents = new RemoteInterpreterEvent(NO_OP, "");
		RemoteInterpreterService.Client client = mock(RemoteInterpreterService.Client.class);
		RemoteInterpreterProcess intProc = mock(RemoteInterpreterProcess.class);

		when(client.getEvent()).thenReturn(fakeEvent, fakeEvent, noMoreEvents);
		when(intProc.getClient()).thenReturn(client);

		return intProc;
	}
}
