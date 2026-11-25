import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { Homepage } from './homepage';

describe('Homepage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homepage],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it.each([
    ['User', '/user', 'user works!'],
    ['Employee', '/employee', 'employee works!'],
    ['Admin', '/admin', 'admin works!'],
  ])('navigates from the %s button to %s', async (label, path, content) => {
    const harness = await RouterTestingHarness.create('/homepage');
    const buttons = Array.from(harness.routeNativeElement!.querySelectorAll('button'));
    const button = buttons.find((element) => element.textContent?.trim() === label);
    expect(button).toBeDefined();
    button!.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(path);
    expect(harness.routeNativeElement?.textContent).toContain(content);
  });
});
