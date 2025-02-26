import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbServicesComponent } from './db-services.component';

describe('DbServicesComponent', () => {
  let component: DbServicesComponent;
  let fixture: ComponentFixture<DbServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
