import './index.css'

function App() {
  const getSpotifyUser = async () => {
      window.open('http://localhost:8080/login', 'Spotify Authorization', 'width=600,height=600');
  };

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
