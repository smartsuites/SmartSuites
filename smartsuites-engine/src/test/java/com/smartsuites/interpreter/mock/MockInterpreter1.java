/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.mock;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class MockInterpreter1 extends Interpreter {

	Map<String, Object> vars = new HashMap<>();

	public MockInterpreter1(Properties property) {
		super(property);
	}
	boolean open;


	@Override
	public void open() {
		open = true;
	}

	@Override
	public void close() {
		open = false;
	}


	public boolean isOpen() {
		return open;
	}

	@Override
	public InterpreterResult interpret(String st, InterpreterContext context) {
		InterpreterResult result;

		if ("getId".equals(st)) {
			// get unique id of this interpreter instance
			result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "" + this.hashCode());
		} else if (st.startsWith("sleep")) {
			try {
				Thread.sleep(Integer.parseInt(st.split(" ")[1]));
			} catch (InterruptedException e) {
				// nothing to do
			}
			result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "repl1: " + st);
		} else {
			result = new InterpreterResult(InterpreterResult.Code.SUCCESS, "repl1: " + st);
		}

		if (context.getResourcePool() != null) {
			context.getResourcePool().put(context.getNoteId(), context.getParagraphId(), "result", result);
		}

		return result;
	}

	@Override
	public void cancel(InterpreterContext context) {
	}

	@Override
	public FormType getFormType() {
		return FormType.SIMPLE;
	}

	@Override
	public int getProgress(InterpreterContext context) {
		return 0;
	}

	@Override
	public Scheduler getScheduler() {
		return SchedulerFactory.singleton().createOrGetFIFOScheduler("test_"+this.hashCode());
	}

	@Override
	public List<InterpreterCompletion> completion(String buf, int cursor,
			InterpreterContext interpreterContext) {
		return null;
	}
}
