/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.remote;

import java.io.IOException;
import java.net.ConnectException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Collections;

import com.smartsuites.interpreter.thrift.CallbackInfo;
import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.smartsuites.interpreter.thrift.RemoteInterpreterCallbackService;

/**
 *
 */
public class RemoteInterpreterUtils {
  static Logger LOGGER = LoggerFactory.getLogger(RemoteInterpreterUtils.class);


  public static int findRandomAvailablePortOnAllLocalInterfaces() throws IOException {
    return findRandomAvailablePortOnAllLocalInterfaces(":");
  }

  /**
   * start:end
   *
   * @param portRange
   * @return
   * @throws IOException
   */
  public static int findRandomAvailablePortOnAllLocalInterfaces(String portRange)
      throws IOException {

    // ':' is the default value which means no constraints on the portRange
    if (portRange == null || portRange.equals(":")) {
      int port;
      try (ServerSocket socket = new ServerSocket(0);) {
        port = socket.getLocalPort();
        socket.close();
      }
      return port;
    }
    // valid user registered port https://en.wikipedia.org/wiki/Registered_port
    int start = 1024;
    int end = 49151;
    String[] ports = portRange.split(":", -1);
    if (!ports[0].isEmpty()) {
      start = Integer.parseInt(ports[0]);
    }
    if (!ports[1].isEmpty()) {
      end = Integer.parseInt(ports[1]);
    }
    for (int i = start; i <= end; ++i) {
      try {
        ServerSocket socket = new ServerSocket(i);
        return socket.getLocalPort();
      } catch (Exception e) {
        // ignore this
      }
    }
    throw new IOException("No available port in the portRange: " + portRange);
  }

  public static String findAvailableHostAddress() throws UnknownHostException, SocketException {
    InetAddress address = InetAddress.getLocalHost();
    if (address.isLoopbackAddress()) {
      for (NetworkInterface networkInterface : Collections
          .list(NetworkInterface.getNetworkInterfaces())) {
        if (!networkInterface.isLoopback()) {
          for (InterfaceAddress interfaceAddress : networkInterface.getInterfaceAddresses()) {
            InetAddress a = interfaceAddress.getAddress();
            if (a instanceof Inet4Address) {
              return a.getHostAddress();
            }
          }
        }
      }
    }
    return address.getHostAddress();
  }

  public static boolean checkIfRemoteEndpointAccessible(String host, int port) {
    try {
      Socket discover = new Socket();
      discover.setSoTimeout(1000);
      discover.connect(new InetSocketAddress(host, port), 1000);
      discover.close();
      return true;
    } catch (ConnectException cne) {
      // end point is not accessible
      if (LOGGER.isDebugEnabled()) {
        LOGGER.debug("Remote endpoint '" + host + ":" + port + "' is not accessible " +
                "(might be initializing): " + cne.getMessage());
      }
      return false;
    } catch (IOException ioe) {
      // end point is not accessible
      if (LOGGER.isDebugEnabled()) {
        LOGGER.debug("Remote endpoint '" + host + ":" + port + "' is not accessible " +
                "(might be initializing): " + ioe.getMessage());
      }
      return false;
    }
  }

  public static String getInterpreterSettingId(String intpGrpId) {
    String settingId = null;
    if (intpGrpId != null) {
      int indexOfColon = intpGrpId.indexOf(":");
      settingId = intpGrpId.substring(0, indexOfColon);
    }
    return settingId;
  }

  public static boolean isEnvString(String key) {
    if (key == null || key.length() == 0) {
      return false;
    }

    return key.matches("^[A-Z_0-9]*");
  }

  /**
   * 向Master注册Interpreter JVM Thrift的主机和端口号
   * @param callbackHost
   * @param callbackPort
   * @param callbackInfo
   * @throws TException
   */
  public static void registerInterpreter(String callbackHost, int callbackPort,
      final CallbackInfo callbackInfo) throws TException {
    LOGGER.info("callbackHost: {}, callbackPort: {}, callbackInfo: {}", callbackHost, callbackPort,
        callbackInfo);
    try (TTransport transport = new TSocket(callbackHost, callbackPort)) {
      transport.open();
      TProtocol protocol = new TBinaryProtocol(transport);
      RemoteInterpreterCallbackService.Client client = new RemoteInterpreterCallbackService.Client(
          protocol);
      client.callback(callbackInfo);
    }
  }
}
