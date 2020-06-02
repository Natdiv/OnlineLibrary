import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteInactifComponent } from './compte-inactif.component';

describe('CompteInactifComponent', () => {
  let component: CompteInactifComponent;
  let fixture: ComponentFixture<CompteInactifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompteInactifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteInactifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
