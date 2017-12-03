import { TestBed, inject } from '@angular/core/testing';

import {WebsocketMessageService} from './websocket-message.service';

describe('WebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketMessageService]
    });
  });

  it('should be created', inject([WebsocketMessageService], (service: WebsocketMessageService) => {
    expect(service).toBeTruthy();
  }));
});
