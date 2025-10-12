import { useEffect, useRef, useState } from 'react';
import { cvStorage } from '../services/cvStorage';
import { cvAPI } from '../services/cvAPI'; // respecte ta convention services/*

/**
 * useAutoSave
 * - API inchangée: retourne { saveStatus, triggerSave }
 * - Debounce la sauvegarde; 1ère => createCV, suivantes => updateCV
 * - Gère hors-ligne (queue locale) + retry
 */
export function useAutoSave(cvData, delay = 1200) {
  const [saveStatus, setSaveStatus] = useState('Enregistré');
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const savingRef = useRef(false);

  // id CV persistant (localStorage) pour reprendre après refresh
  const resumeIdRef = useRef(cvStorage.getResumeId() || null);

  // file d’attente hors-ligne (ex: si navigator.onLine === false)
  const pendingQueueRef = useRef([]);

  // ————— helpers —————

  const isOnline = () =>
    typeof navigator !== 'undefined' ? navigator.onLine : true;

  const doCreate = async (data) => {
    const res = await cvAPI.createCV(data);
    if (res && (res.id || res.data?.id)) {
      const id = res.id || res.data.id;
      resumeIdRef.current = id;
      cvStorage.setResumeId(id);
      return id;
    }
    throw new Error('CREATE_FAILED');
  };

  const doUpdate = async (id, data) => {
    return cvAPI.updateCV(id, data);
  };

  const flushQueue = async () => {
    if (savingRef.current) return;
    if (!resumeIdRef.current) return;
    if (!pendingQueueRef.current.length) return;

    savingRef.current = true;
    try {
      setSaveStatus('Enregistrement...');
      // On applique la dernière version connue (écrase les anciennes)
      const last = pendingQueueRef.current[pendingQueueRef.current.length - 1];
      pendingQueueRef.current = [];
      await doUpdate(resumeIdRef.current, last);
      lastSavedRef.current = last;
      setSaveStatus("Enregistré à l'instant");
    } catch (e) {
      // On remet en file d’attente
      pendingQueueRef.current.push(lastSavedRef.current || {});
      setSaveStatus('Erreur — nouvelle tentative bientôt');
    } finally {
      savingRef.current = false;
    }
  };

  // tentative de flush quand on redevient en ligne
  useEffect(() => {
    const onOnline = () => flushQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ————— triggerSave (API publique du hook) —————
  const triggerSave = (newData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      // si pas de changement, ne rien faire
      const serializedPrev = JSON.stringify(lastSavedRef.current || {});
      const serializedNew = JSON.stringify(newData || {});
      if (serializedPrev === serializedNew) {
        setSaveStatus('Enregistré');
        return;
      }

      // si hors-ligne → file d’attente
      if (!isOnline()) {
        pendingQueueRef.current.push(newData);
        setSaveStatus('Hors-ligne — en attente de connexion…');
        lastSavedRef.current = newData; // on garde la dernière version
        return;
      }

      setSaveStatus('Enregistrement...');
      savingRef.current = true;
      try {
        if (!resumeIdRef.current) {
          // première sauvegarde → création
          const id = await doCreate(newData);
          resumeIdRef.current = id;
        } else {
          // mises à jour suivantes
          await doUpdate(resumeIdRef.current, newData);
        }
        lastSavedRef.current = newData;
        setSaveStatus("Enregistré à l'instant");
      } catch (e) {
        // si erreur réseau → on file d’attente
        pendingQueueRef.current.push(newData);
        setSaveStatus('Erreur — nouvelle tentative bientôt');
      } finally {
        savingRef.current = false;
      }
    }, delay);
  };

  // Ignorer la toute première exécution (montage)
  useEffect(() => {
    if (!lastSavedRef.current) {
      lastSavedRef.current = cvData || {};
      return;
    }
    // On ne déclenche pas automatiquement ici : c’est l’éditeur qui appelle triggerSave(newData)
    // pour rester 100% compatible avec ton architecture actuelle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData]);

  // Nettoyage du debounce
  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return { saveStatus, triggerSave };
}
