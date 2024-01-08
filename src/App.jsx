import './index.css'

function App() {
  const getSpotifyUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        mode: 'no-cors'
      });

      if (!response.ok) {
        throw new Error('Erro ao autenticar com o Spotify');
      }
      
      const data = await response.json()
      console.log(data)
      
    } catch (error) {
      console.log(error)
      throw(error)
    }
  }

  return (
    <div className='bg-gradient-to-b from-blue-900 via-blue-950 to-gray-900 min-h-screen flex justify-center text-center flex-col'>
     <div className=''>
        <h1 className='font-sans font-bold text-7xl text-white'>Spotify Stats</h1>
        <button onClick={getSpotifyUser} className='m-8 p-4 text-white border-2 w-1/5 rounded-lg'>Get my Spotify Stats</button>
     </div>
    </div>
  )
}

export default App
