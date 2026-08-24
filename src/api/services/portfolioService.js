import { parseBody } from "../helpers/index.js";
import { BaseService } from "./baseService.js";

export class PortfolioService extends BaseService {
  // create — POST /portfolio. Создать портфолио.
  // data — тело запроса, собранное билдером.
  async create(data) {
    const response = await this.request.post("/portfolio", {
      data,
      headers: this._headers(),
    });

    const body = await parseBody(response);
    return { status: response.status(), body };
  }

  // update — PUT /portfolio/{id}. Полностью обновить портфолио по id.
  async update(id, data) {
    const response = await this.request.put(`/portfolio/${id}`, {
      data,
      headers: this._headers(),
    });

    const body = await parseBody(response);
    return { status: response.status(), body };
  }

  // remove — DELETE /portfolio/{id}. Удалить портфолио по id.
  async remove(id) {
    const response = await this.request.delete(`/portfolio/${id}`, {
      headers: this._headers(),
    });

    const body = await parseBody(response);
    return { status: response.status(), body };
  }

  // getById — GET /portfolio/{id}. Получить портфолио по id.
  async getById(id) {
    const response = await this.request.get(`/portfolio/${id}`, {
      headers: this._headers(),
    });

    const body = await parseBody(response);
    return { status: response.status(), body };
  }
}
