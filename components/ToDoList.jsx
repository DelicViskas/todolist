import useSWR from "swr";
import FormToDo from "./form/FormToDo";
import List from "./list/List";
import { fetcher } from "./f";
import { useState } from "react";
import Spinner from "./spinner/Spinner";

const API_URL = '/api/todos';

export default function ToDoList() {
  const
    { data, mutate } = useSWR(API_URL, fetcher, { revalidateOnFocus: false }),
    [valueInput, setValueInput] = useState(''),
    onClick = async event => {
      const
        action = event.target.closest('[data-action]')?.dataset.action,
        id = event.target.closest('[data-id]')?.dataset.id;
      if (!action) return;
      let optimisticData;
      const getPromise = () => {
        switch (action) {
          case 'del':
            optimisticData = data.map(todo => {
              if (String(todo.id) === id)
                return {
                  ...todo,
                  body: <Spinner />
                };
              return todo;
            });
            
            return fetch(API_URL + '/' + id, { method: 'DELETE' })
              .then(res => {
                if (!res.ok)
                  throw (new Error(res.status + ' ' + res.statusText))
              });
              
          case 'add':
            if (!valueInput.trim()) {
              console.error("Input is empty, not sending request");
              return; 
            }
            const
              newTodo = { body: valueInput };
            optimisticData = data.concat(newTodo);
            setValueInput('');
            console.log(JSON.stringify(newTodo));
            
            return fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTodo)
            }).then(res => {
              if (!res.ok)
                throw (new Error(res.status + ' ' + res.statusText));
            })
        }
      },
        promise = getPromise();
      promise && await mutate(promise.then(() => optimisticData, () => fetcher(API_URL)), { optimisticData, revalidate: true });
    }
    
  return <main onClick={onClick}>
    <FormToDo valueInput={valueInput} setValueInput={value => setValueInput(value)} />
    {data && <List data={data} />}
  </main>
}