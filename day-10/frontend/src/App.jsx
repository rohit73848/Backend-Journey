import { useState } from "react";
import axios from "axios"
function App() {
  const [notes, setNotes] = useState([
   
  ]);

axios.get('http://localhost:3000/api/notes')
.then((res)=>{
  setNotes(res.data.notes)
})

  return (
    <>
      <div className="notes">
        {notes.map((note, index) => {
          return (
            <div className="note" key={index}>
              <h1>{note.title}</h1>
              <p>{note.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
