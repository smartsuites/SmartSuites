# Distribution archive of SmartSuites

SmartSuites is distributed as a single gzip archive with the following structure:

```
SmartSuites
 ├── bin                                  【控制脚本目录】
 │   ├── functions.sh                      脚本中公用的方法
 │   ├── common.sh                         脚本中公用的方法
 │   ├── smartsuites.sh                    用于启动单独的JVM来运行Interpreter，框架自动调用，非手动
 │   └── smartsuites-daemon.sh             用于启动、关闭整个应用程序
 ├── conf                                 【系统配置目录】
 │   ├── smartsuites-site.xml              系统的配置
 │   ├── smartsuites-env.sh                系统环境变量的配置
 │   └── shiro.ini                         系统权限的配置
 ├── interpreter                          【各个解析器的jar包存放目录】
 │   ├── spark                             spark解析器所需要的jar包
 │   ├── flink                             flink解析器所需要的jar包
 │   ├── pig                               pig解析器所需要的jar包
 │   └── ***                               其他解析器
 ├── lib                                  【主程序jar包存放目录】
 │   ├── smartsuites-engine.jar            SmartSuites主程序的主依赖包
 │   ├── smartsuites-server.jar            SmartSuites的主程序
 │   ├── smartsuites-web.war               SmartSuites的前端界面包
 │   ├── ***                               SmartSuites主程序的其他依赖包
 │   └── interpreter                      【解析器公用jar包目录】
 │       ├── smartsuites-interpreter.jar   插件需要继承的解析器jar包
 │       └── ***                           解析器jar包需要的其他依赖包
 ├── license                               许可证文件           
 └── notebook                              笔记的默认目录
 
```

使用 `maven-assembly-plugin` 来创建包, see `smartsuites-distribution/assemble/distribution.xml ` for details.

>**IMPORTANT:** `_/lib_` subdirectory contains all transitive dependencies of the `smartsuites-distribution` module,
automatically resolved by maven, except for explicitly excluded `_web_` SmartSuites sub-modules.
