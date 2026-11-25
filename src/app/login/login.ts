import { Component, output, signal } from '@angular/core';
import { loginAdmin, registerAdmin } from './admin-auth';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-box">
      <h2>Adminisztrátori bejelentkezés</h2>
      <form (submit)="$event.preventDefault(); submit(text.value, password.value)">
        <label>
          Felhasználónév
          <input #text type="text" required />
        </label>
        <label>
          Jelszó
          <input #password type="password" required />
        </label>
        <button type="submit" [disabled]="busy()">Belépés</button>
        <button type="button" [disabled]="busy()" (click)="register(text.value, password.value)">Regisztráció</button>
        <button type="button" class="back" (click)="cancelled.emit()">Vissza</button>
      </form>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    .login-box { max-width: 320px; margin: 2rem auto; display: flex; flex-direction: column; gap: 0.75rem; }
    h2 { font-family: "Cinzel", "Times New Roman", serif; color: #d6a548; text-align: center; }
    form { display: flex; flex-direction: column; gap: 0.6rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; }
    input { padding: 0.4rem; }
    button { padding: 0.5rem; cursor: pointer; }
    .error { color: #e66; }
  `]
})
export class Login {
  loggedIn = output<void>();
  cancelled = output<void>();

  error = signal('');
  busy = signal(false);

  async submit(username: string, password: string): Promise<void> {
    this.error.set('');
    this.busy.set(true);
    try {
      const ok = await loginAdmin(username, password);
      if (ok) {
        this.loggedIn.emit();
      } else {
        this.error.set('Hibás felhasználónév vagy jelszó.');
      }
    } catch (e: any) {
      this.error.set('Sikertelen bejelentkezés: ' + (e?.message ?? 'ismeretlen hiba'));
    } finally {
      this.busy.set(false);
    }
  }

  async register(username: string, password: string): Promise<void> {
    this.error.set('');
    if (!username.trim() || !password) {
      this.error.set('Add meg a felhasználónevet és a jelszót!');
      return;
    }
    this.busy.set(true);
    try {
      await registerAdmin(username, password);
      this.loggedIn.emit();
    } catch (e: any) {
      this.error.set('Sikertelen regisztráció: ' + (e?.message ?? 'ismeretlen hiba'));
    } finally {
      this.busy.set(false);
    }
  }
}
