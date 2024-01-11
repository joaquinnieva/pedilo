import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './config';

export const getMenus = () => {
  const menus = collection(db, 'menu');
  const q = query(menus);

  return getDocs(q).then((resp) => {
    return resp.docs
      .map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
      .sort((a: any, b: any) => b.price - a.price);
  });
};

export const getRequests = () => {
  const requests = collection(db, 'requests');
  const requestsQuery = query(requests);

  return getDocs(requestsQuery).then((resp) => {
    return resp.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  });
};
