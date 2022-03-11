import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [cards, setcards] = useState([])
  const [lists, setlists] = useState([])
  const [editList, seteditList] = useState(null)
  const getCard = () => {
    axios.get('http://localhost:3001/cards').then((res) => setcards(res.data))
  }
  const getList = () => {
    axios.get('http://localhost:3001/lists').then((res) => setlists(res.data))
  }
  useEffect(() => {
    getList()
    getCard()
  }, [])
  const saveNewList = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/lists', { name: e.target.newlist.value }).then(() => {
      getList()
      e.target.newlist.value = ''
    })
  }
  const saveNewCard = (e, id) => {
    e.preventDefault()
    axios.post('http://localhost:3001/cards', { name: e.target.newcard.value, list: id }).then(() => {
      getCard()
      e.target.newcard.value = ''
    })
  }
  const saveEditList = (e, id) => {
    e.preventDefault()
    axios.patch(`http://localhost:3001/lists/${id}`, { name: e.target.editlist.value }).then(() => {
      getList()
      e.target.editlist.value = ''
      seteditList(null)
    })
  }
  const deleteCard = (id) => {
    axios.delete(`http://localhost:3001/cards/${id}`).then(() => {
      getCard()
    })
  }
  return (
    <div className='flex overflow-auto gap-3'>
      {
        lists.map((list, a) => {
          const listed = cards.filter((x) => x.list === list.id)
          return <div className='border border-gray-500 p-4 space-y-3'>
            {editList === a ?
              <form onSubmit={(e) => saveEditList(e, list.id)}>
                <input type="text" name="editlist" id="" placeholder='Edit list' defaultValue={list.name} />
                <button type="submit">save</button>
              </form>
              : <h1 onClick={() => seteditList(a)}>{list.name}</h1>
            }

            {listed.map((card, b) => {
              return <div className='border border-gray-500 p-4 flex justify-between'>
                {card.name} <button onClick={(e) => deleteCard(card.id)}>x</button>
              </div>
            })}
            <form onSubmit={(e) => saveNewCard(e, list.id)}>
              <input type="text" name="newcard" id="" placeholder='Type to create new card' />
              <button type="submit">save</button>
            </form>
          </div>
        })
      }
      <div className='border border-gray-500 p-4'>
        <form onSubmit={saveNewList}>
          <input type="text" name="newlist" id="" placeholder='Type to create new list' />
          <button type="submit">save</button>
        </form>
      </div>
    </div>
  );
}

export default App;
