import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// 根据URL查询字段 mode=vision 来启动Vision轻量化系统

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
