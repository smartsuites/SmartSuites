/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.smartsuites.angular;

import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import com.smartsuites.interpreter.Interpreter;
import com.smartsuites.interpreter.InterpreterContext;
import com.smartsuites.interpreter.InterpreterResult;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.InterpreterResult.Type;
import com.smartsuites.interpreter.thrift.InterpreterCompletion;
import com.smartsuites.scheduler.Scheduler;
import com.smartsuites.scheduler.SchedulerFactory;

/**
 *
 */
public class AngularInterpreter extends Interpreter {

    public AngularInterpreter(Properties property) {
        super(property);
    }

    @Override
    public void open() {
    }

    @Override
    public void close() {
    }

    @Override
    public InterpreterResult interpret(String st, InterpreterContext context) {
        return new InterpreterResult(Code.SUCCESS, Type.ANGULAR, st);
    }

    @Override
    public void cancel(InterpreterContext context) {
    }

    @Override
    public FormType getFormType() {
        return FormType.NATIVE;
    }

    @Override
    public int getProgress(InterpreterContext context) {
        return 0;
    }

    @Override
    public List<InterpreterCompletion> completion(String buf, int cursor,
                                                  InterpreterContext interpreterContext) {
        return new LinkedList<>();
    }

    @Override
    public Scheduler getScheduler() {
        return SchedulerFactory.singleton().createOrGetFIFOScheduler(
                AngularInterpreter.class.getName() + this.hashCode());
    }
}
