import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc,
  getDoc, updateDoc } from '@angular/fire/firestore';

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

  getGames() {
    let gamesCollection = collection(this.fs, 'games');
    return collectionData(gamesCollection, {idField: 'id'});
  }

  createGame(gameData: any){
    const gamesCollection = collection(this.fs, 'games');
    return addDoc(gamesCollection, gameData);
  }

  updateGameById(gameId: string, updatedGameData: any) {
    const gameDoc = doc(this.fs, 'games', gameId);
    return updateDoc(gameDoc, updatedGameData);
  }

  getGameById(gameId: string){
    const gameDoc = doc(this.fs, 'games', gameId);
    return getDoc(gameDoc).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        throw new Error('Game not found');
      }
    });
  }
}
