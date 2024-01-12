import PropTypes from 'prop-types'

const TextElements = (props) => {
  return (
    <>
    <h1 className='font-bold text-7xl text-white pt-10 pb-5'>Spotify Stats</h1>
    {props.topArtists.length === 0 && (
        <>
        <p className='text-white ml-5 mr-5'>Simply authenticate with Spotify, and your top artists will be displayed instantly.</p>
        <button onClick={props.fetchData} className='m-8 p-4 font-semibold text-zinc-900 border-2 max-w-4xl rounded-lg bg-slate-100'>Get my Spotify Stats</button>
        </>
    )}
    </>
  )
}

TextElements.propTypes = {
    fetchData: PropTypes.func.isRequired,
    topArtists: PropTypes.array.isRequired,
  };

export default TextElements