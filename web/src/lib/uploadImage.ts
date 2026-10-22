import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage, isFirebaseConfigured } from "@/lib/firebase";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecione um arquivo de imagem.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  if (!isFirebaseConfigured()) {
    return fileToDataUrl(file);
  }

  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage indisponível.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `products/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
