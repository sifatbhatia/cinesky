import axios from "axios";

const API_URL="https://weather-app-backend-4a2p.onrender.com/api/v1/list/"
async function createTodo(location,weather,date) {
  const { data: newTodo } = await axios.post(API_URL, {
    location,
    weather,
    date
  });
  return newTodo;
}

async function deleteTodo(id) {
  
  const message = await axios.delete(`${API_URL}${id}`);
  return message;
}

async function updateTodo(id, payload) {
  const {data:newTodo} = await axios.put(`${API_URL}${id}`, payload);
  return newTodo;
}

async function getAllTodos() {
  const { data: todos } = await axios.get(API_URL);
  return todos;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { createTodo, deleteTodo, updateTodo, getAllTodos };