/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.realm;

import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.ldap.JndiLdapRealm;
import org.apache.shiro.realm.ldap.LdapContextFactory;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;


/**
 * Created for org.apache.zeppelin.server on 09/06/16.
 */
public class LdapGroupRealm extends JndiLdapRealm {
  private static final Logger LOG = LoggerFactory.getLogger(LdapGroupRealm.class);

  public AuthorizationInfo queryForAuthorizationInfo(
      PrincipalCollection principals,
      LdapContextFactory ldapContextFactory) throws NamingException {
    String username = (String) getAvailablePrincipal(principals);
    LdapContext ldapContext = ldapContextFactory.getSystemLdapContext();
    Set<String> roleNames = getRoleNamesForUser(username, ldapContext, getUserDnTemplate());
    return new SimpleAuthorizationInfo(roleNames);
  }


  public Set<String> getRoleNamesForUser(String username,
                                         LdapContext ldapContext,
                                         String userDnTemplate) throws NamingException {
    try {
      Set<String> roleNames = new LinkedHashSet<>();

      SearchControls searchCtls = new SearchControls();
      searchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);

      String searchFilter = "(&(objectClass=groupOfNames)(member=" + userDnTemplate + "))";
      Object[] searchArguments = new Object[]{username};

      NamingEnumeration<?> answer = ldapContext.search(
          String.valueOf(ldapContext.getEnvironment().get("ldap.searchBase")),
          searchFilter,
          searchArguments,
          searchCtls);

      while (answer.hasMoreElements()) {
        SearchResult sr = (SearchResult) answer.next();
        Attributes attrs = sr.getAttributes();
        if (attrs != null) {
          NamingEnumeration<?> ae = attrs.getAll();
          while (ae.hasMore()) {
            Attribute attr = (Attribute) ae.next();
            if (attr.getID().equals("cn")) {
              roleNames.add((String) attr.get());
            }
          }
        }
      }
      return roleNames;

    } catch (Exception e) {
      LOG.error("Error", e);
    }

    return new HashSet<>();
  }
}
