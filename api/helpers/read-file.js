import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Папка со статичными тестовыми файлами-данными (картинка-превью для загрузки).
const TEST_FILES_DIR = path.join(__dirname, "../../tests/test-files");

// readPreviewFile — читает тестовую картинку с диска и возвращает объект,
// готовый для загрузки через multipart: { name, mimeType, buffer }.
export function readPreviewFile(fileName = "preview.jpg") {
  const filePath = path.join(TEST_FILES_DIR, fileName);
  return {
    name: fileName,
    mimeType: "image/jpeg",
    buffer: fs.readFileSync(filePath),
  };
}
