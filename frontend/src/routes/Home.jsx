function Home(userInfo) {
  console.log(userInfo);
  return (
    <>
      <p>This is the home page</p>
      <p>{userInfo.userInfo}</p>
    </>
  );
}

export default Home;
