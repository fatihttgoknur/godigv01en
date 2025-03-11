import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaDocumentComponent } from './proforma-document.component';

describe('ProformaDocumentComponent', () => {
  let component: ProformaDocumentComponent;
  let fixture: ComponentFixture<ProformaDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
