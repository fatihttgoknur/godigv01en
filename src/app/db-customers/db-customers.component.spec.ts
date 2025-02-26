import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbCustomersComponent } from './db-customers.component';

describe('DbCustomersComponent', () => {
  let component: DbCustomersComponent;
  let fixture: ComponentFixture<DbCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
