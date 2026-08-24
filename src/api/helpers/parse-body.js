// Аккуратно парсим тело ответа: если тело пустое (например, при 204 или удалении) — вернем null,
// иначе распарсим как JSON. Это защищает тесты от падения на JSON.parse('') ошибках.
export async function parseBody(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text; // если пришел не json (например текст ошибки) — вернем как есть
  }
}
