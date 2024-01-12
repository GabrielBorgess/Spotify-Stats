import { useState } from 'react';
import './index.css'

//Components
import TextElements from './components/textElements/TextElements';
import UserInfo from './components/UserInfo/UserInfo';
import Artists from './components/Artists/Artists';

const callbackUrl = 'http://localhost:5173/callback'

function App() {
  const clientId = "b127e89b86d2450c99868c6ab0de314c";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const [topArtists, setTopArtists] = useState([])
  const [userProfile, setUserProfile] = useState(null)

  const fetchData = async () => {
    if(!code){
      await redirectToAuthCodeFlow(clientId)
    } else {
      try {
        const accessToken = await getAccessToken(clientId, code);
        const userProfile = await getUserProfile(accessToken);
        const userTops = await getUserTops(accessToken)
        setTopArtists(userTops.items)
        setUserProfile(userProfile)
      } catch (error) {
        console.error('Erro no fetchData', error)
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
    params.append("redirect_uri", callbackUrl);
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
    params.append("redirect_uri", callbackUrl);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
  };

  const getUserTops = async (token) => {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=15", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
  };

  const getUserProfile = async (token) => {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
  };

  return (
    <div className='bg-gradient-to-b from-green-950 via-gray-900 to-gray-950 min-h-screen flex justify-center text-center flex-col'>
     <div className='z-10'>
        <TextElements topArtists={topArtists} fetchData={fetchData}/>
        <UserInfo topArtists={topArtists} userProfile={userProfile}/>
        <Artists topArtists={topArtists}/>
     </div>
    </div>
  )
}

export default App
