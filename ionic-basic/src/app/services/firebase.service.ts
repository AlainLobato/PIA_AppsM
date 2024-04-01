import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { user } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { getFirestore, doc, getDoc} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  
  //-----AUTH-----

  signIn(user: user){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //-----SIGN-UP-----

  signUp(user: user){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //-------UPDATE USER-----
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName});
  }

  //----- SEND EMAIL TO RECOVERY PASSWORD-----
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  //--------DATA BASE FIRESTORE--------
    //----- Set Document--------
    setDocument(path: string, data: any){
      return setDoc(doc(getFirestore(), path), data);
      
    }

    //------Get Document--------
    async getDocument(path: string){
      return (await getDoc(doc(getFirestore(), path))).data();
    }

  

}
