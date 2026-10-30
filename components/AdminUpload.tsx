"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Loader2, LogIn, LogOut } from "lucide-react";

const DEVELOPER_EMAIL = "ibnusenamhmd@gmail.com";

export default function AdminUpload({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isDevUrl, setIsDevUrl] = useState(false);

  useEffect(() => {
    // Cek apakah URL mengandung ?dev=true
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("dev") === "true") {
      setIsDevUrl(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 1. Jika URL TIDAK ADA ?dev=true, sembunyikan total (Rekruter aman melihat web bersih)
  if (!isDevUrl) {
    return null;
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Gagal login:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 2. Jika belum login atau bukan email kamu, tampilkan tombol "Login sebagai Developer"
  if (!currentUser || currentUser.email !== DEVELOPER_EMAIL) {
    return (
      <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl my-4 text-center">
        <p className="text-xs text-slate-600 mb-2">🔒 Area Khusus Developer (Terkunci)</p>
        <button
          onClick={handleGoogleLogin}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          <span>Login Google (Ibnu Sena)</span>
        </button>
      </div>
    );
  }

  // Fungsi Upload File
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `developer-uploads/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      onUploadSuccess(downloadURL);
      alert("File berhasil di-upload!");
    } catch (error) {
      console.error("Gagal mengupload file:", error);
      alert("Terjadi kesalahan saat mengupload file.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Jika sudah di mode ?dev=true DAN sudah login pakai email kamu, tampilkan panel upload!
  return (
    <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl my-4 shadow-md text-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <Upload className="w-4 h-4" /> Panel Developer Aktif ({currentUser.email})
        </p>
        <button
          onClick={handleLogout}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
        >
          <LogOut className="w-3 h-3" /> Keluar
        </button>
      </div>

      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow">
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Mengupload ke Firebase...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Pilih & Upload Foto/Sertifikat</span>
          </>
        )}
        <input 
          type="file" 
          onChange={handleFileChange} 
          disabled={uploading} 
          className="hidden" 
          accept="image/*,application/pdf"
        />
      </label>
    </div>
  );
}