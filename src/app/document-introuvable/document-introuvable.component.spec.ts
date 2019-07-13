import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentIntrouvableComponent } from './document-introuvable.component';

describe('DocumentIntrouvableComponent', () => {
  let component: DocumentIntrouvableComponent;
  let fixture: ComponentFixture<DocumentIntrouvableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentIntrouvableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentIntrouvableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
