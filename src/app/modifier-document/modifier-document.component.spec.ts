import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDocumentComponent } from './modifier-document.component';

describe('ModifierDocumentComponent', () => {
  let component: ModifierDocumentComponent;
  let fixture: ComponentFixture<ModifierDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
