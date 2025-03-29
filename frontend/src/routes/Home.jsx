import Header from "../components/Header";

import "../styles/home.css";

function Home({ userInfo }) {
  return (
    <>
      <div className="home-content">
        <Header displayName={userInfo.displayName} />
        <p>This is the home page</p>
        <p>{userInfo.uid}</p>
        <p>{userInfo.displayName}</p>
      </div>
    </>
  );
}

export default Home;
