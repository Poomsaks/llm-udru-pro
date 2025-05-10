import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmUdruComponent } from './llm-udru.component';

describe('LlmUdruComponent', () => {
  let component: LlmUdruComponent;
  let fixture: ComponentFixture<LlmUdruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LlmUdruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmUdruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
