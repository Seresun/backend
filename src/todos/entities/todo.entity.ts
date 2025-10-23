export class Todo {
  id: string;
  text: string;
  completed: boolean;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
}
