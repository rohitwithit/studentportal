import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Studentadd } from './studentadd';

describe('Studentadd', () => {
  let component: Studentadd;
  let fixture: ComponentFixture<Studentadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentadd],
    }).compileComponents();

    fixture = TestBed.createComponent(Studentadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
