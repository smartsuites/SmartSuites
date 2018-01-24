/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

import {
  Compiler, Component, ComponentFactory, ComponentRef, Injectable, Input, NgModule, OnInit,
  ViewContainerRef
} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";


export interface DynamicData {
  scope: any;
  updateScope(scope)
}

/**
 * ResultComponet 提供 Provider,可以保证一个ResultCom具有单独的JitCompileService实例
 */
@Injectable()
export class JitCompileService {

  // Cache Of Factories
  private _cacheOfFactories: { [templateKey: string]: ComponentFactory<DynamicData> } = {};

  // Cache Of Component
  private _cacheOfComponent: { [targetElemId: string]: ComponentRef<DynamicData> } = {};

  // wee need Dynamic component builder
  constructor(private compiler: Compiler,
              private httpClient:HttpClient) {
  }

  public renderFromTemplate(template,targetEl,scope,recreate:boolean = false){
    let self = this
    if (template.split('\n').length === 1 &&
      template.endsWith('.html')) { // template is url

      self.httpClient
        .get(template, {responseType:'text'})
        .subscribe(
          data => {
            self.refreshContent(targetEl, data, scope,recreate)
          },
          err => {
            console.log(err);
          }
        );
    } else {
      self.refreshContent(targetEl, template, scope,recreate)
    }
  }

  /** Get a Factory and create a component */
  private refreshContent(dynamicComponentTarget: ViewContainerRef,
                        template: string,
                        scope: any,
                        recreate: boolean = false) {

    /*let component = this.componentFactoryResolver
      .resolveComponentFactory(ProxyComponent);

    dynamicComponentTarget.createComponent(
      component
    );*/

    let targetElemId = dynamicComponentTarget.element.nativeElement.id

    if (this._cacheOfComponent[targetElemId] && this._cacheOfComponent[targetElemId] != null) {

      if (recreate) {
        this.destoryComponent(targetElemId)
        this.createComponent(targetElemId, dynamicComponentTarget, template, scope)
      } else {
        this.updateScope(this._cacheOfComponent[targetElemId], scope)
      }

    } else {
      this.createComponent(targetElemId, dynamicComponentTarget, template, scope)
    }
  }

  private destoryComponent(targetElemId: string){
    let componentRef = this._cacheOfComponent[targetElemId]
    componentRef.destroy();
    this._cacheOfComponent[targetElemId] = null
  }

  private createComponent(targetElemId: string,
                          dynamicComponentTarget: ViewContainerRef,
                          template: string,
                          scope: any){
    this.createComponentFactory(template,targetElemId)
      .then((factory: ComponentFactory<DynamicData>) => {

        // Create ComponentRef
        let componentRef = dynamicComponentTarget
          .createComponent(factory);

        this._cacheOfComponent[targetElemId] = componentRef

        // update scope
        this.updateScope(componentRef, scope)

      });
  }

  private updateScope(componentRef: ComponentRef<DynamicData>,scope: any){
    let component = componentRef.instance;
    //component.updateScope(scope)
    component.scope = scope
  }


  private createComponentFactory(template: string,targetElemId: string): Promise<ComponentFactory<DynamicData>> {

    let factory = this._cacheOfFactories[targetElemId];

    if (factory) {
      console.log("Module and Type are returned from cache")

      return new Promise((resolve) => {
        resolve(factory);
      });
    }

    // unknown template ... let's create a Type for it
    let type = this.createNewComponent(template);
    let module = this.createComponentModule(type);

    return new Promise((resolve) => {
      this.compiler
        .compileModuleAndAllComponentsAsync(module)
        .then((moduleWithFactories) => {

          let factory
          for (let item of moduleWithFactories.componentFactories) {
            if (item.componentType == type) {
              factory = item
            }
          }

          this._cacheOfFactories[targetElemId] = factory;
          resolve(factory);
        });
    });
  }

  private createNewComponent(tmpl: string) {
    @Component({
      selector: 'dynamic-component',
      template: tmpl,
    })
    class CustomDynamicComponent implements DynamicData, OnInit{

      @Input()  public scope: any;

      constructor() {
      }

      ngOnInit(): void {
      }

      updateScope(scope) {
        this.scope = scope
      }

    };
    // a component for this particular template
    return CustomDynamicComponent;
  }

  private createComponentModule(componentType: any) {
    @NgModule({
      imports: [
        //AppModule,
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        CommonModule
      ],
      declarations: [
        componentType
      ],
    })
    class RuntimeComponentModule {
    }

    // a module for just this Type
    return RuntimeComponentModule;
  }

}
