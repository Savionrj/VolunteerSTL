export default function Button({ clickedIt, buttonName }) {
  return (
    <button onClick={clickedIt}>{buttonName}</button>
  )
}
