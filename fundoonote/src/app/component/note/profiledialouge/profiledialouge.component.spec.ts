import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledialougeComponent } from './profiledialouge.component';

describe('ProfiledialougeComponent', () => {
  let component: ProfiledialougeComponent;
  let fixture: ComponentFixture<ProfiledialougeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiledialougeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiledialougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
