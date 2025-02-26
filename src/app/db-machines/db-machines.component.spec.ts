import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbMachinesComponent } from './db-machines.component';

describe('DbMachinesComponent', () => {
  let component: DbMachinesComponent;
  let fixture: ComponentFixture<DbMachinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbMachinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
