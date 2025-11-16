"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

export default function Home() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    // observeQueryはリアルタイム更新を購読し、初期データも取得します
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  async function createTodo() {
    if (!content.trim()) return;
    await client.models.Todo.create({
      content,
      isDone: false,
    });
    setContent("");
  }

  async function toggleTodo(todo: Schema["Todo"]["type"]) {
    await client.models.Todo.update({
      id: todo.id,
      isDone: !todo.isDone,
    });
  }

  async function deleteTodo(id: string) {
    await client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>My ToDo App</h1>
            <div>
              <span style={{ marginRight: "1rem" }}>
                👋 {user?.signInDetails?.loginId}
              </span>
              <button onClick={signOut}>サインアウト</button>
            </div>
          </div>

          <div style={{ margin: "2rem 0" }}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="新しいToDoを入力"
              style={{ padding: "0.5rem", width: "70%", marginRight: "1rem" }}
              onKeyPress={(e) => e.key === "Enter" && createTodo()}
            />
            <button onClick={createTodo} style={{ padding: "0.5rem 1rem" }}>
              追加
            </button>
          </div>

          <div>
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  marginBottom: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.isDone || false}
                  onChange={() => toggleTodo(todo)}
                  style={{ marginRight: "1rem" }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.isDone ? "line-through" : "none",
                    color: todo.isDone ? "#999" : "#000",
                  }}
                >
                  {todo.content}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>削除</button>
              </div>
            ))}
          </div>
        </main>
      )}
    </Authenticator>
  );
}
