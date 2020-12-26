const express = require('express');
const app = express();
// フロントから送られたデータを扱えるようにするライブラリ
const parser = require("body-parser");
// Todoモデルを扱えるようにする
const Todo = require("./models").todo;


app.use(parser.urlencoded({
 extended: true
}));

app.use(parser.json());

app.get('/', (req, res) => {
 res.send('今日はいい天気！');
});

app.listen(3000, () => {
   console.log("3000番ポートが開きました！");
});

// データの作成・保存
app.get("/todo/test", async (req, res) => {
   const new_todo = await Todo.create({
       content: "本番です。"
   });
//   クライアントサイドにデータを送るにはresオブジェクトを使う
   res.status(200).json({ new_todo });
});

// クライアントから送られた任意のtext_dataを作成、保存
app.post("/todo", async (req, res) => {
//   req：クライアントからサーバーに送られたデータ
   const text_data = req.body.text_data;
   Todo.create({
       content: text_data
   });
// res：サーバーからクライアントに送り返すデータ
   res.status(200).json("新規作成ができた！");
});

// 登録済みデータの一括取得
app.get("/todos", async (req, res) => {
   const todos = await Todo.findAll();
   res.status(200).json({ todos: todos });
});

// 登録済みデータを1件取得
app.get("/todo/:id", async (req, res) => {
   const todo_id = req.param("id");
   const todo = await Todo.findOne({
       where: { id: todo_id }    
   });
   res.status(200).json({ todo: todo });
});

// 登録済みデータの編集
app.post("/todo/:id/edit", async (req, res) => {
   const todo_id = req.param("id");
   const text_data = req.body.text_data;
   const todo = await Todo.findOne({
       where: { id: todo_id }
   });
   todo.content = text_data;
   await todo.save();
   res.status(200).json({ todo: todo })
});

// 登録データの削除
app.get("/todo/:id/delete", async (req, res) => {
   const todo_id = req.param("id");
   await Todo.destroy({
       where: { id: todo_id }
   });
   res.status(200).json("削除できました！");
});