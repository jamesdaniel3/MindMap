function Home(userInfo) {
  return (
    <>
      <p>This is the home page</p>
      <p>{userInfo.userInfo.uid}</p>
      <p>{userInfo.userInfo.displayName}</p>
    </>
  );
}

export default Home;
