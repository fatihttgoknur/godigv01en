import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaContentComponent } from './proforma-content.component';

describe('ProformaContentComponent', () => {
  let component: ProformaContentComponent;
  let fixture: ComponentFixture<ProformaContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
