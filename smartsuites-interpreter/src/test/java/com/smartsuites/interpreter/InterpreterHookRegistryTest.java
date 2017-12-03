/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.concurrent.atomic.AtomicInteger;

import org.junit.Test;

public class InterpreterHookRegistryTest {

  @Test
  public void testBasic() {
    final String PRE_EXEC = InterpreterHookRegistry.HookType.PRE_EXEC;
    final String POST_EXEC = InterpreterHookRegistry.HookType.POST_EXEC;
    final String PRE_EXEC_DEV = InterpreterHookRegistry.HookType.PRE_EXEC_DEV;
    final String POST_EXEC_DEV = InterpreterHookRegistry.HookType.POST_EXEC_DEV;
    final String GLOBAL_KEY = InterpreterHookRegistry.GLOBAL_KEY;
    final String noteId = "note";
    final String className = "class";
    final String preExecHook = "pre";
    final String postExecHook = "post";
    InterpreterHookRegistry registry = new InterpreterHookRegistry("intpId");
    
    // Test register()
    registry.register(noteId, className, PRE_EXEC, preExecHook);
    registry.register(noteId, className, POST_EXEC, postExecHook);
    registry.register(noteId, className, PRE_EXEC_DEV, preExecHook);
    registry.register(noteId, className, POST_EXEC_DEV, postExecHook);

    // Test get()
    assertEquals(registry.get(noteId, className, PRE_EXEC), preExecHook);
    assertEquals(registry.get(noteId, className, POST_EXEC), postExecHook);
    assertEquals(registry.get(noteId, className, PRE_EXEC_DEV), preExecHook);
    assertEquals(registry.get(noteId, className, POST_EXEC_DEV), postExecHook);
    
    // Test Unregister
    registry.unregister(noteId, className, PRE_EXEC);
    registry.unregister(noteId, className, POST_EXEC);
    registry.unregister(noteId, className, PRE_EXEC_DEV);
    registry.unregister(noteId, className, POST_EXEC_DEV);
    assertNull(registry.get(noteId, className, PRE_EXEC));
    assertNull(registry.get(noteId, className, POST_EXEC));
    assertNull(registry.get(noteId, className, PRE_EXEC_DEV));
    assertNull(registry.get(noteId, className, POST_EXEC_DEV));
    
    // Test Global Scope
    registry.register(null, className, PRE_EXEC, preExecHook);
    assertEquals(registry.get(GLOBAL_KEY, className, PRE_EXEC), preExecHook);
  }
  
  @Test(expected = IllegalArgumentException.class)
  public void testValidEventCode() {
    InterpreterHookRegistry registry = new InterpreterHookRegistry("intpId");
    
    // Test that only valid event codes ("pre_exec", "post_exec") are accepted
    registry.register("foo", "bar", "baz", "whatever");
  }

}
