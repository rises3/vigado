import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseApp } from '../firebase';
import { Login } from './login/login';

export interface Movie {
  id: string;
  title: string;
  durationMinutes: number;
  genre: string;
}

type Db = { movies: Movie[]; bookings: any[] };
type View = 'public' | 'login' | 'admin';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [FormsModule, Login]
})
export class App {
  private http = inject(HttpClient);
  private auth = getAuth(firebaseApp);

  db = signal<Db | null>(null);

  movies = computed<Movie[]>(() => this.db()?.movies ?? []);

  rows = computed<Movie[][]>(() => {
    const list = this.movies();
    const out: Movie[][] = [];
    for (let i = 0; i < list.length; i += 5) {
      out.push(list.slice(i, i + 5));
    }
    return out;
  });

  view = signal<View>('public');
  loggedIn = signal(false);
  editing = signal<Movie | null>(null);
  draft = { title: '', genre: '', durationMinutes: 0 };

  constructor() {
    this.http.get<Db>('assets/db.json')
      .subscribe(data => this.db.set(data));

    onAuthStateChanged(this.auth, user => {
      this.loggedIn.set(!!user);
      if (!user && this.view() === 'admin') {
        this.view.set('public');
      }
    });
  }

  adminClick(): void {
    if (this.view() === 'admin') {
      signOut(this.auth);
      this.view.set('public');
      return;
    }
    this.view.set(this.loggedIn() ? 'admin' : 'login');
  }

  onLoggedIn(): void {
    this.view.set('admin');
  }

  openEdit(movie: Movie): void {
    this.draft = {
      title: movie.title,
      genre: movie.genre,
      durationMinutes: movie.durationMinutes
    };
    this.editing.set(movie);
  }

  saveEdit(): void {
    const movie = this.editing();
    if (!movie) return;
    const changes = { ...this.draft };
    this.db.update(d => d
      ? { ...d, movies: d.movies.map(m => m.id === movie.id ? { ...m, ...changes } : m) }
      : d);
    this.editing.set(null);
  }

  cancelEdit(): void {
    this.editing.set(null);
  }

  showtimeText(movieId: string): string {
    const booking = this.db()?.bookings.find(b => b.movieId === movieId);
    if (!booking) return 'Nincs közelgő vetítés';
    const date = new Date(booking.showtime).toLocaleString('hu-HU');
    return `Vetítés: ${date} • Ülés: ${booking.seat}`;
  }
}
