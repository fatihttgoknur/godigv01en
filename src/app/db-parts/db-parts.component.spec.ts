import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbPartsComponent } from './db-parts.component';

describe('DbPartsComponent', () => {
  let component: DbPartsComponent;
  let fixture: ComponentFixture<DbPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbPartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
