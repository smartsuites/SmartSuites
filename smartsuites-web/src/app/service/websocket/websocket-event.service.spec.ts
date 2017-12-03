import { TestBed, inject } from '@angular/core/testing';

import { WebsocketEventService } from './websocket-event.service';

describe('WebsocketEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketEventService]
    });
  });

  it('should be created', inject([WebsocketEventService], (service: WebsocketEventService) => {
    expect(service).toBeTruthy();
  }));
});
