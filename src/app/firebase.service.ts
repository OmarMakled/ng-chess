import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private fs: Firestore) {}

  addState(state: string) {
    let data = {state}
    let gamesCollection = collection(this.fs, 'games');
    return addDoc(gamesCollection, data);
  }

  createGame(gameData: any){
    const gamesCollection = collection(this.fs, 'games');
    return addDoc(gamesCollection, gameData);
  }

  updateGameById(gameId: string, gameData: any) {
    const gameDoc = doc(this.fs, 'games', gameId);
    return updateDoc(gameDoc, gameData, { merge: true });
  }

  getGameById(gameId: string){
    const gameDoc = doc(this.fs, 'games', gameId);
    return getDoc(gameDoc).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      }
      throw new Error('Game not found');
    });
  }
  
  onGameUpdate(gameId: string): Observable<any> {
    const gameDoc = doc(this.fs, 'games', gameId);
    return new Observable<any>((observer) => {
      const unsubscribe = onSnapshot(gameDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          observer.next({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          observer.error(new Error('Game not found'));
        }
      });

      // Cleanup function to unsubscribe when the component is destroyed
      return () => unsubscribe();
    });
  }
}
