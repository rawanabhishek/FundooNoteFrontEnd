import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledialogComponent } from './profiledialog.component';

describe('ProfiledialougeComponent', () => {
  let component: ProfiledialogComponent;
  let fixture: ComponentFixture<ProfiledialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiledialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
