import { useState } from 'react';
import './index.css'

function App() {
  const clientId = "b127e89b86d2450c99868c6ab0de314c";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const [topArtists, setTopArtists] = useState([])

  const fetchData = async () => {
    console.log(code)
    if(!code){
      await redirectToAuthCodeFlow(clientId)
    } else {
      try {
        const accessToken = await getAccessToken(clientId, code);
        const userProfile = await getUserProfile(accessToken);
        console.log(userProfile.items)
        setTopArtists(userProfile.items)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const redirectToAuthCodeFlow = async (clientId) => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
  };

  const generateCodeVerifier = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  };

  const getAccessToken = async (clientId, code) => {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
  };

  const getUserProfile = async (token) => {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
  };

  return (
    <div className='bg-gradient-to-b from-blue-900 via-blue-950 to-gray-900 min-h-screen flex justify-center text-center flex-col'>
     <div className=''>
        <h1 className='font-sans font-bold text-7xl text-white pt-10'>Spotify Stats</h1>
        {topArtists.length === 0 && (
          <button onClick={fetchData} className='m-8 p-4 text-white border-2 w-2/5 rounded-lg'>Get my Spotify Stats</button>
        )}
        <div className='w-full flex flex-wrap justify-center p-8'>
            {topArtists.map((artist, index) => (
              <div className='text-white m-4 flex flex-col items-center w-52' key={index}>
                <img className='w-48 m-4 rounded-xl' src={artist.images[0].url} alt="" />
                <p>{index + 1 + 'º'}</p>
                <h3 className='font-bold text-2xl'>{artist.name}</h3>
              </div>
            ))}
        </div>
     </div>
    </div>
  )
}

export default App
