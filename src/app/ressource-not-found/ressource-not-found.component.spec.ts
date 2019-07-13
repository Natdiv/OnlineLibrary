import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceNotFoundComponent } from './ressource-not-found.component';

describe('RessourceNotFoundComponent', () => {
  let component: RessourceNotFoundComponent;
  let fixture: ComponentFixture<RessourceNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessourceNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourceNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
