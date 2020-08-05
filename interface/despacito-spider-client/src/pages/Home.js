import React from 'react';

// Components
import NavBar from '../components/Navbar';

function Home(props) {
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        <a href="/guilds">Guilds list</a>
        <br />
        <a href="/commands">Commands</a>
      </div>
    </div>
  );
}

export default Home;
