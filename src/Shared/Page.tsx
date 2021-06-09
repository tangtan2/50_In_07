import Header from "./Header";

const Page = ({ children }: any) => {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
      }}
    >
      <Header />
      <div
        style={{
          marginTop: "45px",
          fontFamily: "Nunito Sans",
          marginLeft: "10px",
          marginRight: "10px",
          color: "#212F3C",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Page;
