import { Injectable } from '@angular/core';
import { getFirestore, doc, addDoc, collection, query, orderBy, onSnapshot, getDocs, where } from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore';
import { Player } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
    private firestore = getFirestore();
  
    async sendMessage(sender: Player, receiverId: string, message: string): Promise<DocumentReference> {
      const messagesCollection = collection(this.firestore, 'messages');
      const newMessage = {
        senderId: sender.uid,
        receiverId: receiverId,
        message: message,
        timestamp: new Date()
      };
      return addDoc(messagesCollection, newMessage);
    }
  
    async getMessages(player1: Player, player2: Player): Promise<any[]> {
      const q = query(
        collection(this.firestore, 'messages'),
        where('senderId', 'in', [player1.uid, player2.uid]),
        where('receiverId', 'in', [player1.uid, player2.uid]),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const messages: any[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      return messages;
    }
  
    async getOtherPlayerId(currentPlayerId: string): Promise<string | null> {
      const q = query(
        collection(this.firestore, 'messages'),
        where('senderId', '==', currentPlayerId),
        orderBy('timestamp', 'desc')
      );
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const lastMessage = querySnapshot.docs[0].data();
        return lastMessage['senderId'] === currentPlayerId ? lastMessage['receiverId'] : lastMessage['senderId'];
      } else {
        return null;
      }
    }
  
    listenForNewMessages(player1: Player, player2: Player | null, callback: (message: any) => void): () => void {
        let q;
    
        if (player2) {
          q = query(
            collection(this.firestore, 'messages'),
            where('senderId', 'in', [player1.uid, player2.uid]),
            where('receiverId', 'in', [player1.uid, player2.uid]),
            orderBy('timestamp', 'asc')
          );
        } else {
          q = query(
            collection(this.firestore, 'messages'),
            where('senderId', '==', player1.uid),
            orderBy('timestamp', 'asc')
          );
        }
        
        return onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              callback(change.doc.data());
            }
          });
        });
      }
    }    