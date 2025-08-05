export default function Button({ clickedIt, buttonName, classname }) {
  return (
    <button onClick={clickedIt} className={classname}>
      {buttonName}
    </button>
  )
}
