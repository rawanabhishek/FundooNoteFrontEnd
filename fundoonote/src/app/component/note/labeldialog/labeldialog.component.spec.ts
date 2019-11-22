import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeldialogComponent } from './labeldialog.component';

describe('LabeldialogComponent', () => {
  let component: LabeldialogComponent;
  let fixture: ComponentFixture<LabeldialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabeldialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabeldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
