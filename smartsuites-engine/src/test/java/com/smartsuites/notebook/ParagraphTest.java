/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.notebook;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.common.collect.Lists;

import java.util.Arrays;
import java.util.List;

import com.smartsuites.interpreter.*;
import org.apache.commons.lang3.tuple.Triple;
import com.smartsuites.display.AngularObject;
import com.smartsuites.display.AngularObjectBuilder;
import com.smartsuites.display.AngularObjectRegistry;
import com.smartsuites.display.Input;
import com.smartsuites.interpreter.Interpreter.FormType;
import com.smartsuites.interpreter.InterpreterResult.Code;
import com.smartsuites.interpreter.InterpreterResult.Type;
import com.smartsuites.interpreter.InterpreterSetting.Status;
import com.smartsuites.resource.ResourcePool;
import com.smartsuites.user.AuthenticationInfo;
import com.smartsuites.user.Credentials;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;
import org.mockito.Mockito;

public class ParagraphTest {
  @Test
  public void scriptBodyWithReplName() {
    String text = "%spark(1234567";
    assertEquals("(1234567", Paragraph.getScriptBody(text));

    text = "%table 1234567";
    assertEquals("1234567", Paragraph.getScriptBody(text));
  }

  @Test
  public void scriptBodyWithoutReplName() {
    String text = "12345678";
    assertEquals(text, Paragraph.getScriptBody(text));
  }

  @Test
  public void replNameAndNoBody() {
    String text = "%md";
    assertEquals("md", Paragraph.getRequiredReplName(text));
    assertEquals("", Paragraph.getScriptBody(text));
  }
  
  @Test
  public void replSingleCharName() {
    String text = "%r a";
    assertEquals("r", Paragraph.getRequiredReplName(text));
    assertEquals("a", Paragraph.getScriptBody(text));
  }

  @Test
  public void replNameEndsWithWhitespace() {
    String text = "%md\r\n###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));

    text = "%md\t###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));

    text = "%md\u000b###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));

    text = "%md\f###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));

    text = "%md\n###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));

    text = "%md ###Hello";
    assertEquals("md", Paragraph.getRequiredReplName(text));
  }

  @Test
  public void should_extract_variable_from_angular_object_registry() throws Exception {
    //Given
    final String noteId = "noteId";

    final AngularObjectRegistry registry = mock(AngularObjectRegistry.class);
    final Note note = mock(Note.class);
    final Map<String, Input> inputs = new HashMap<>();
    inputs.put("name", null);
    inputs.put("age", null);
    inputs.put("job", null);

    final String scriptBody = "My name is ${name} and I am ${age=20} years old. " +
            "My occupation is ${ job = engineer | developer | artists}";

    final Paragraph paragraph = new Paragraph(note, null, null, null);
    final String paragraphId = paragraph.getId();

    final AngularObject nameAO = AngularObjectBuilder.build("name", "DuyHai DOAN", noteId,
            paragraphId);

    final AngularObject ageAO = AngularObjectBuilder.build("age", 34, noteId, null);

    when(note.getId()).thenReturn(noteId);
    when(registry.get("name", noteId, paragraphId)).thenReturn(nameAO);
    when(registry.get("age", noteId, null)).thenReturn(ageAO);

    final String expected = "My name is DuyHai DOAN and I am 34 years old. " +
            "My occupation is ${ job = engineer | developer | artists}";
    //When
    final String actual = paragraph.extractVariablesFromAngularRegistry(scriptBody, inputs,
            registry);

    //Then
    verify(registry).get("name", noteId, paragraphId);
    verify(registry).get("age", noteId, null);
    assertEquals(actual, expected);
  }

  @Test
  public void returnDefaultParagraphWithNewUser() {
    Paragraph p = new Paragraph("para_1", null, null, null, null);
    Object defaultValue = "Default Value";
    p.setResult(defaultValue);
    Paragraph newUserParagraph = p.getUserParagraph("new_user");
    assertNotNull(newUserParagraph);
    assertEquals(defaultValue, newUserParagraph.getReturn());
  }

  @Test
  public void returnUnchangedResultsWithDifferentUser() throws Throwable {
    InterpreterSettingManager mockInterpreterSettingManager = mock(InterpreterSettingManager.class);
    Note mockNote = mock(Note.class);
    when(mockNote.getCredentials()).thenReturn(mock(Credentials.class));
    Paragraph spyParagraph = spy(new Paragraph("para_1", mockNote,  null, null, mockInterpreterSettingManager));

    doReturn("spy").when(spyParagraph).getRequiredReplName();


    Interpreter mockInterpreter = mock(Interpreter.class);
    doReturn(mockInterpreter).when(spyParagraph).getRepl(anyString());

    ManagedInterpreterGroup mockInterpreterGroup = mock(ManagedInterpreterGroup.class);
    when(mockInterpreter.getInterpreterGroup()).thenReturn(mockInterpreterGroup);
    when(mockInterpreterGroup.getId()).thenReturn("mock_id_1");
    when(mockInterpreterGroup.getAngularObjectRegistry()).thenReturn(mock(AngularObjectRegistry.class));
    when(mockInterpreterGroup.getResourcePool()).thenReturn(mock(ResourcePool.class));

    List<InterpreterSetting> spyInterpreterSettingList = spy(Lists.<InterpreterSetting>newArrayList());
    InterpreterSetting mockInterpreterSetting = mock(InterpreterSetting.class);
    InterpreterOption mockInterpreterOption = mock(InterpreterOption.class);
    when(mockInterpreterSetting.getOption()).thenReturn(mockInterpreterOption);
    when(mockInterpreterOption.permissionIsSet()).thenReturn(false);
    when(mockInterpreterSetting.getStatus()).thenReturn(Status.READY);
    when(mockInterpreterSetting.getId()).thenReturn("mock_id_1");
    when(mockInterpreterSetting.getOrCreateInterpreterGroup(anyString(), anyString())).thenReturn(mockInterpreterGroup);
    spyInterpreterSettingList.add(mockInterpreterSetting);
    when(mockNote.getId()).thenReturn("any_id");
    when(mockInterpreterSettingManager.getInterpreterSettings(anyString())).thenReturn(spyInterpreterSettingList);

    doReturn("spy script body").when(spyParagraph).getScriptBody();

    when(mockInterpreter.getFormType()).thenReturn(FormType.NONE);

    ParagraphJobListener mockJobListener = mock(ParagraphJobListener.class);
    doReturn(mockJobListener).when(spyParagraph).getListener();
    doNothing().when(mockJobListener).onOutputUpdateAll(Mockito.<Paragraph>any(), Mockito.anyList());

    InterpreterResult mockInterpreterResult = mock(InterpreterResult.class);
    when(mockInterpreter.interpret(anyString(), Mockito.<InterpreterContext>any())).thenReturn(mockInterpreterResult);
    when(mockInterpreterResult.code()).thenReturn(Code.SUCCESS);


    // Actual test
    List<InterpreterResultMessage> result1 = Lists.newArrayList();
    result1.add(new InterpreterResultMessage(Type.TEXT, "result1"));
    when(mockInterpreterResult.message()).thenReturn(result1);

    AuthenticationInfo user1 = new AuthenticationInfo("user1");
    spyParagraph.setAuthenticationInfo(user1);
    spyParagraph.jobRun();
    Paragraph p1 = spyParagraph.getUserParagraph(user1.getUser());

    List<InterpreterResultMessage> result2 = Lists.newArrayList();
    result2.add(new InterpreterResultMessage(Type.TEXT, "result2"));
    when(mockInterpreterResult.message()).thenReturn(result2);

    AuthenticationInfo user2 = new AuthenticationInfo("user2");
    spyParagraph.setAuthenticationInfo(user2);
    spyParagraph.jobRun();
    Paragraph p2 = spyParagraph.getUserParagraph(user2.getUser());

    assertNotEquals(p1.getReturn().toString(), p2.getReturn().toString());

    assertEquals(p1, spyParagraph.getUserParagraph(user1.getUser()));
  }

  @Test
  public void testCursorPosition() {
    Paragraph paragraph = spy(new Paragraph());
    doReturn(null).when(paragraph).getRepl(anyString());
    // left = buffer, middle = cursor position into source code, right = cursor position after parse
    List<Triple<String, Integer, Integer>> dataSet = Arrays.asList(
        Triple.of("%jdbc schema.", 13, 7),
        Triple.of("   %jdbc schema.", 16, 7),
        Triple.of(" \n%jdbc schema.", 15, 7),
        Triple.of("%jdbc schema.table.  ", 19, 13),
        Triple.of("%jdbc schema.\n\n", 13, 7),
        Triple.of("  %jdbc schema.tab\n\n", 18, 10),
        Triple.of("  \n%jdbc schema.\n \n", 16, 7),
        Triple.of("  \n%jdbc schema.\n \n", 16, 7),
        Triple.of("  \n%jdbc\n\n schema\n \n", 17, 6),
        Triple.of("%another\n\n schema.", 18, 7),
        Triple.of("\n\n schema.", 10, 7),
        Triple.of("schema.", 7, 7),
        Triple.of("schema. \n", 7, 7),
        Triple.of("  \n   %jdbc", 11, 0),
        Triple.of("\n   %jdbc", 9, 0),
        Triple.of("%jdbc  \n  schema", 16, 6),
        Triple.of("%jdbc  \n  \n   schema", 20, 6)
    );

    for (Triple<String, Integer, Integer> data : dataSet) {
      Integer actual = paragraph.calculateCursorPosition(data.getLeft(), data.getLeft().trim(), data.getMiddle());
      assertEquals(data.getRight(), actual);
    }
  }

}
