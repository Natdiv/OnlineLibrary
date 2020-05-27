import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDocumentsAdminPanelComponent } from './all-documents-admin-panel.component';

describe('AllDocumentsAdminPanelComponent', () => {
  let component: AllDocumentsAdminPanelComponent;
  let fixture: ComponentFixture<AllDocumentsAdminPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDocumentsAdminPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDocumentsAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
