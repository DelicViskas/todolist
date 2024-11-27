import { useState } from "react";
import classes from '@/components/form/FormToDo.module.css'

export default function FormToDo({ valueInput, setValueInput }) {
  return <>
    <input className={classes.todoInput} type="text" value={valueInput} onChange={event => setValueInput(event.target.value)} />
    <button className={classes.btn} data-action='add'>Добавить</button>
  </>
}