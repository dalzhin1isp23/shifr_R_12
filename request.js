const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");


const DUMMY_JSON_URL = "https://dummyjson.com/products ";

let products = []; 


function fetchInitialProducts() {
  return new Promise((resolve, reject) => {
    https.get(`${DUMMY_JSON_URL}?limit=100`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          products = JSON.parse(data).products;
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}


const server = http.createServer((req, res) => {
  const { url, method } = req;


  if (url === "/" || url === "/index.html") {
    fs.readFile(path.join(__dirname, "public", "index.html"), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Ошибка сервера");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
    return;
  }

  // Стили
  if (url === "/style.css") {
    fs.readFile(path.join(__dirname, "public", "style.css"), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Ошибка сервера");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(content);
      }
    });
    return;
  }

  // JS клиентский
  if (url === "/script.js") {
    fs.readFile(path.join(__dirname, "public", "script.js"), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Ошибка сервера");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(content);
      }
    });
    return;
  }

  // Получение всех продуктов
  if (url === "/products" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
    return;
  }

  // Добавление нового продукта
  if (url === "/products" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const newProduct = JSON.parse(body);
        newProduct.id = Date.now(); // Простая генерация ID
        products.push(newProduct);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newProduct));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Неверный формат данных" }));
      }
    });
    return;
  }

  // Скачивание JSON файла
  if (url === "/download" && method === "GET") {
    const filename = "products.json";
    const filePath = path.join(__dirname, filename);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Ошибка сохранения файла");
        return;
      }

      res.writeHead(200, {
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type": "application/json"
      });

      fs.createReadStream(filePath).pipe(res);
    });
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Маршрут не найден" }));
});

// Запуск сервера после загрузки данных
fetchInitialProducts()
  .then(() => {
    const PORT = 3000;
    server.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Не удалось загрузить данные:", err);
  });