import classes from '@/components/list/List.module.css'
import Spinner from '../spinner/Spinner';

export default function List({ data }) {

  return <div className={classes.list}>
    {data.map(({ id, body }) => {
      
      return <div data-id={id} className={classes.todo} key={body}>
        <div>{body}</div>
        <button className={classes.delete} data-action='del'>❌</button>
      </div>
    })}
  </div>
}