import PropTypes from 'prop-types'

const UserInfo = (props) => {
  return (
    <>
        {props.topArtists.length !== 0 && (
          <div className='flex flex-col items-center'>
            <img className='rounded-full m-4' src={props.userProfile.images[0].url} alt="" />
            <h3 className='font-bold text-2xl text-zinc-200'>{'Most listened to artists:'}</h3>
            <p className='text-white'>(approximately last 6 months)</p>
          </div>
        )}
    </>
  )
}

UserInfo.propTypes = {
    topArtists: PropTypes.array.isRequired,
    userProfile: PropTypes.any
}

export default UserInfo