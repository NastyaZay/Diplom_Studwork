import { parseBody } from "../helpers/index.js";
import { BaseService } from "./baseService.js";

export class FileService extends BaseService {
  // uploadPreview — POST /portfolio/file/{type}. Загружаем файл-превью портфолио.
  // type — тип файла в пути (по ответу create это "preview").
  // file — объект { name, mimeType, buffer } с содержимым файла.
  // Отправляем как multipart/form-data, поле называется "file".
  async uploadPreview(file, type = "preview") {
    const response = await this.request.post(`/portfolio/file/${type}`, {
      headers: this._headers(),
      // multipart — Playwright сам выставит Content-Type: multipart/form-data
      multipart: {
        file: {
          name: file.name,
          mimeType: file.mimeType,
          buffer: file.buffer,
        },
      },
    });

    const body = await parseBody(response);
    // достаем id файла из ответа - форму ответа этого эндпоинта знает сам сервис
    const fileId = body?.file?.id ?? null;
    return { status: response.status(), body, fileId };
  }
}
