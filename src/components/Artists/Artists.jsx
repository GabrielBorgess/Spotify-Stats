import PropTypes from 'prop-types'

const Artists = (props) => {
  return (
   <>
     <div className='w-full flex flex-wrap justify-center p-8'>
            {props.topArtists.map((artist, index) => (
              <div className='text-white m-4 flex flex-col items-center w-52' key={index}>
                <img className='w-48 m-4 rounded-xl' src={artist.images[0].url} alt="" />
                <p>{index + 1 + 'º'}</p>
                <h3 className='font-bold text-2xl'>{artist.name}</h3>
              </div>
            ))}
    </div>
   </>
  )
}

Artists.propTypes = {
    topArtists: PropTypes.array.isRequired
}

export default Artists