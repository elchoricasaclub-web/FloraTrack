import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { Finca, Lote, RegistroActividad, COLECCIONES_FIRESTORE } from '../types';

/**
 * Hook genérico para integrar operaciones CRUD reactivas (tiempo real)
 * con tipado estricto sobre colecciones de Firestore.
 */
export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Suscribirse a actualizaciones en tiempo real para mantener la UX sincronizada
  useEffect(() => {
    setLoading(true);
    setError(null);
    const colRef = collection(db, collectionName);
    
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error subcribiéndose a ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  // Crear un documento nuevo
  const createItem = useCallback(
    async (item: Omit<T, 'id'>, customId?: string): Promise<string> => {
      try {
        setError(null);
        const timestamp = new Date().toISOString();
        const itemWithMeta = {
          ...item,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        if (customId) {
          const docRef = doc(db, collectionName, customId);
          await setDoc(docRef, itemWithMeta);
          return customId;
        } else {
          const colRef = collection(db, collectionName);
          const docRef = await addDoc(colRef, itemWithMeta);
          return docRef.id;
        }
      } catch (err: any) {
        console.error(`Error creando ítem en ${collectionName}:`, err);
        setError(err);
        throw err;
      }
    },
    [collectionName]
  );

  // Actualizar un documento existente
  const updateItem = useCallback(
    async (id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> => {
      try {
        setError(null);
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        } as any);
      } catch (err: any) {
        console.error(`Error actualizando ítem ${id} en ${collectionName}:`, err);
        setError(err);
        throw err;
      }
    },
    [collectionName]
  );

  // Eliminar un documento
  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (err: any) {
        console.error(`Error eliminando ítem ${id} en ${collectionName}:`, err);
        setError(err);
        throw err;
      }
    },
    [collectionName]
  );

  // Obtener un documento por ID (operación puntual no reactiva)
  const getItemById = useCallback(
    async (id: string): Promise<T | null> => {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as unknown as T;
        }
        return null;
      } catch (err: any) {
        console.error(`Error obteniendo ítem ${id} por ID en ${collectionName}:`, err);
        setError(err);
        throw err;
      }
    },
    [collectionName]
  );

  return {
    data,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
  };
}

/**
 * Hook personalizado tipado para CRUD y tiempo real de Fincas GACP/GMP.
 */
export function useFincas() {
  const {
    data: fincas,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
  } = useFirestoreCollection<Finca>(COLECCIONES_FIRESTORE.FINCAS);

  return {
    fincas,
    loading,
    error,
    createFinca: createItem,
    updateFinca: updateItem,
    deleteFinca: deleteItem,
    getFincaById: getItemById,
  };
}

/**
 * Hook personalizado tipado para CRUD y tiempo real de Lotes de Cultivo.
 */
export function useLotes() {
  const {
    data: lotes,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
  } = useFirestoreCollection<Lote>(COLECCIONES_FIRESTORE.LOTES);

  // Filtrado de lotes locales por Finca propietaria
  const getLotesByFinca = useCallback(
    (fincaId: string) => {
      return lotes.filter((lote) => lote.fincaId === fincaId);
    },
    [lotes]
  );

  return {
    lotes,
    loading,
    error,
    createLote: createItem,
    updateLote: updateItem,
    deleteLote: deleteItem,
    getLoteById: getItemById,
    getLotesByFinca,
  };
}

/**
 * Hook personalizado tipado para CRUD y tiempo real de Registro de Actividades Diarias.
 */
export function useActividades() {
  const {
    data: actividades,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
  } = useFirestoreCollection<RegistroActividad>(COLECCIONES_FIRESTORE.ACTIVIDADES);

  // Filtrado de auditoría por código Lote
  const getActividadesByLote = useCallback(
    (loteId: string) => {
      return actividades.filter((act) => act.loteId === loteId);
    },
    [actividades]
  );

  return {
    actividades,
    loading,
    error,
    createActividad: createItem,
    updateActividad: updateItem,
    deleteActividad: deleteItem,
    getActividadById: getItemById,
    getActividadesByLote,
  };
}
