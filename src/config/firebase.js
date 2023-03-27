import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
} from 'firebase/firestore';

const {
  VITE_API_KEY,
  VITE_AUTH_DOMAIN,
  VITE_MESUREMENT_ID,
  VITE_PROJECT_ID,
  VITE_STORAGE_BUCKET,
  VITE_MESSAGIN_ID,
  VITE_APP_ID,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGIN_ID,
  appId: VITE_APP_ID,
  measurementId: VITE_MESUREMENT_ID,
};

const app = getApp();

export default app;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export async function createUserDocumentFromAuth(
  userAuth,
  additionalData = {}
) {
  // 데이터베이스에서 사용자 고유 ID로 참조(ref) 가져오기
  const userDocRef = doc(db, 'users', userAuth.uid);

  // 사용자 참조를 전달해 Firestore 데이터베이스에서 데이터(스냅샷) 가져오기
  const userSnapshot = await getDoc(userDocRef);

  // Firestore 데이터베이스에 해당 문서가 존재하는 지 확인
  if (!userSnapshot.exists()) {
    const { email, password } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        password,
        createAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('사용자 정보 저장에 실패했습니다.', error.message);
    }
  }

  return userDocRef;
}

/**
 * Firestore 콜렉션 & 도큐멘트 추가 유틸리티 함수
 * @param {string} collectionKey 콜렉션 키(고유 이름)
 * @param {({ title: string, ...data })[]} addDataArray 추가할 데이터 배열
 * @param {string} documentKey 도큐멘트 키(고유 이름)
 */
export async function addCollectionAndDocuments(
  collectionKey,
  addDataArray,
  documentKey = 'title'
) {
  // 데이터베이스에서 무언가 찾고자 한다면 Firestore에서 참조해야 합니다.
  const collectionRef = collection(db, collectionKey);

  // 일괄 처리 쓰기 (Write Batch)
  const batch = writeBatch(db);

  // 추가할 데이터 배열을 순환 처리
  addDataArray.forEach((data) => {
    // 콜렉션 참조에 도큐멘트 참조 설정 → 도큐멘트 참조 반환
    const docRef = doc(collectionRef, data[documentKey].toLowerCase());
    // 도큐멘트 참조에 데이터 쓰기 일괄 처리
    batch.set(docRef, data);
  });

  // 일괄 처리 커밋(실행)
  await batch.commit();

  // console.log('콜렉션 생성 및 도큐멘트 생성 일괄 처리가 완료되었습니다.');
}
