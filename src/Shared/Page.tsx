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
          marginLeft: "40px",
          marginRight: "40px",
          marginBottom: "20px",
          color: "#212F3C",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Page;
