// client/src/components/editor/PhotoUploader.js
import React, { useRef, useState } from 'react';
import { apiUpload } from '../../services/api';

const PhotoUploader = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await apiUpload.uploadPhoto(file);
      onChange(url);
    } catch (e) {
      console.error(e);
      alert("Échec de l'upload de la photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full overflow-hidden ring-1 ring-gray-200 shadow">
        {value ? (
          <img src={value} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-gray-500">Aucune photo</div>
        )}
      </div>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={handlePick}
          className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:opacity-90 disabled:opacity-50 transition"
          disabled={busy}
        >
          {busy ? 'Chargement…' : 'Importer une photo'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Supprimer la photo
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
