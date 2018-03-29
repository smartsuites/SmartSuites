/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

function hashcode(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function ObjectEqual(object1, object2):boolean {
  if(object1 && object2)
    return hashcode(JSON.stringify(object1)) == hashcode(JSON.stringify(object2))
  else
    return false;
}

export function DeepClone(obj){
  if(!obj)
    return undefined
  return JSON.parse(JSON.stringify(obj))
}

export function isVisionMode(url):boolean {

  if (url.indexOf(";") != -1) {
    var str = url.substr(url.indexOf(";") + 1);
    let strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      let key = strs[i].split("=")[0];
      let value = strs[i].split("=")[1];
      if(key == "mode" && value == "vision")
        return true;
    }
  }
  return false;
}
